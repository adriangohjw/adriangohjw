---
layout: blog
title: Reducing Concurrent Database Queries by 3x
date:   2024-07-02 +0800
categories: blogs
tags: [optimization, postgresql, ruby on rails]
---

## <b>TL;DR</b>

Our application crashed due to the database hitting its maximum concurrency connection limits. I reduced the number of concurrent queries by up to 3x by reducing the number of database queries and refactoring frequently accessed queries to be faster.

## Everything Changed When The `PG::TooManyConnections` Attacked

The number of people using [NodeFlair](https://nodeflair.com) was steadily increasing, and everything seemed great.

Then, one day, our application crashed, and I received this notification from our error logging software:

![](/assets/reducing-concurrent-database-queries-cover.png)

What? I wasn't aware this was even possible at our scale! So I started looking into it to learn more.

## Every Postgres Database has a `max_connections`

We are using Amazon Relational Database Service (RDS) for our PostgreSQL database, and the [maximum number of connections for PostgreSQL is preset](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Limits.html#RDS_Limits.MaxConnections) based on the database's RAM, calculated using the formula `LEAST({DBInstanceClassMemory/9531392}, 5000)`.

![](/assets/reducing-concurrent-database-queries-aws-rds-limits.png)

Since we are using `db.t4g.medium` with 2 vCPU and 4 GB RAM, the maximum should be set to 450 <i>(4294967296 bytes / 9531392)</i>.

However, running `SHOW max_connections;` returns a value of 410.

![](/assets/reducing-concurrent-database-queries-max-connections.png)

This is not an error since AWS documentation also notes:

> However, the variable DBInstanceClassMemory automatically subtracts the amounts reserved to the operating system and the RDS processes that manage the DB instance

## 🔴 Solution 1: Update PostgreSQL configuration to use higher `max_connections`

The first instinct might be to update `postgresql.conf` to increase the `max_connections`.

However, AWS sets it to 410 for good reason.

Each connection uses memory, and more connections can lead to higher memory consumption. What we observed is that when we maxed out our connections, our available RAM approached zero too.

Therefore, merely adjusting the configuration will not resolve the underlying issue.

## 🟡 Solution 2: Increase RAM

We can upgrade our Postgres instance to the `db.t4g.large` tier, which would double our RAM and `max_connections`. However, this upgrade costs twice as much — yikes!

Instead, I was determined to explore ways to optimize our application by digging deeper.

Additionally, 410 concurrent connections seem excessive given the number of RPM (requests per minute) we have, and is likely due to underlying poorly written code.

## 🟢 Solution 3: Reduce number of concurrent queries (duh!)

Previously, we executed different queries in separate threads to speed up responses. While this approach was effective, it significantly increased the number of concurrent queries.

In the example below, the number of concurrent queries in Approach 1 is 3x that of Approach 2.

```ruby
# Approach 1 (Parallel)
threads = []
threads << Thread.new { Query1.call }
threads << Thread.new { Query2.call }
threads << Thread.new { Query3.call }
threads.each(&:join)

# Approach 2 (Serial)
Query1.call
Query2.call
Query3.call
```

Choosing Approach 2 instantly reduces the number of concurrent queries by 3x, which can easily solves our issue.

Although this means slower responses, I believe the slight performance trade-off is worthwhile overall.

## 🟢 Solution 4: Reduce number of queries

In some frequently visited pages, we were using `.count` to retrieve the total number of records. However, .count executes a COUNT query every time.

To optimize this, we replaced `.count` with `.size`. Without going into too much detail, `.size` checks if the relation has already been loaded and uses `.length` if it has.

Since the relation is loaded in our case, this change reduces the number of database queries.

<i>You can read more about it in [3 ActiveRecord Mistakes That Slow Down Rails Apps](https://www.speedshop.co/2019/01/10/three-activerecord-mistakes.html) by Nate Berkopec.</i>

## 🟢 Solution 5: Faster query

Below is a simplified diagram illustrating how faster queries reduce the number of concurrent database connections.

When queries execute more quickly, the number of concurrent queries at any given moment is likely to decrease.

![](/assets/reducing-concurrent-database-queries-faster-query.png)

In our case, the simple fixes include:
1. Reduce unnecessary eager loading
2. Rewriting queries - [Here's an example rewriting ActiveRecord query with raw SQL](/faster-query-rewriting-activerecord-into-raw-sql)
3. Adding indexes to the database

## Conclusion

With these changes, I've reduced the number of concurrent queries to between 100 and 200 — without spending a dime! In fact, I've saved money by cutting bandwidth costs!
