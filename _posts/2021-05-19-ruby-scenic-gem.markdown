---
layout: post
title:  "Rails: Scenic gem for Database Views"
date:   2021-05-19 10:54:00 +0800
categories: posts
---

[NodeFlair Salaries][nodeflair-salaries] is one of the many products by [NodeFlair][nodeflair-website], a Tech Career SuperApp. It allows tech talents to look up the latest updated salaries and compensation in the market. Candidates will also be able to filter salaries according to Seniority, Specialisation and Company over thousands of jobs, allowing for a more tailored experience with the click of a few buttons!

For this product, we will be doing some computation across these data to derive meaningful insights.

# <b>Some of data sources we are dealing with</b>

<script src="https://gist.github.com/adriangohjw/00f97a37cb5dcb5df5e25a21132086a4.js?file=models.rb"></script>

Note: For this blogpost, I will simplify it down into 3 attributes (`a`, `b`, `c`)

# <b>Initial implementation...</b>

For NodeFlair Salaries, we have data from multiple sources - user-submitted salary, past job listings, external sources (e.g. MyCareersFuture). As different data sources have different attributes and types, we will need to transform the data into the same structure and type to do our computations.

<script src="https://gist.github.com/adriangohjw/00f97a37cb5dcb5df5e25a21132086a4.js?file=salary_before.rb"></script>

It looks doesn't look <i>THAT</i> bad for now, but just imagine the horror if this thing extends to many more data sources, and the number of attributes increase is much larger 😱

And also, while the code works, the `Salary` class is doing too much of the work just to process the data from the different sources, which isn't ideal.

# <b>Here comes Scenic!</b>

### What is Scenic

We came across the [Scenic gem][scenic-gem], which is a way to use Database Views with ActiveRecord - exactly what we need!

> Using Scenic, you can bring the power of SQL views to your Rails application without having to switch your schema format to SQL. Scenic provides a convention for versioning views that keeps your migration history consistent and reversible and avoids having to duplicate SQL strings across migrations.

I will be skipping the setup of the gem over in this post - do refer to the documentation!

### Postgres query to set up the view

<script src="https://gist.github.com/adriangohjw/00f97a37cb5dcb5df5e25a21132086a4.js?file=view.sql"></script>

### A much simpler Salary class

<script src="https://gist.github.com/adriangohjw/00f97a37cb5dcb5df5e25a21132086a4.js?file=salary_after.rb"></script>

### Benefits to using Scenic

At first glance, the code appears much longer (and you have to run additional DB migrations). However, this brings about quite a lot of benefits:
1. Smaller `Salary` class that's not bothered with processing the data passed in
2. `Salary` now behaves like an ActiveRecord model - and that's a HUGE lifesaver when doing computation later on, because
  - Able to define relations (`has_many`, `belongs_to` etc.)
  - Able to use methods such as `where`, `scope`

[scenic-gem]:                 https://github.com/scenic-views/scenic
[nodeflair-website]:          https://nodeflair.com
[nodeflair-salaries]:         https://nodeflair.com/salaries