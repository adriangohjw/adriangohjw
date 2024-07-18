---
layout: blog
title: "47% Cheaper: Why We Switched from Amazon RDS to Crunchy Bridge"
date:   2024-07-13 +0800
categories: blogs
tags: [optimization, database, postgresql]
---

## <b>TL;DR</b>

Amazon RDS was excellent for NodeFlair, but its high egress fees made it expensive. I migrated to Crunchy Bridge Managed Postgres Database, reducing our monthly database hosting costs by over 47%.

![](/assets/switching-from-amazon-rds-to-crunchy-bridge-rds-spendings.png)

## Why I love Amazon RDS

Amazon RDS (Relational Database Service) is highly regarded for its stability and reliability, having consistently performed well throughout our years of building [NodeFlair](https://nodeflair.com).

Additionally, it provides extensive metrics that prove invaluable in optimizing database scalability. [Performance Insights](https://aws.amazon.com/rds/performance-insights/), for example, excels in identifying CPU-intensive queries, offering crucial insights for pinpointing optimizations.

![](/assets/switching-from-amazon-rds-to-crunchy-bridge-performance-insights.png)

I'd definitely vouch for AWS RDS as a super safe bet if you're shopping around for top-notch PostgreSQL hosting.

## But RDS Egress is expensive!

While AWS RDS itself comes with decent pricing, the real kicker is those egress fees.

For instance, the first 10TB/month costs $0.12/GB, which means you’re shelling out an extra ~$100 for just 1TB of data transfer.

![](/assets/switching-from-amazon-rds-to-crunchy-bridge-egress-fee.png)

At scale, these costs escalate fast, eroding AWS RDS’s affordability in a hurry.

Case in point: our RDS bill doubled in the last 4 months, despite my ongoing optimization efforts! Time to scout for better options!

## Goodbye AWS - Evaluating our options!

Spoiler: We chose Crunchy Bridge, but here's my thought process when evaluating our options.

The goal was to find a solution that is:
1. Easy to maintain: Time spent maintaining the database means less time for other productive work.
2. Cost-effective: Cheaper in most aspects, both now and in the foreseable future.
3. Reliable: Based on reviews and the service provider's background <i>(preferably not a new database startup that might go bust in a few months)</i>.

### Option 1: Self-managed ([Hetzner](https://www.hetzner.com/) / [Fly Postgres](https://fly.io/docs/postgres/))

Sure, self-managed Postgres is the cheapest option, but at our scale, the risk and time involved in managing our own databases far outweigh any cost savings. Especially when I'm the only full-time engineer at NodeFlair, juggling a ton of other responsibilities.

Plus, Hetzner doesn't even have servers in Singapore. With most of our users here, the latency would be a dealbreaker. It just doesn't make sense.

Fly Postgres caught my eye, particularly since we're already hosting our servers there. Minimal latency sounds great but they’re ultimately [not a managed Postgres service](https://fly.io/docs/postgres/getting-started/what-you-should-know/) too. Even the [CEO of Fly.io tell everyone to use a managed Postgres like Crunchy Bridge](https://news.ycombinator.com/item?id=33810072).

![](/assets/switching-from-amazon-rds-to-crunchy-bridge-flyio-ceo-on-crunchybridge.png)

### Option 2: [Crunchy Bridge](https://www.crunchydata.com/products/crunchy-bridge)

Starting off, no egress fee — awesome!

The overall pricing is also damn reasonable, just $0.10 per GB for storage. It's actually one of the cheapest I've come across!

Their support is top-notch. Before we switched over, their sales team responded lightning fast with detailed, human answers—no cookie-cutter responses. And even after migrating, the support's been stellar. When I hit a snag, they were quick to dive in and help out.

Crunchy Bridge gives off this vibe of actually caring about service quality and keeping things straightforward and fair with their pricing.

### Option 3: [Digital Ocean](https://www.digitalocean.com/products/managed-databases-postgresql)

One of the popular picks from Reddit and Hacker News is DigitalOcean.

Their zero egress charges? Awesome!

But here’s the kicker: the concurrency limit is pretty low. Need more than 200 connections? You gotta upgrade to a pricier instance, which kinda goes against our cost-saving mission. And chances are, we won’t even use all that vCPU, RAM, and storage we’re paying for.

![](/assets/switching-from-amazon-rds-to-crunchy-bridge-digital-ocean.png)

Of course we can overcome that with pgBouncer - but that requires additional work. You can find out more in [this blogpost](https://eoinkelly.info/2023/01/06/rails-and-pgbouncer-notes) by Eoin Kelly.

### Other options: [Supabase](https://supabase.com/), [Neon](https://neon.tech/), [Tembo](https://tembo.io/)

<b>Supabase</b> - Charges $0.09 per GB for bandwidth, which isn't exactly a steal compared to AWS RDS. So, don't expect massive cost savings there.

<b>Neon</b> - Doesn't charge you for egress fees, but they do charge a hefty $1.50 per GB for storage. We've used Neon for some internal tools and had a good run, but if you don't need all the bells and whistles like branching or serverless compute (our DB load's pretty steady), you might end up paying a premium.

<b>Tembo</b> - A newer player in managed PostgreSQL hosting and just scored a Series A. They didn't spell out their egress fees upfront, and I had to wait a few days to get a response. While I'm all for supporting newbies, when it comes to databases, sticking with proven options might be wiser (just like why we skipped self-hosting).

## Migrating to Crunchy Bridge: We saved >47%!

We've seen some remarkable changes since migrating to Crunchy Bridge.

Not only have we trimmed our database costs significantly by more than 47% <i>(mind you, RDS cost was still climbing with rising egress!)</i>, but we've also ramped up performance by doubling our RAM. This move not only saves us from hefty egress fees but also ensures smoother operations.

What's truly surprising is how [Crunchy Bridge's Container Apps](https://docs.crunchybridge.com/container-apps) have come into play. Setting up PGHero, for instance, was a breeze with just a few simple steps. It's these unexpected but incredibly useful features that make a real difference. Perhaps this deserves a deeper dive in a future blog post!

![](/assets/switching-from-amazon-rds-to-crunchy-bridge-crunchybridge-pghero.png)
