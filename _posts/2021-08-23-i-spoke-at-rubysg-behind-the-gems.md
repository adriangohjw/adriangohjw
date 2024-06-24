---
layout: post
title:  "i spoke at RubySG Behind The Gems (19/08/21)"
date:   2021-08-23 12:41:00 +0800
categories: posts
---

[nodeflair-salaries]:           https://nodeflair.com/salaries
[nf_salaries_explore_filters]:  /assets/nf_salaries_explore_filters.png
[cover]:                        /assets/rubysg-behind-the-gems-190821.png

![][cover]

I did my 1st engineering sharing at RubySG's August Meetup for the new mini-series Behind The Gems. Here's what I covered:
- 💎 Using the Scenic gem to build NodeFlair Salaries
- 🛠️ Technical decisions to move fast (w/o breaking things)
- ✔️ Deciding when to write tests, as a startup

<br>

# <b>/slides</b>

You can find the more detailed sharing in my blogposts:
- [Rails: Scenic gem for Database Views]({% post_url 2021-05-19-ruby-scenic-gem %})
- [To test or not to test (Startup Perspective)]({% post_url 2021-06-15-to-test-or-not-to-test-startup-perspective %})

<div class="google-slides-container">
  <iframe src="https://docs.google.com/presentation/d/e/2PACX-1vT76eh6UQW2-hK_FHqLLszwB61siRUNXZh1Xqmiyfhc-qowb5GJ0EdD6aYoIh3U2Y7TDmAClDQWjDLK/embed?start=false&loop=false&delayms=30000" frameborder="0" width="960" height="569" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</div>
<br>

# <b>/recording</b>

Thanks Engineers.SG for providing the tools for the recording!

<div class="video-container">
  <iframe src="https://www.youtube-nocookie.com/embed/I3rYKaH2W-8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

<style>
.video-container {
    overflow: hidden;
    position: relative;
    width:100%;
}

.video-container::after {
    padding-top: 56.25%;
    display: block;
    content: '';
}

.video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.google-slides-container{
    position: relative;
    width: 100%;
    padding-top: 60%;
    overflow: hidden;
}

.google-slides-container iframe{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>