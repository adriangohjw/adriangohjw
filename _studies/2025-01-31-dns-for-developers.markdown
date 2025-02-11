---
layout: study
title:  "DNS for Developers (nslookup.io)"
date:   2025-01-31 00:00:00 +0800
image: /assets/dns-for-developers/cover.png
categories: studies
tags: [dns]
---

Just jotting down some quick notes and learnings from the [video course](https://www.nslookup.io/dns-course/) by Ruurtjan Pul from nslookup.io.

![](/assets/dns-for-developers/cover.png)

## Design goals

| Goals | Description | Design pattern |
|-------|-------------|---------------|
| Multi-tenant | Useable by independent entities | Federation (allows multiple DB to function as one) |
| Fault-tolerant | No single point of failure | Replication |
| Scalable | Because the internet grows | Distributed |
| Performant | Slow responses lead to slow applications | Caching |

## Root zones

- 13 root servers because 14th wouldn't fit in a single DNS UDP packet
- They are "well known" and built into DNS resolvers and operating systems
- If one doesn't respond, it will try another -> 12/13 can go down and internet would still work
- Each runs on Anycast network - this allows multiple servers to listen on the same IP address

![](/assets/dns-for-developers/root-servers.png)
