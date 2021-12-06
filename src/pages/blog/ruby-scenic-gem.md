---
title:  "Rails: Scenic gem for Database Views"
date:   2021-05-19 10:54:00 +0800
---

[scenic-gem]:                 https://github.com/scenic-views/scenic
[nodeflair-website]:          https://www.nodeflair.com
[nodeflair-salaries]:         https://www.nodeflair.com/salaries

[NodeFlair Salaries][nodeflair-salaries] is one of the many products by [NodeFlair][nodeflair-website], a Tech Career SuperApp. It allows tech talents to look up the latest updated salaries and compensation in the market. Candidates will also be able to filter salaries according to Seniority, Specialisation and Company over thousands of jobs, allowing for a more tailored experience with the click of a few buttons!

For this product, we will be doing some computation across these data to derive meaningful insights.

## Some of data sources we are dealing with {/*some-of-data-sources-we-are-dealing-with*/}

```rb
class UserSalary < ApplicationRecord
  attr_reader :a_but_different_name, 
              :b,
              :c
end

class JobListing < ApplicationRecord
  attr_reader :a, 
              :b_but_different_name,
              :c
end

class MyCareersFutureJob < ApplicationRecord
  attr_reader :a, 
              :b,
              :c_but_different_name
end
```

Note: For this blogpost, I will simplify it down into 3 attributes (`a`, `b`, `c`)

## Initial implementation... {/*initial-implementation*/}

For NodeFlair Salaries, we have data from multiple sources - user-submitted salary, past job listings, external sources (e.g. MyCareersFuture). As different data sources have different attributes and types, we will need to transform the data into the same structure and type to do our computations.

```rb
class Salary
  attr_reader :a, :b, :c

  def initialize(data)
    case data
    when UserSalary
      @a = data.a_but_different_name
      @b = data.b
      @c = data.c
    when JobListing
      @a = data.a
      @b = data.b_but_different_name
      @c = data.c
    when MyCareersFutureJob
      @a = data.a
      @b = data.b
      @c = data.c_but_different_name
    end
  end
end
```

It looks doesn't look <i>THAT</i> bad for now, but just imagine the horror if this thing extends to many more data sources, and the number of attributes increase is much larger 😱

And also, while the code works, the `Salary` class is doing too much of the work just to process the data from the different sources, which isn't ideal.

## Here comes Scenic! {/*here-comes-scenic*/}

### What is Scenic {/*what-is-scenic*/}

We came across the [Scenic gem][scenic-gem], which is a way to use Database Views with ActiveRecord - exactly what we need!

> Using Scenic, you can bring the power of SQL views to your Rails application without having to switch your schema format to SQL. Scenic provides a convention for versioning views that keeps your migration history consistent and reversible and avoids having to duplicate SQL strings across migrations.

I will be skipping the setup of the gem over in this post - do refer to the documentation!

### Postgres query to set up the view  {/*postgres-query-to-set-up-the-view*/}

```sql
SELECT
  a_but_different_name AS "a",
  b,
  c
FROM user_salaries

UNION

SELECT
  a,
  b_but_different_name AS "b",
  c 
FROM job_listings

UNION

SELECT
  a,
  b,
  c_but_different_name AS "c" 
FROM my_careers_future_jobs
```

### A much simpler Salary class {/*a-much-simpler-salary-class*/}

```rb
class Salary < ApplicationRecord
  attr_reader :a, :b, :c
end
```

### Benefits to using Scenic {/*benefits-to-using-scenic*/}

At first glance, the code appears much longer (and you have to run additional DB migrations). However, this brings about quite a lot of benefits:
1. Smaller `Salary` class that's not bothered with processing the data passed in
2. `Salary` now behaves like an ActiveRecord model - and that's a HUGE lifesaver when doing computation later on, because
  - Able to define relations (`has_many`, `belongs_to` etc.)
  - Able to use methods such as `where`, `scope`
