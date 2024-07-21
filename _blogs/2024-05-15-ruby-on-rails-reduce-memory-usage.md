---
layout: blog
title:  "Ruby on Rails: Reduce Memory Usage by 22%"
date:   2024-05-15 +0800
categories: blogs
tags: [ruby on rails]
---

![](/assets/ruby-on-rails-reduce-memory-usage.jpeg)

## Using Jemalloc

```sh
# Use jemalloc with configuration
RUN apt-get install libjemalloc2
ENV LD_PRELOAD=/usr/lib/x86_64-linux-gnu/libjemalloc.so.2

# 1. Sets a 1-second decay time for dirty pages
# 2. Configures 2 memory arenas to balance performance and memory usage
# 3. Enables a background thread for maintenance tasks to enhance application performance
ENV MALLOC_CONF=dirty_decay_ms:1000,narenas:2,background_thread:true
```

## Less Memory + Faster!

Memory bloating issue reduced by 22% as it plateaus at ~2.9GB instead of ~3.7GB. 

The [NodeFlair](https://nodeflair.com) application should also feel faster now as we reduced the response time by 12% (p0.9) and 55% (p0.99).

## Reference

- [Optimizing your deployment](https://fly.io/docs/rails/cookbooks/deploy/) by Fly.io
- [Malloc Can Double Multi-threaded Ruby Program Memory Usage](https://www.speedshop.co/2017/12/04/malloc-doubles-ruby-memory.html) by Nate Berkopec