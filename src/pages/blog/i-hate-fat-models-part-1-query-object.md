---
title:  "i hate fat models - part 1"
date:   2021-06-05 15:52:00 +0800
---

[nodeflair-website]:              https://www.nodeflair.com
[nodeflair-salaries]:             https://www.nodeflair.com/salaries

At [NodeFlair][nodeflair-website], we started out using Ruby on Rails, a MVC (model–view–controller) framework.

As I was reading up about the MVC architecture, I came across some common practices, which include the "Fat Models, Skinny Controller" design.

> Most of the business logic of your application should be put into model classes. A model class may contain the code which: 1) Performs complex data filtering and validation, and 2) Performs data manipulation.

Well, that doesn't sound too bad. However, what we realized is that over time, there is a tendency for the model class to grow way too huge, which make navigating the code base increasingly challenging.

## How it first started... {/*how-it-first-started*/}

At the beginning of time (or the development of [NodeFlair Salaries][nodeflair-salaries]), there was a class `SalaryGroup`. Without complicating this post with unnecessary details, all we need to know is that it is one of the key models in this product.

```rb
class SalaryGroup < ApplicationRecord
  # some simple code
end
```

## Implementing new feature - Popular Companies {/*implementing-new-feature-popular-companies*/}

One of the features we added to [NodeFlair Salaries][nodeflair-salaries] recently is Popular Companies. The goal of it is to encourage users, especially those who stumbled across the product, to explore the product more. I find it rather useful and interesting to know what are the different companies that other people are also looking at.

<Illustration src="/images/blog/i-hate-fat-models-part-1-query-object/nf-salaries-popular-companies.png" />

## Let's take a look at the initial implementation {/*lets-take-a-look-at-the-initial-implementation*/}

```rb
class SalaryGroup < ApplicationRecord
  # some simple code

  def self.popular_salaries
    # return data in whatever shape is needed
  end
end

# Somewhere in the controller
@data = SalaryGroup.popular_salaries
```

This implementation is straightforward and easy to understand. However, our class has grown fatter with an additional method. Not an issue for a small object, but as the application grows and we have more requirements and features, I can foresee the model growing to a few hundred lines of code. 🤮

## Query Object to keep our models skinny {/*query-object-to-keep-our-models-skinny*/}

Instead of extending the class `SalaryGroup`, we can simply create a new query object called `PopularSalariesQuery`

```rb
class PopularSalariesQuery
  def all
    # return data in whatever shape is needed
  end
end

# Somewhere in the controller
@data = PopularSalariesQuery.new.all
```

## Why do I think this is better? {/*why-do-i-think-this-is-better*/}

### Improved readability {/*improved-readability*/}

As we add more features to the application, the model `SalaryGroup` will only grow in size. This will be problematic as it increases the difficulty in navigating through the code. By using query object, we can keep the model skinny. As `PopularSalariesQuery` is a class on its own, even any new joiners will be able to know which part of the codebase to refer to with ease and minimal documentation.

### Avoiding God Class {/*avoiding-god-class*/}

Here's a statement I came across on StackOverflow.
> Model, in modern MVC design pattern, is NOT a class or object. Model is a layer.

For development in Ruby on Rails (and using ActiveRecord that comes with it), I think it is easy to confuse the model class as the class to handle all query related functions and begin dumping all the methods into it. 

In addition, whatever we were doing initially is a poor OOP (Object-oriented programming) practice as it violates the SRP (Single Responsibility Principle). It isn't the responsibility of the `SalaryGroup` class to determine which are the popular salaries.  Its responsibility is to handle the persistence layer and its abstraction, and not handle our business logic.

Say NO to "Fat Models, Skinny Controller". I very much love <b>"Skinny Models, Skinny Controller, Skinny Everything"</b> way more!

### Remove dependency on the model class {/*remove-dependency-on-the-model-class*/}

Let's say some time in the future, we decided that we want to use another model (or data source) for the computation. With the initial implementation, it is gonna be more troublesome to make the changes as it depends heavily on the `SalaryGroup` class and is very tightly coupled with it. By using query object instead, we can make the changes much easier, and also with much confidence that it won't break other parts of the application (even with minimal testing).
