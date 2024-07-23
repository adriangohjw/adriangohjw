---
layout: blog
title:  "Migrating From Sidekiq To Solid Queue: Simpler and Cheaper"
date:   2024-07-10 +0800
categories: blogs
tags: [ruby on rails]
---

## Sidekiq Is Great!

[Sidekiq](https://github.com/sidekiq/sidekiq) has been the go-to choice for Ruby on Rails applications for years. And for good reason — it’s packed with incredible features.

Huge shoutout to the team for open-sourcing such a powerful tool!

## Why Make The Switch To Solid Queue?

Late last year, DHH unveiled [Solid Queue](https://x.com/dhh/status/1736862654411739364) - a new gem to leverage your existing database to handle background jobs. And the results speak for themselves: 37signals is processing about 5.6 million jobs daily with it.

<div style="display: flex; justify-content: center;">
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Solid Queue, the new DB-based backend for Active Job in Rails, has made its premiere! We&#39;re running millions of jobs through it every day, and replaced a plethora of Resque gems to get the introspection and features we need. Check it out: <a href="https://t.co/lxqrl2vjoK">https://t.co/lxqrl2vjoK</a></p>&mdash; DHH (@dhh) <a href="https://twitter.com/dhh/status/1736862654411739364?ref_src=twsrc%5Etfw">December 18, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

Simplifying our codebase like that is incredibly appealing, so naturally, I had to dive deeper into it.

The setup was a breeze, and we wrapped up the entire migration, including testing, in a single day.

Here’s my take on Solid Queue compared to Sidekiq—what I love and what I don’t.

## 😄 Reduced Redis Usage

Sure, Redis wasn’t breaking the bank on our cloud bill, but it was pulling double duty as our job scheduler and cache store.

By ditching Redis for Sidekiq, we get two wins:
1. A leaner, cheaper Redis setup
2. More room for our cache, which means fewer evictions, more cache hits, and snappier responses.

## 😄 Built-in Cron Runner

Before, when using Sidekiq, we had to scramble for a job scheduler since Sidekiq doesn't come with a built-in cron feature.

Take this for example: we had to install the [Whenever gem](https://github.com/javan/whenever) to handle job scheduling. And because we're deploying via a Dockerfile to Fly.io, we also needed to [install cron and set up Supercronic as our job runner](https://fly.io/docs/blueprints/supercronic/).

But with Solid Queue, all that hassle is gone! Now, we can manage everything right in the solid_queue.yml file. It's streamlined, and it just works.

![](/assets/migrating-from-sidekiq-to-solid-queue-remove-cron.png)

## 😄 Less Processes → Cost Savings

Previously, using Sidekiq meant spinning up a separate machine for each process handling different queues. This was inefficient, as these machines often sat idle, wasting resources. For instance, we had to deploy four processes—one for cron jobs and three for Sidekiq.

```toml
# We are using Flu.io, thus defining processes within fly.toml
# Reference: https://fly.io/docs/reference/configuration/
[processes]
  cron = "supercronic ./crontab"
  sidekiq_1 = "bundle exec sidekiq -c 100 -q logging -q default -q llm"
  sidekiq_2 = "bundle exec sidekiq -c 10 -q mailers -q scrapers"
  sidekiq_3 = "bundle exec sidekiq -c 1 -q refresh_salary_views"
```

With Solid Queue, all workers run on the same machine. Plus, with Cron now integrated, there's no need for a separate machine for cron jobs. We've reduced our hardware requirements from four machines to just one—an efficient and cost-effective solution!

```yml
# solid_queue.yml
workers:
  - queues: [logging, default, llm]
    threads: 100
  - queues: [mailers, scrapers]
    threads: 10
  - queues: [refresh_salary_views]
    threads: 1
```

## 😔 "Mission Control" Can Be Improved

This isn't a deal breaker by any means, but my greedy desires show up here.

Unlike Sidekiq, SolidQueue doesn't come with a built-in dashboard. You'll need to install a separate gem called [Mission Control](https://github.com/rails/mission_control-jobs) for that. No biggie.

And for the most part, Mission Control does a solid job at mimicking Sidekiq's dashboard.

But it'd be fantastic if it also included charts to quickly visualize the number of jobs processed and the average time taken for each type. That kind of insight can be pretty useful for debugging and optimization.
