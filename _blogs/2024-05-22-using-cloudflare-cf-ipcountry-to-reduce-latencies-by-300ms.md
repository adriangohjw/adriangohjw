---
layout: blog
title:  Using Cloudflare's CF-IPCountry to Reduce Latencies by 300ms
date:   2024-05-22 +0800
categories: blogs
---

[cover]:  /assets/improve-latency-of-1st-request-by-300ms.png

![][cover]

# <b>TL;DR</b>

I reduced the latency of users' first requests by 300ms (from an average of 480ms to 180ms) by replacing blocking third-party Geolocation API calls with Cloudflare's in-built header fields.

# Intro

When users make their first request to [NodeFlair](https://nodeflair.com), we retrieve their country to localize the website for languages (I18n) and features.

To do this, we make a request to a third-party geolocation API to determine their country.

# The Issue

The API's website stated an average latency of 50ms.

However, we were experiencing latencies of approximately 300ms. This could be due to our servers being based in Singapore.

# Solution

Since we are currently using Cloudflare, we can instead obtain the country code via `CF-IPCountry` in the request header fields. We only fall back to using the geolocation API if the value is invalid (which is rare).

This means that for almost all requests, we no longer have to make a call to the geolocation API, thus shaving off up to 300ms from the response time.

Since requests are processed much quicker, the servers can now handle 4-10 requests every second instead of 2-3 requests, significantly increasing the application's throughput by up to 5x.
