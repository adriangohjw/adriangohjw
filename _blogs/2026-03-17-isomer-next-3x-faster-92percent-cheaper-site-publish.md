---
layout: blog
title: "3x Faster, 92% Cheaper: How We Scaled Isomer Next for Government Websites"
date:   2026-03-17 +0800
categories: blogs
tags: [optimization, nextjs, codebuild, opengovsg]
---

> **Note:** This post is published on [OpenGovSG's Substack](https://opengovsg.substack.com/p/3x-faster-92-cheaper-how-we-scaled)

_TLDR: Reduced the time to publish updates for a huge government site from 30 minutes to 10 minutes, while cutting costs by 92%. We (1) moved data to the server with React Server Components to shrink artifacts 145GB to 7GB, (2) increased S3 upload concurrency, (3) switched to ARM/Graviton builds for 22–25% faster + cheaper, (4) cached node_modules to S3, and (5) upgraded to Next.js 15 for ~40% faster SSG._
