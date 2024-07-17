---
layout: blog
title:  "Improving code readability: Abstractions"
date:   2020-08-02 08:55:38 +0800
categories: blogs
tags: [refactoring]
---

In my previous [post]({{ site.baseurl }}{% link _blogs/2020-08-01-writing-readable-code.markdown %}), I wrote about using abstractions to improve code readability.

I had a life changing moment when I came across a conference video by Ben Orenstein titled [Refactoring from Good to Great][refactoring-from-good-to-great]. During the talk, he discussed about how abstraction lets you focus on what a code does by hiding it's implementation details. Therefore, wheoever reads the code can quickly understand what it does by focusing on it's high-level intent instead of being bothered by implementation details.

## <b>Before using abstraction</b>

<script src="https://gist.github.com/adriangohjw/3003bf3360e2903130e62d54d4f6bbb2.js?file=before.rb"></script>

Code readability is alright and it is easy to follow through what the code does. However, there is room for improvement and we can do so by saving the reader the trouble of reading the implementation details.

## <b>After using abstraction</b>

<script src="https://gist.github.com/adriangohjw/3003bf3360e2903130e62d54d4f6bbb2.js?file=after.rb"></script>

At first glance, the code appears much longer and you will ask the question "Is it actually easier?"

Let me breakdown the 2 things I did here:
1. Replacing details of statuses to be returned with a constant
2. Pull out validation implementation into a private method

What this means is that when someone is reading what `check_out` does, they are able to understand what it does faster. Only if they wish to understand what the statuses are or how the implementation of the different validations are being done, are they required to look into the private methods.

## <b>Other benefits of abstraction...</b>

Even though the purpose of this post is to share more about how abstraction helps with readability, I thought it would help if I briefly share about the other reasons why you should abstract aggressively.

<b>Reusability</b><br>
DRY principle is one of the best practices talked about by developers (Although I highly recommend [Dan Abramov's talk on The WET Codebase][wet-codebase]). This means that you are able to reuse the status `STATUS_EMPTY_CART` or methods like `is_cart_empty` in other part of your code.

<b>Easier to change the code</b><br>
One of the reasons why we care about readability is because we would like to be able to make changes to our code quickly without breaking anything. By abstracting these logics into separate methods, we are able to do so much faster. For example, if you wish to change how `are_products_unavailable` is being implemented, you can do so quickly and confidently as it has been isolated out into a standalone method.

[refactoring-from-good-to-great]: https://youtu.be/DC-pQPq0acs?t=157
[wet-codebase]:               https://www.deconstructconf.com/2019/dan-abramov-the-wet-codebase
[nodeflair-website]:          https://nodeflair.com