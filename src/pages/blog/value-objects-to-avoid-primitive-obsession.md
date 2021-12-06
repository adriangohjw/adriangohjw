---
title:  "Value Objects to avoid Primitive Obsession"
date:   2021-05-26 17:28:00 +0800
---

[scenic-gem]:                 https://github.com/scenic-views/scenic
[nodeflair-website]:          https://www.nodeflair.com
[nodeflair-salaries]:         https://www.nodeflair.com/salaries

[NodeFlair Salaries][nodeflair-salaries] is one of the many products by [NodeFlair][nodeflair-website], a Tech Career SuperApp. It allows tech talents to look up the latest updated salaries and compensation in the market. 

Most users we spoke to have is <b>not knowing the salary details for a particular job opening.</b> The current non-ideal workaround is to browse existing job listings that are similar, to get a gauge (if that is even possible).

As such, one of the features of NodeFlair Salaries is to solve this issue is to crawl job listings, tag them according to important attributes like specialisations and seniorities. Here's a screenshot of it.

<Illustration src="/images/blog/value-objects-to-avoid-primitive-obsession/nf-salaries-past-listings.png" />

## Tagging seniorities of a job listing {/*tagging-seniorities-of-a-job-listing*/}

There are many attributes that we use, but I will simplify it for this post to use just the job listing’s title.
- If it contains the word 'junior', it's a junior position

## Issue with Primitive Obsession... {/*issue-with-primitive-obsession*/}

There's quite a couple of content out there that explains this, so let me just quote this blogpost on [Object Calisthenics](https://medium.com/@davidsen/clean-code-object-calisthenics-f6f4dec07c8b).

> TL;DR every variable with type that was not written by yourself is primitive, and you should encapsulate them to a class by their behaviours.

### Let's take a look at the initial implementation {/*lets-take-a-look-at-the-initial-implementation*/}

```rb
title = 'some job title'

seniority = title.include?('junior') ? 'junior' : nil
```

Okay, not <i>THAT</i> bad. You kinda get what it is doing. But it does take you some time to digest it. And as this code smell appears in other parts of the code, the total time wasted will accumulate over time.

## Value Object to the rescue! {/*value-object=to-the-rescue*/}

```rb
class Title
  def initialize(title)
    @title = title
  end

  def to_seniority
    @title.include?('junior') ? 'junior' : nil
  end
end

title = 'some job title'

seniority = Title.new(title).to_seniority
```

## Why do I think this is better? {/*why-do-i-think-this-is-better*/}

### Improved Readability {/*improved-readability*/}

Almost always, this will lead to improvement in readability as you can give better names to variables, methods etc. This gives better context about what they are, and what is happening.

It would be tempting to wrap the logic in a method like the one below.

```rb
def title_to_seniority(title)
  title.include?('junior') ? 'junior' : nil
end

seniority = title_to_seniority(title)
```

There's nothing wrong with it, but I find that
- It is still dealing with primitive types like String
- Often, it results in methods with an unnecessarily long name and arguments at first glance, making the code less readable. E.g. `abstract_tech_stacks_from_job_listing_description(...)` 😵

### Business logics are abstracted and hidden away {/*business-logics-are-abstracted-and-hidden-away*/}

Let's say we want to update the logic in determining the seniority. As the logic to determine the seniority has been abstracted and encapsulated within the `Title` class, any changes can be made easily without the object `seniority` object do not have to care about it.

```rb
class Title
  def initialize(title)
    @title = title
  end

  def to_seniority
    return 'junior' if @title.include?('junior')
    return 'senior' if @title.include?('senior')
    return 'manager' if @title.include?('manager')
    nil
  end
end

# code remains unchanged!
seniority = Title.new(title).to_seniority  
```

### Class can be extended easily {/*class-can-be-extended-easily*/}

Let's say now we also want to determine the specialisation (e.g. data scientist, software engineer) from the title. We can add a new method easily!

```rb
class Title
  def initialize(title)
    @title = title
  end

  def to_seniority
    @title.include?('junior') ? 'junior' : nil
  end

  # easy to add a new method to the class!
  def to_specialisation
    return 'software engineer' if @title.include?('software')
    return 'data scientist' if @title.include?('data sci')
    nil
  end
end

specialisation = Title.new(title).to_specialisation
```