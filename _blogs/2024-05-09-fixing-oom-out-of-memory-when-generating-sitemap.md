---
layout: blog
title:  Fixing OOM (Out-of-Memory) when Generating Sitemap
date:   2024-05-09 +0800
categories: blogs
tags: [ruby on rails]
---

![](/assets/oom-out-of-memory-when-generating-sitemap.png)

# <b>TL;DR</b>

When generating sitemaps, our application encountered an Out-of-Memory (OOM) issue due to the large number of records loaded. This is resolved by loading the records in batches instead.

# What is Sitemap?

When users search for terms like <i>"XXX interview questions"</i>, I’m proud that [NodeFlair](https://nodeflair.com) often ranks in the top three results.

This is despite competing against companies:
1. That have been around longer
2. Higher [Domain Authority](https://moz.com/learn/seo/domain-authority) <i>(making it easier for them to rank if all else is equal)</i>,
3. Dedicated SEO teams

![](/assets/shopback-interview-questions-seo-demo.png)

One of the many things we did to make this possible was creating a [sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview) and submitting it to Google. Think of sitemaps as directories that help search engines like Google crawl your site more efficiently.

# The Issue

[To generate the sitemap](https://github.com/kjvarga/sitemap_generator), we need to list all the URLs to be included.

Here’s a snippet of code used to generate the sitemap. When we run this code, the application <b>loads all records into memory</b>. <i>(Modified for simplicity and confidentiality purposes)</i>
```ruby
# BEFORE
CompanyInterviewQuestion
  .all do |interview_question|
    add interview_path(interview_question)
  end
```

When we first started, generating sitemaps was quick and easy. After all, there weren’t many pages.

However, over the years, with more data and pages on our site, the number of pages has grown to <b>over 2 million</b>. This means we are loading a large number of records into memory all at once, which causes the OOM issue.

![](/assets/sitemap-number-of-pages.png)

# Solution - Load the Data in Batches!

Of course, we could have easily used a machine with higher RAM, but that would be equivalent to buying a bigger house when your house has too many things instead of cleaning them up.

Luckily for us Ruby on Rails folks, instead of loading all the data into memory at once, we can use `find_each` to load records in batches, reducing memory usage.

This is especially important when dealing with large datasets, as it prevents loading all records into memory at once.

```ruby
# AFTER
CompanyInterviewQuestion
  .find_each(batch_size: 100) do |interview_question|
    add interview_path(interview_question)
  end
```

Additionally, batching queries can distribute the load on the database more evenly over time, rather than placing a heavy load all at once.

With this change, we significantly reduce the RAM needed for generating the sitemap - another day of doing more with less!
