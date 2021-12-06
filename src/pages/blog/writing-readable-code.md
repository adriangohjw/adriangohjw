---
title:  "Improving code readability: 5 simple tips"
date:   2020-08-01 02:57:38 +0800
---

[gregory-twitter]:            https://twitter.com/gregorywitek
[gregory-youtube-video]:      https://www.youtube.com/watch?v=R4MoHpSaX1I
[gregory-youtube-channel]:    https://www.youtube.com/channel/UCj3PDQ-4n9sO0j3t2j608WQ
[nodeflair-website]:          https://www.nodeflair.com

When we call someone a good developer, we often meant that they are good at writing correct code. However, there's another aspect of good code that is just as important: Readability.

Here's a definition I found:
> Readability means that the code is easy to follow, logically

When I first started programming, I have no idea what that meant. However, once I started working on projects, I realised code readability is very similar to design and UI/UX: You know it's bad when you see it. It's much easier to identify poor code readability because you often feel frustruated and confused when you see them.

## Importance of writing readable code {/*importance-of-writing-readable-code*/}

The project you are working on is likely to be maintained by someone (or even yourself).

A code may only be written once, but it might be read over 1,000 times. By spending some additional time now improving code readability, you are actually <b>saving time in the future</b>.

Even when you are writing code that no one is ever going to touch on, it is probably still a good idea to maintain a minimal level of code readability. I remembered once when I was doing a 2-hour coding test, I started struggling in the 2nd hour because I used variable names that made absolutely no sense.

Here's <b>5 simple tips</b> on writing more readable code!

## #1: Line breaks to help segment thoughts {/*1-line-breaks-to-help-segment-thoughts*/}

Similar to how I separate the content of this post using headers, sub-headers and paragraphs, whitespaces are crucial to readable code. It helps in visually separating out logical blocks of code.

Below are 2 snippets of code which are exactly the same. 

Even though the code in the 1st example appears shorter, it just seems like one chunk of code and it is not clear what the reader should focus on.

```rb
#=> meh code
def check_out(current_user, cart)
  if cart.count == 0
    return Status.new(false, "empty cart")
  end
  total_price = cart.calculate_total_price
  if current_user.balance < total_price
    return Status.new(false, "not enough money")
  end
  current_user.deduct_balance(total_price)
  return Status.new(true, nil) 
end
```

In the 2nd example, line breaks are used strategically to organize the code by breaking it down into many smaller and more digestable snippets based on it's intent and purpose. As such, readers can better navigate through the code, especially if the code is longer than that shown in the example (even though you probably shouldn't have such large functions, but that's a topic for another day)

```rb
#=> better code (with logical line breaks)
def check_out(current_user)
  if cart.count == 0
    return Status.new(false, "empty cart")
  end

  total_price = cart.calculate_total_price

  if current_user.balance < total_price
    return Status.new(false, "not enough money")
  end

  current_user.deduct_balance(total_price)

  return Status.new(true, nil) 
end
```

## #2: If-else? Put the happy path first! {/*2-if-else-put-the-happy-path-first*/}

According to Wikipedia, happy path is defined as such

> A happy path is a default scenario featuring no exceptional or error conditions. For example, the happy path for a function validating credit card numbers would be where none of the validation rules raise an error, thus letting execution continue successfully to the end, generating a positive response.

When we are reading code, we read it from top-down. As such, by putting the happy path in the `if` block, we are able to quickly understand what the code does in a quick glance. It is a similar concept to why when we handle exceptions, the errors are being handled in the later half of the code.

```rb
#=> meh code
if transaction.is_failure
  handle_failure(transaction)
else
  handle_success(transaction)
end
```

```rb
#=> better code (happy path first)
if transaction.is_successful
  handle_success(transaction)
else
  handle_failure(transaction)
end
```

## #3: Nested if-else? Try guard clauses instead {/*nested-if-else-try-guard-clauses-instead*/}

Guard clauses protect some code from running unless conditions are met. They are usually used to ensure that the parameters that were passed meet some criteria to avoid running into problems.

