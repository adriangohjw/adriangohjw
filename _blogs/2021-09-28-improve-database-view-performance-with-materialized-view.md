---
layout: blog
title:  "i made our database queries 293x faster with materialized views"
date:   2021-09-28 14:32:00 +0800
categories: blogs
tags: [optimization, database, postgresql]
---

[nodeflair-salaries]:                     https://nodeflair.com/salaries
[nodeflair-salaries-submission]:          https://nodeflair.com/salaries/addsalary
[cover]:                                  /assets/database-materialized-views.png
[db-materialized-views-cpu-utilization]:  /assets/db-materialized-views-cpu-utilization.png

![][cover]

# <b>Overview</b>

Before I lose you, here's the performance improvement that we got out of this optimization technique.
- Database query from 527ms to 1.8ms (293x faster)
- APIs from 1310ms to 477ms (2.75x faster)

In this post, I will share how we use Materialized View instead of normal View to improve the overall speed of our application by increasing the access speed for the view.

<b>TL;DR:</b>
- Database view can be really expensive!
- Materialized View works like a cache
- The downside is similar to that of cache in general: extra storage & potentially out-of-date data
- Keep view accurate by periodically refresh or update it when it changes
- Don't use it if you don't access the view often, or if performance improvement is negligible

# <b>How it all started</b>

Some time ago, I wrote a post [Rails: Scenic gem for Database Views](/2021-05-19-ruby-scenic-gem) on how we are using database views to aggregate data from various sources to accurately compute salary data for NodeFlair Salaries.

For those who did not read the post, here's a quick run-through on how we generate the salary data
1. We create a view `UnifiedSalary` by aggregating individual data from user salaries and job listings
2. We use the view to generate another view `SalaryGroup` to group the salary data

# <b>Hey View, it's not working out for us anymore...</b>

However, over the past 4 months, <b>our data set used in salary computation has grown in size</b> as [more users are contributing their salaries][nodeflair-salaries-submission] and us getting more job listings. Thus, our queries and APIs were taking longer to complete (up to 5x longer).

In addition, this issue will only worsen over time as the data set continues to grow. Just like a broken relationship, we have to fix it before it gets worse.

<div style="width:100%;height:0;padding-bottom:71%;position:relative;"><iframe src="https://giphy.com/embed/xT9C25UNTwfZuk85WP" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/Giflytics-gif-jazminantoinette-giflytics-xT9C25UNTwfZuk85WP">via GIPHY</a></p>

# <b>How does Materialized View reduce query time</b>

Before understanding this, we need to <b>understand how normal View works</b>.
Every single time you query from a normal View, it will compute the underlying SELECT statements and return the results. What this means is if you call it 100 times, it will compute it 100 times. 

This is not expensive for simple queries. However, if your view is made up of multiple JOINs, involve complex computation and/or access to a huge data source, the query will be expensive. It will be even more expensive if the view is being accessed frequently.

In our case, every time we query `SalaryGroup`, it will first have to compute `UnifiedSalary` (which consist of multiple JOIN and WHERE statements) before it goes on to do some GROUP statements. This is a very expensive and slow query.

On the other hand, <b>Materialization is a form of caching</b>. Instead of computing the result every single time, <b>Materialized View generates the view once and store a copy of the result</b>. Every subsequent read will be reading from this copy - just like reading from a table.

# <b>Benefits beyond reducing query time</b>

Besides reducing query time, we also observed an unintended improvement in other aspects.

For instance, our <b>database's CPU utilization drops and fluctuates much less regardless of the number of queries</b>. As observed from the image below:
- Peak CPU utilization drops by an average of 78%
- Non-peak CPU utilization drops by an average of 67%
- The difference in utilization between peak and non-peak shrinks from 3x to 2x 

![][db-materialized-views-cpu-utilization]
<div align="center">
  <div style="font-size: 80%; width: 80%">
    Database's CPU utilization (before v.s. after making changes on 28 September)
  </div>
</div>
<br>

This allows us to deal with spikes in database requests with greater ease, as well as scale down our database resources. As such, we can <b>save up on some of our costs for cloud services</b>. (Damn it, probably shouldn't have invested in Amazon)

# <b>It sounds too good to be true..?</b>

<div style="width:100%;height:0;padding-bottom:56%;position:relative;"><iframe src="https://giphy.com/embed/7JETj7u7jBmkTPn4Zb" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/animalkingdom-ak-animal-kingdom-tnt-7JETj7u7jBmkTPn4Zb">via GIPHY</a></p>

At this point, you are probably thinking "there must be a tradeoff" - and you are right.

Since mentioned, Materialized View is fundamentally a form of caching, and as such, the increased efficiency comes at a price of <b>extra storage</b> and <b>data being potentially out-of-date</b>.

To ensure that the data is up-to-date, you would need to refresh the view. There are 2 ways to go about it, and my view (pun intended) on which scenarios are the methods more appropriate for:

<b>Method 1: Using a scheduler to update it periodically</b>

- Has higher tolerance for out-of-date data until your next view refresh
- The underlying data updates on a more consistent basis

The above 2 factors will also determine your refresh frequencies. If you have a higher tolerance and the data don't change as much, you can refresh less often, and vice-versa.

<b>Method 2: Whenever there are changes to the underlying data</b>

- Has lower tolerance for out-of-date data. E.g. Fintech or Medtech
- The underlying data updates in a sporadical manner

In the case of NodeFlair Salaries, our data set is growing consistently at a predictable pace and we are alright with only refreshing our results every other minute. Therefore, we went with method 1.

# <b>It's not for everyone (and that's fine)</b>

Let's recap on our intention of exploring Materialized View in the first place. We wanted a <b>more efficient query when reading from the view</b>, and that means that if this is not being achieved (or it comes at too large a trade-off), it might not make sense to use it.

<b>1. The view is not being accessed that often</b>

Regardless of which method we use to refresh the view and keep it up-to-date, we should know that refreshing the view does not come free. Every refresh is effectively computing the view and storing it as the latest value.

As such, if the view is not being accessed as often, we might potentially have overall database operations that are more expensive than before. For example, if we have a scenario where the view is only being accessed once every hour, but we refresh the database more than once per hour, we might be better off not materialize it.

<b>2. Efficiency improvement is negligible</b>

Not all Views are created equally - some are more expensive than others due to their logic, as mentioned above.

In addition, query speed depends on the size of the data source you are querying from.

As such, if a view has simple underlying logic and/or the data source has very few records, your improvement in query speed will be very small. In such a situation, it might not be worth the effort and complexity of using materialized views.

<div style="width:100%;height:0;padding-bottom:60%;position:relative;"><iframe src="https://giphy.com/embed/2F0kKth8MPc88LQsHQ" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/news-atlanta-georgia-keisha-lance-bottoms-just-because-you-can-do-it-doesnt-2F0kKth8MPc88LQsHQ">via GIPHY</a></p>

# <b>Conclusion</b>

Like every technical decision, there are trade-offs. What works for us might not work for you. Who knows, Materialized View might outgrow us after six months and we will need to look for another solution then. But hey, it is working great for us now, so all is good!

Disclaimer: Opinions are my own and do not represent my company.
