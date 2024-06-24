---
layout: blog
title:  "Kill Bloated Controller with Method Chaining"
date:   2021-08-22 14:11:00 +0800
categories: blogs
---

[nodeflair-salaries]:           https://nodeflair.com/salaries
[nf_salaries_explore_filters]:  /assets/nf_salaries_explore_filters.png
[cover]:                        /assets/kill_bloated_controller_cover.png

![][cover]

This post could be helpful for you if you are tired of:
- Having controller bloated with conditional filtering logics OR
- Having query objects that takes in multiple parameters (perhaps too many)

# <b>How it started...</b>

With data from user submissions and past job listings, [NodeFlair Salaries][nodeflair-salaries] empowers tech talents to accurately understand what companies are paying for the different job roles. We improve the search experience by allowing users to filter by seniority, specialisation, company, only user submissions, and sort by attributes.

![NodeFlair Salaries - Explore - Filters][nf_salaries_explore_filters]
<div align="center">
  <div style="font-size: 80%; width: 80%">
    Screenshot from NodeFlair Salaries
  </div>
</div>
<br>

Because of the sheer number of ways to filter your results, it is not uncommon to see your controller looks something like this.

<script src="https://gist.github.com/adriangohjw/23ee6839536d3a837d2517140c34543d.js?file=before.rb"></script>

Wow, one look and this presents us with two issues:
- <b>Bloated controller</b> - It should not have to worry about how the filtering is implemented
- <b>Poor readability</b> - It takes some time to understand what the code does. The issue worsens when there’s some other non-related computation that’s happening in the controller.

# <b>Abstracting logic using Query Object</b>

We can abstract the filtering logic into a query object `SalaryQuery` as such:

<script src="https://gist.github.com/adriangohjw/23ee6839536d3a837d2517140c34543d.js?file=1_query_object.rb"></script>

This hides the implementation logic from the controller - it is now skinnier and the `SalaryQuery` can even be reused in another part of our code!

<script src="https://gist.github.com/adriangohjw/23ee6839536d3a837d2517140c34543d.js?file=1_query_object_in_controller.rb"></script>

# <b>Good to Great: Improve it with Methods Chaining</b>

While using query object can already solve our initial two issues, we introduced a new code smell as we are <b>passing many parameters into the query object</b>. Readability worsens as the number of parameters being passed in increases- we simply have no idea what is happening and are just hoping for the best!

<div style="width:100%;height:0;padding-bottom:56%;position:relative;"><iframe src="https://giphy.com/embed/TvXwdYI205i4E" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/power-puff-girls-TvXwdYI205i4E">via GIPHY</a></p>

Thus, what I like to do to improve it is to use method chaining, which results in the following. The methods' names are explicit and it is very clear what the query object is doing with our parameters.

<script src="https://gist.github.com/adriangohjw/23ee6839536d3a837d2517140c34543d.js?file=2_query_object_with_method_chaining_in_controller.rb"></script>

We also no longer have a bloated `call` method that does all the work.

<script src="https://gist.github.com/adriangohjw/23ee6839536d3a837d2517140c34543d.js?file=2_query_object_with_method_chaining.rb"></script>

# <b>Why do I think this is better?</b>

### Improved readability

Without method chaining: 
- We do not quite know what happens to the parameters being passed in, and can only assume their functionalities, The ambiguities also increase the difficulty of subsequent refactoring.
- The `call` method of our query object is still bloated and doing many things, which contradicts the Single-Responsibility Principle (SRP). It feels like we are dumping all of our dirty laundries from one basket into another basket, <b>without actually cleaning up the mess</b>.

<div style="width:100%;height:0;padding-bottom:83%;position:relative;"><iframe src="https://giphy.com/embed/nBjOqZ6h0ili0" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/mess-nBjOqZ6h0ili0">via GIPHY</a></p>

### Modularized methods improve ease of updating

Let's say there's a change in product requirements and users can no longer filter by companies. We know that we can simply remove `filter_by_companies` from the query object and the controller calling it, instead of needing to dig into the `call` method to investigate how to make the changes.

On the other hand, if we want to allow users to filter by seniorities, we can simply add a new method `filter_by_seniorities` and call it <b>only in places that require it</b>. Method chaining allows us to query with a "plug-and-play" approach, effectively making the query object much more flexible.