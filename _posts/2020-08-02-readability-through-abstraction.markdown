---
layout: post
title:  "Improving code readability: Abstractions"
date:   2020-08-02 08:55:38 +0800
categories: posts
---

In my previous [post]({{ site.baseurl }}{% link _posts/2020-08-01-writing-readable-code.markdown %}), I wrote about using abstractions to improve code readability.

I had a life changing moment when I came across a conference video by Ben Orenstein titled [Refactoring from Good to Great][refactoring-from-good-to-great]. During the talk, he discussed about how abstraction lets you focus on what a code does by hiding it's implementation details. Therefore, wheoever reads the code can quickly understand what it does by focusing on it's high-level intent instead of being bothered by implementation details.

# <b>Before using abstraction</b>

{% highlight ruby %}
#=> meh code
def check_out(current_user)
  cart = current_user.cart

  if cart.count == 0
    return Status.new(false, "empty cart")
  end

  if cart.are_products_unavailable
    return Status.new(false, "some products are unavailable")
  end

  if current_user.balance < cart.total_price
    return Status.new(false, "not enough money")
  end

  current_user.deduct_balance(total_price)

  return Status.new(true, nil) 
end
{% endhighlight %}

Code readability is alright and it is easy to follow through what the code does. However, there is room for improvement and we can do so by saving the reader the trouble of reading the implementation details.

# <b>After using abstraction</b>

{% highlight ruby %}
#=> better code (hiding implementation details with abstractions)
STATUS_EMPTY_CART = Status.new(false, "empty cart") 
STATUS_PRODUCTS_UNAVAILABLE = Status.new(false, "some products are unavailable")
STATUS_INSUFFICIENT_MONEY = Status.new(false, "not enough money")
STATUS_SUCCESS = Status.new(true, nil) 

def check_out(current_user)
  cart = current_user.cart

  return STATUS_EMPTY_CART if is_cart_empty(cart)

  return STATUS_PRODUCTS_UNAVAILABLE if are_products_unavailable(cart)

  return STATUS_INSUFFICIENT_MONEY if \
    has_insufficient_money(balance: current_user.balance, 
                           total_price: cart.total_price)

  current_user.deduct_balance(total_price)

  return STATUS_SUCCESS
end

private

def is_cart_empty(cart)
  return cart.count == 0
end

def are_products_unavailable(cart)
  return cart.are_products_available
end

def has_insufficient_money(balance:, total_price:)
  return balance < total_price
end
{% endhighlight %}

At first glance, the code appears much longer and you will ask the question "Is it actually easier?"

Let me breakdown the 2 things I did here:
1. Replacing details of statuses to be returned with a constant
2. Pull out validation implementation into a private method

What this means is that when someone is reading what `check_out` does, they are able to understand what it does faster. Only if they wish to understand what the statuses are or how the implementation of the different validations are being done, are they required to look into the private methods.

# <b>Other benefits of abstraction...</b>

Even though the purpose of this post is to share more about how abstraction helps with readability, I thought it would help if I briefly share about the other reasons why you should abstract aggressively.

<b>Reusability</b><br>
DRY principle is one of the best practices talked about by developers (Although I highly recommend [Dan Abramov's talk on The WET Codebase][wet-codebase]). This means that you are able to reuse the status `STATUS_EMPTY_CART` or methods like `is_cart_empty` in other part of your code.

<b>Easier to change the code</b><br>
One of the reasons why we care about readability is because we would like to be able to make changes to our code quickly without breaking anything. By abstracting these logics into separate methods, we are able to do so much faster. For example, if you wish to change how `are_products_unavailable` is being implemented, you can do so quickly and confidently as it has been isolated out into a standalone method.

[refactoring-from-good-to-great]: https://youtu.be/DC-pQPq0acs?t=157
[wet-codebase]:               https://www.deconstructconf.com/2019/dan-abramov-the-wet-codebase
[nodeflair-website]:          https://www.nodeflair.com