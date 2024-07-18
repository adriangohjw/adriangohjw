---
layout: blog
title:  "Reducing Latencies: Cutting Database Load by 72%"
date:   2024-05-02 +0800
categories: blogs
tags: [optimization, database, postgresql]
---

## TL;DR

Optimizing database performance by adding indexes, extending materialized view refresh rates, and caching frequently accessed queries resulted in a 72% increase in efficiency and reduced costs. These changes collectively decreased database load and improved user experience.

![](/assets/reducing-latencies-cutting-database-load-db-load-improvement.png)

## Introduction

As [NodeFlair](https://nodeflair.com) grows and we’re seeing a 30% month-over-month increase in user sessions, we’re running into performance issues that are affecting the user experience.

Join me as I dive into the problem and show you how I fixed it with just three simple tweaks.

## 🔎 Investigation

<table>
  <tbody>
    <tr>
      <td class="left-column">Database connections remains the same</td>
      <td class="right-column"><img src="/assets/reducing-latencies-cutting-database-load-investigation-db-connections.png"></td>
    </tr>
    <tr>
      <td class="left-column">Freeable memory (RAM) remains the same</td>
      <td class="right-column"><img src="/assets/reducing-latencies-cutting-database-load-investigation-ram.png"></td>
    </tr>
    <tr>
      <td class="left-column">DB Load is increasing!</td>
      <td class="right-column"><img src="/assets/reducing-latencies-cutting-database-load-investigation-db-load.png"></td>
    </tr>
  </tbody>
</table>

When we're using the `db.t4g.medium model` with its 2 vCPUs, we've got to keep the database load under control. If it goes over that limit, performance takes a hit. So, let's dive deep and pinpoint which queries are pushing the load up.

![](/assets/reducing-latencies-cutting-database-load-db-aas-before.png)

## Here's how I reduced the DB Load

One thing I love about Amazon RDS is that it includes free Performance Insights, which allows us to delve into the top SQL queries contributing to the database load.

After experimenting with it a bit, I now have a good idea of some areas where I can optimize.

![](/assets/reducing-latencies-cutting-database-load-top-sql.png)

### 1️⃣ Adding Database Indexes

We had a query relying on a few columns for joins and ordering—columns that weren’t indexed. Adding those indexes cut the database load by 10% (from 2.2 to 2.0). It’s a small tweak, but hey, it’s a solid win right out of the gate!

![](/assets/reducing-latencies-cutting-database-load-solution-add-index.png)

### 2️⃣ Reducing Frequecy of Materialized View Refresh

[NodeFlair's salary data](https://nodeflair.com/salaries) comes from a bunch of sources, and leveraging a [materialized view was a game changer for speed](/improve-database-view-performance-with-materialized-view). It did wonders by pre-computing the data.

But here’s the kicker: as our data points grew to millions, the refresh process started taking up to 6 minutes. That’s bonkers, especially since we’re refreshing every 10 minutes!

So, I had to ask—do we really need this refresh frenzy every 10 minutes? Sure, almost-real-time data sounds great, but the reality is, the data doesn’t shift that much every 10 minutes. Stretching the refresh to 60 minutes doesn’t really hurt the user experience.

Here’s the bonus: by slowing down the refresh rate, we’re also cutting down on query time and database load when not refreshing.

![](/assets/reducing-latencies-cutting-database-load-solution-refresh-view-less-often-query.png)

This is because refreshing involves:
1. Locking tables, which blocks other queries and creates wait times.
2. Heavy I/O operations, which lead to disk contention and slower performance.

Overall, this tweak dropped our database load from 2.0 to 0.7!

![](/assets/reducing-latencies-cutting-database-load-solution-refresh-view-less-often-overall.png)

It’s a solid fix and we can definitely call it quit, but since we’re all about optimization, why not dig deeper and find more ways to scale better for the future?

### 3️⃣ Caching Frequently Queries

We put the final touches on our performance boost by caching frequently accessed but rarely updated values. No need to hit the database every time.

With Ruby on Rails, we’ve got the power of low-level caching and Redis on our side. Fetching from Redis is lightning-fast compared to hitting Postgres. This tweak not only streamlined the process but also enhanced the UX significantly.

The result? We shaved off time from 0.7 to 0.4 seconds.

![](/assets/reducing-latencies-cutting-database-load-solution-caching.png)

## Wrapping Up: Efficiency Boosts at Lower Cost!

In just one day, we cut the average database load from 2.2 to 0.4 — talk about a 72% boost!

Here’s what that means:

We’ve slashed database latencies, giving users a smoother experience. Latencies for landing pages now reliably sit around 600ms, with dips to 400ms during quieter times <i>(check out how we nailed it under 300ms by using [using Cloudflare CF-IPCountry](/using-cloudflare-cf-ipcountry-to-reduce-latencies-by-300ms))</i>.

![](/assets/reducing-latencies-cutting-database-load-latencies.png)

Even better, our database usage dropped by 8% instead of the feared 16% increase, despite a 30% jump in web sessions! That’s because we’re now using t4g DB instances, which only charge us when we go over the baseline (2vCPU in our case). Say goodbye to wasteful charges!


<style>
    /* Basic table styling */
    table {
        border-collapse: collapse;
        margin-bottom: 20px; /* Optional: Adds space below the table */
    }
    td {
        border: 1px solid #dddddd;
        padding: 8px;
        text-align: left;
        vertical-align: middle; /* Centers content vertically */
    }
    .left-column {
        font-weight: 700;
    }
    /* Alternate row colors */
    tr:nth-child(even) {
        background-color: #f2f2f2;
    }
    /* Responsive design */
    @media (max-width: 768px) {
        table, thead, tbody, th, td, tr {
            display: block;
        }
        td {
            border: none; /* Removes borders between cells */
            padding: 8px; /* Adds padding to cells */
            text-align: center; /* Centers content on mobile */
        }
        .left-column {
            max-width: 100%;
            border-bottom: 0px;
        }
        .right-column {
            width: fit-content !important;
        }
        img {
            max-width: 100%; /* Ensures image resizes to fit column width */
            height: auto; /* Maintains aspect ratio */
            display: block; /* Removes any default inline styles */
            margin: 0 auto; /* Centers the image horizontally */
        }
    }
</style>