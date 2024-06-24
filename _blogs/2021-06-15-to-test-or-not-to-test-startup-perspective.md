---
layout: blog
title:  "To test or not to test (Startup Perspective)"
date:   2021-06-15 15:05:00 +0800
categories: blogs
---

[nodeflair-website]:              https://nodeflair.com
[nodeflair-salaries]:             https://nodeflair.com/salaries
[nodeflair-salaries-grab-swe]:    https://nodeflair.com/companies/grab/salaries/software_engineer/senior
[nf_salaries_grab_swe]:           /assets/nf_salaries_grab_swe.png

Ahhhh testing in software engineering. It is not uncommon to hear developers skip writing test, or proclaim their annoyance with it at least. But if that's the case, why do we still write tests?

# <b>Importance of tests</b>

Before we proceed further, we need to first understand the importance of writing tests. 

TL;DR: 
- Correctness: code does what it says it does (and don't do what it shouldn't)
- Easier to add new features: Make changes without worrying about the application breaking
- Know which part of the code is causing the bug
- Give other developers (or future you) a better idea of what the code was intended to do
- And the list goes on...

# <b>But almost always, speed is more important</b>

As Facebook founder Mark Zuckerberg once famously said <b><i>"Move fast and break things"</i></b>. How I look at it is, we could spend time writing tests to make sure it's 99% bug-free, or we could spend the same time launching a couple of new features. This is because startups have limited resources like time and money.

Sure, things might break sometimes, but for a startup, moving fast is almost always more rewarding than being right.  According to this article on <a href='https://www.cbinsights.com/research/startup-failure-reasons-top/'>The Top 20 Reasons Startups Fail</a> by CB Insights, 9/10 startups fail due to no product-market fit, running out of cash or getting outcompeted. Most of these scenarios seem to stem from a lack of speed and agility. 

# <b>Why bother writing tests then</b>

Most people probably don't know about this, but in 2014, Facebook's new motto has been changed to <b><i>'Move fast with stable infrastructure'</i></b>. 

As the product grows, at some point, <b>not writing tests slow down the development process</b>. You heard me right. This could be due to reasons like time remedying a catastrophic impact of a bad piece of code (yup, we've been there), or simply not having enough confidence to change the code without knowing if it is working or worrying if it breaks another part of the application.

As Mark Zuckerberg nicely explained
> ... as the company has grown to such mammoth proportions that spending time fixing bugs was slowing it down faster than its risky attitude toward development.

# <b>So when do we write tests?</b>

Since startups have limited resources but tests are also important at the same time, when should a startup write tests? Here at [NodeFlair][nodeflair-website], we mostly follow these 2 rules to decide if we should write a test, and it turns out to be working pretty well (so far).

### Too many cases to test manually

[NodeFlair Salaries][nodeflair-salaries] is one of the many products by NodeFlair, a Tech Career SuperApp. It allows tech talents to look up the latest salaries in the market. One of its features is to crawl job listings and tag them according to important attributes like specialisations and seniorities.

For example, here's a screenshot of [Salaries for Grab's Senior Software Engineer][nodeflair-salaries-grab-swe], which can be found on NodeFlair Salaries.

![NodeFlair Salaries - Grab Software Engineer][nf_salaries_grab_swe]

To determine the seniority of a job listing, we have a module that requires several arguments such as the job title and years of experience required. We ensure the correctness of the module by running it against a large list of different job titles and checking if the result is correct. Should we make any changes to the way we are deriving the seniority, we don't want to manually test it against a hundred job title. In this situation, it makes sense to write unit tests, as we can run it against any changes, and therefore, can develop faster.

### Potentially catastrophic code

Some code is more "dangerous" than the others. In general, any GET operation will probably be safer than an UPDATE, which is likely to be safer than a DELETE operation. You don't want a situation where you <a href="https://keepthescore.co/blog/posts/deleting_the_production_database/">accidentally wipe out your production database</a>

Forget about the Space-Time complexity. I use the <b>Fuck-My-Life complexity</b> to gauge, which include 2 simple questions:
- How badly can this piece of code fucks up my day
- How tough is it to recover from the worst-case scenario

# <b>Conclusion</b>

Here's a disclaimer: What works for us might not work for you. For example, if you are a fintech startup, there's probably less room for errors, so more stringent testings will be required. Do adapt as you see fit.

And also, I don't know how to end off this post... So all the best and I hope all your test suites pass.