However, in this post, I would like to focus on how it help to improve code readability instead.

In the previous point, I mentioned we should put the happy path first in an if-else statement and that would result in something like this:

```rb
#=> meh code
def check_out(current_user)
  cart = current_user.cart
  
  if cart.count > 0
    if !cart.are_products_available
      if current_user.balance >= total_price
        current_user.deduct_balance(total_price)
        return Status.new(true, nil) 
      else
        return Status.new(false, "not enough money")
      end
    else
      return Status.new(false, "some products are unavailable")
    end
  else
    return Status.new(false, "empty cart")
  end
end
```

As you can see, in some instances where there are multple conditions, you might end up with a monsterous nested if-else block and stiil face a readability issue. In such instances, using guard clauses will actually improve the readability and let the readers follow through the code with greater ease.

```rb
#=> better code (early returns with guard clauses)
def check_out(current_user)
  cart = current_user.cart

  if cart.count == 0
    return Status.new(false, "empty cart")
  end

  if !cart.are_products_available
    return Status.new(false, "some products are unavailable")
  end

  if current_user.balance < total_price
    return Status.new(false, "not enough money")
  end

  current_user.deduct_balance(total_price)

  return Status.new(true, nil) 
end
```

Other than immediately improving the code readability, guard clauses also have other benefits like:
- Easier to make changes to the code in the future
- Possibility of refactoring the code to be even more readable (I wrote about this in [another post](/blog/readability-through-abstraction)

## #4: Avoid reassigning variables {/*avoid-reassigning-variabls*/}

At NodeFlair, we empower developers to code() at where they love by matching them with companies. For that to happen, developers have to sign up as users and fill up their specialisations (e.g. backend, frontend) during the onboarding process.

In some instance, we might want to filter them by certain attributes in their profile as such:

```rb
#=> meh code
users = Users.completed_onboarding_form
users = users.where(specialisations: "backend")
```

In the code snippet above, when people are reading your code, they have to store the value of `users` in their head as they navigate through your code. This problem is further amplified when code are added between the 2 lines of code.

To offload the mental load of the readers, we can either introduce a new variable or define it to what we need immediately.

```rb
#=> better code (avoid reassigning of variables)

#= Method 1 (introduce a new variable)
users = Users.completed_onboarding_form
users_backend = users.where(specialisations: "backend")

#= Method 2 (define it to what we need immediately)
users = Users.completed_onboarding_form
             .where(specialisations: "backend")
```

My tip as to choosing which method to use depends on the probability of reusing the variable in the first line of code. If it's quite likely that I require the value of `Users.completed_onboarding_form`, method 1 will be used as it is flexible and easier to reuse existing variables. However in most cases, it is usually fine to use either method as it's quite easy to change the code subsequently.

## #5: Use meaningful names {/*use-meaningful-names*/}

Without any context, can you take a guess at what this code does?

```rb
#=> meh code
def cal_tp(p, q, d, s)
  (p * q) - d + s
end
```

No idea? What about this?

```rb
#=> better code (with usage of meaningful names)
def calculate_total_price(price, quantity, discount, shipping)
  (price * quantity) - discount + shipping
end
```

As you can see, the two functions do exactly the same thing but it's way easier for the reader to understand what's going on in the 2nd example. Even without giving you any context, it is apparent that it is related to e-commerce. 

In addition, when calling the function `calculate_total_price`, the reader will know:
- What the function does (even without looking into it's implementation)
- What are the arguments needed to be passed in

## Conclusion {/*conclusion*/}

Contrary to what popular belief, writing readable code doesn't actually take much technical knowledge or years of coding experience. Instead, it is a conscious effort to always put yourself in the shoes of someone reading it.

This blog post was inspired by [Gregory Witek][gregory-twitter]'s video [Becoming a Senior Developer #4: make your code readable][gregory-youtube-video]. Do check out his YouTube channel [Not Only Code][gregory-youtube-channel] for more awesome videos!
