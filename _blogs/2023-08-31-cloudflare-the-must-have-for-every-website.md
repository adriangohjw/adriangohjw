---
layout: blog
title:  "Cloudflare: The Must-Have For Every Website"
date:   2023-08-31 +0800
categories: blogs
tags: [optimization, cloudflare]
---

## TL;DR: The Must-Have For Every Website

Scaling is tough and pricey, but Cloudflare is here to save the day. They make your site faster and cheaper with their awesome tools. If I had to pick one recommendation, it’s Cloudflare.

## CDN - Cache Them All!

With Cloudflare CDN, we hit 50% cache on our requests, slashing server data by 23%. This alone saved us a bundle on egress fees.

But we didn’t stop there. We cranked up the caching even more, and that move kept our cloud bill from spiraling out of control.

![](/assets/cloudflare-cdn-cache.png)

## Super Bot Fight Mode and WAF (Web Application Firewall)

With a simple flip of the switch, we slashed the useless scraper requests (like SEO bots and its automated cronies) from 25% to 5%.

And of course, we didn’t stop there. We fine-tuned it further, blocking out even more of those pesky, pointless scrapers.

![](/assets/cloudflare-super-bot-fight-mode.png)

## Cloudflare Argo

For those of us running on Singapore servers, flipping the Argo switch made a noticeable dent in our TTFB (time to first byte) for requests coming from non-Singapore locations.

Take this: Argo's smart routing handled 44.7% of our requests, shaving off 37.4% from the response time.

![](/assets/cloudflare-argo.png)

But hold your horses. Argo charges for egress. So, if your app spews out a ton of data and the speed bump is barely a nudge, it might not be worth the extra coin.

## Other Optimizations

The Pro subscription offers a range of improvements that, while difficult to measure directly, significantly enhance your site's performance and user experience:

### Image Optimization

1. Polish: Your images load faster + WebP support for clients that can handle it

2. Mirage: Enhance load times for pages with images on mobile devices using slow network connections

### Content Optimization

1. Early Hints - Cloudflare preloads assets so browsers start fetching resources before your server even says "200 OK"

2. Rocket Loader - Your JavaScript, including third-party stuff, loads asynchronously. That means your content paints quicker, visitors stay happier, and search engines smile upon you

### Protocols

1. Enhanced HTTP/2 Prioritization - Optimize order of resource delivery

2. 0-RTT Connection Resumption - Better performance for clients who have previously connected to the website

### Others

1. Automatic Signed Exchanges (SXGs) - Boost your Largest Contentful Paint (LCP) and SEO + Chromium browsers will prefetch your site right from the search results
