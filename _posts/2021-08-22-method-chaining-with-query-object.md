---
layout: post
title:  "Kill long parameters with Method Chaining"
date:   2021-08-22 14:11:00 +0800
categories: posts
---

[nodeflair-salaries]:             https://www.nodeflair.com/salaries
[nf_salaries_explore_filters]:  /assets/nf_salaries_explore_filters.png

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

```ruby
class SalariesController < ApplicationController
  # For simplicity sake, I have limited it to 3 filtering logics
  def search
    @results = Salary.all

    @results = @results.where(company: params[:companies])
      unless params[:companies].blank?

    @results = @results.where(source: 'user_submission')
      if params[:user_submission_only] == true

    case params[:order_by]
    when 'number_of_submissions'
      @results = @results.order(submission_count: :desc)
    when 'company_name'
      @results = @results.order(company_name: :desc)
    end
  end
end
```

Wow, one look and this presents us with two issues:
- <b>Bloated controller</b> - It should not have to worry about how the filtering is implemented
- <b>Poor readability</b> - It takes some time to understand what the code does. The issue worsens when there’s some other non-related computation that’s happening in the controller.

# <b>Abstracting logic using Query Object</b>

We can abstract the filtering logic into a query object `SalaryQuery` as such:

```ruby
class SalaryQuery
  def new
    @results = Salary.all
  end

  def call(companies:, source:, order_by:)
    @results = @results.where(company: companies)
      unless companies.blank?

    @results = @results.where(source: 'user_submission')
      if source == true

    case order_by
    when 'number_of_submissions'
      @results = @results.order(submission_count: :desc)
    when 'company_name'
      @results = @results.order(company_name: :desc)
    end

    @results
  end
end
```

This hides the implementation logic from the controller - it is now skinnier and the `SalaryQuery` can even be reused in another part of our code!

```ruby
class SalariesController < ApplicationController
  def search
    @results =
      SalaryQuery.new
                 .call(companies: params[:companies],
                       source: params[:user_submission_only],
                       order_by: params[:order_by])
  end
end
```


# <b>Good to Great: Improve it with Methods Chaining</b>

While using query object can already solve our initial two issues, we introduced a new code smell as we are <b>passing many parameters into the query object</b>. Readability worsens with the number of parameters passed in.

Thus, what I like to do to improve it is to use method chaining. The end product will look something like this:

```ruby
class SalariesController < ApplicationController
  def search
    @results =
      SalaryQuery.new
                 .filter_by_companies(params[:companies])
                 .filter_by_user_submission_only?(params[:user_submission_only])
                 .order_by_attribute(params[:order_by])
                 .call
  end
end
```

The methods' names are explicit and it is very clear what the query object is doing with our parameters.

```ruby
class SalaryQuery
  def new
    @results = Salary.all
  end

  # filtering by attributes
  def filter_by_companies(companies)
    @results = @results.where(company: companies)
      unless companies.blank?
    
    self
  end

  # filtering by boolean value
  def filter_by_user_submission_only?(user_submission_only)
    @results = @results.where(source: 'user_submission')
      if user_submission_only

    self
  end

  # conditional filtering by attribute
  def order_by_attribute(attribute)
    case attribute
    when 'number_of_submissions'
      @results = @results.order(submission_count: :desc)
    when 'company_name'
      @results = @results.order(company_name: :desc)
    end

    self
  end

  def call
    @results
  end
end
```

# <b>Why do I think this is better?</b>

### Improved readability

Without method chaining: 
- We do not quite know what happens to the parameters being passed in, and can only assume their functionalities, The ambiguities also increase the difficulty of subsequent refactoring.
- The `call` method of our query object is still bloated and doing many things, which contradicts the Single-Responsibility Principle (SRP). It feels like we are dumping all of our dirty laundries from one basket into another basket, <b>without actually cleaning up the mess</b>.

<div style="width:100%;height:0;padding-bottom:83%;position:relative;"><iframe src="https://giphy.com/embed/nBjOqZ6h0ili0" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/mess-nBjOqZ6h0ili0">via GIPHY</a></p>

### Modularized methods improve ease of updating

Let's say there's a change in product requirements and users can no longer filter by companies. We know that we can simply remove `filter_by_companies` from the query object and the controller calling it, instead of needing to dig into the `call` method to investigate how to make the changes.

On the other hand, if we want to allow users to filter by seniorities, we can simply add a new method `filter_by_seniorities` and call it <b>only in places that require it</b>. Method chaining allows us to query with a "plug-and-play" approach, effectively making the query object much more flexible.