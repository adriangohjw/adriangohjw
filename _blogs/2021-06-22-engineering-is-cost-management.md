---
layout: blog
title:  "engineering is cost management"
date:   2021-06-22 08:38:00 +0800
categories: blogs
tags: [ideology]
---

[nodeflair-website]:              https://nodeflair.com
[nodeflair-salaries]:             https://nodeflair.com/salaries
[nf-salaries-explore]:            /assets/nf_salaries_explore.png
[post-on-writing-test]:           {% link _blogs/2021-06-15-to-test-or-not-to-test-startup-perspective.md %}

Throughout my time managing Engineering at [NodeFlair][nodeflair-website]. Besides learning to write better code, I have also always learning to be a better engineering leader. Not quite there yet for sure, but often when making decisions, I realized that my decisions are guided by these thoughts.

<b>Disclaimer</b><br>
These are my personal opinions and what works for me now, and may not be as relevant for you. Well, they might not even be relevant to me in a year time, but who knows?

## <b>Engineering is Cost Management</b>

What I am gonna say next is probably uncomfortable and you may not like it, but neither do I.

<b>Fundamentally, engineering is merely just another cost centre of the company.</b>

What you need to know is that as the management (oh wait, that's me too), the question I always ask is <i>"Does it bring the company more money than it cost?"</i>

## <b>Why write good software then?</b>

No business dies from a legacy codebase. Well, at least not directly. A well-maintained code base with nicely modularized code that follows good software engineering practices and is easy to test and change, means the company can move a lot faster.

<b>Need to expand your addressable market?</b><br>
💰 Build new features and get more users → Profit!

<b>Market changes (COVID-19 anyone?) and there's a change in users' needs?</b><br>
💰 Adapt the product quickly to cater to new demand → Profit!

<b>Hired a new engineer and want to waste no time in getting them building fast!</b><br>
💰 Less time wasted on onboarding and be more productive → Profit!

<b>Developers are happy working on the code?</b><br>
💰 High retention and low recruitment cost → Profit!

<div style="width:100%;height:0;padding-bottom:56%;position:relative;"><iframe src="https://giphy.com/embed/3osxYamKD88c6pXdfO" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/season-3-money-unicorn-3osxYamKD88c6pXdfO">via GIPHY</a></p>

In my other blogpost [To test or not to test (Startup Perspective)][post-on-writing-test], I also explained the benefit of writing software test, even for a startup. TL;DR: Sometimes writing test can help you move faster.

## <b>What do you mean we don't need Machine Learning?</b>

<i>Hey, let's add Artificial Intelligence... and Machine Learning! Oh wait, let's migrate to Microservices! No wait, let's rewrite our codebase in Golang. Look, let's try out that latest Javascript framework?</i>

Stop it, just... stop it.<br>
Those most likely doesn't solve your problem.

Well sure, there may be some situations where it makes perfect sense to make these changes. Perhaps the product has grown to a size where the current architecture and design are struggling to keep up with the demand. Perhaps the language or framework you are using is rather outdated and it is getting increasingly difficult to attract the right talent.

But on multiple occasions, I have spotted teams adopting these new changes just because they are cool. Often, these bring about minimal positive changes, if any. On the other hand, it brings about a lot more unnecessary complexity to the software, and increase the onboarding time for new developers. Let's not also forget the opportunity cost - the time could have been better spent on work that brings about actual impact!

<div align="center">
  <img src="/assets/better-place.gif"/>
</div>
<br>

## <b>Wait, so I shouldn't hire the best talents?</b>

Yes, and no - it depends on the definition of "best".

Also, there are a lot of other factors to consider when building an engineering team. For us engineers, it's always exciting to work with world-class talents - 10x developer, ninjas etc. However, for engineering leaders, you will face challenges building a team.

This is rather straightforward. Top talents are in high demand in the market right now. <b>Companies are paying top dollars to fight for them.</b> You can check out what companies are paying at [NodeFlair Salaries][nodeflair-salaries], a product out team built to empower engineers to look up the latest salaries in the market.

![NodeFlair Salaries][nf-salaries-explore]

In addition, you want to <b>avoid hiring someone overqualified for the role</b>. Think of it as server management - you want to avoid overprovisioning. While one may argue that it guarantees performance (and it's true), the downside of overpaying for the unutilized resources is greater. Similarly, you are not probably utilizing the skillsets of someone that can <i>invert a binary tree or reverse a linked list</i> from FAANG if your application isn't that complex.

Also, from a perspective of the cost-to-output ratio, it might make a lot more financial sense to hire 2 great talents rather than 1 engineer from the 90th percentile.

## <b>Conclusion</b>

If you are an engineering leader at a larger company, or different industry, or simply has a different opinion, do let me know! More than happy to hear from everyone.

Cheers, and see you later alligator~