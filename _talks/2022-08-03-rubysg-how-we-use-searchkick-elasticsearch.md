---
layout: talk
title:  "RubySG - How we use Searchkick (ElasticSearch)"
date:   2022-08-03 12:41:00 +0800
categories: talks
---

[cover]:                        /assets/rubysg-how-we-use-searchkick-elasticsearch.jpg

![][cover]

I shared about how I used Searchkick gem to build search features with ElasticSearch
- Why and how I use Searchkick / ElasticSearch (using it with ActiveRecord)
- How to query using Searchkick using the different search options (pagination, limit etc.)
- Reindexing options; Similarity search; Multi-search (batching search queries into 1 query)
- And more!

<br>

# <b>/slides</b>

<div class="google-slides-container">
  <iframe src="https://docs.google.com/presentation/d/e/2PACX-1vR5tkcXL2pVwfMCje7_tbGqzBGzwoDMpWVzsJ05bCQlEvYHvQlAfUV3i45oouN_b23zSfXDgzFFjV10/embed?start=false&loop=false&delayms=3000" frameborder="0" width="960" height="569" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</div>
<br>

# <b>/recording</b>

<div class="video-container">
  <iframe src="https://www.youtube-nocookie.com/embed/MVu2F1_JCE8?si=ZLf_TA3s3Dvtme9K" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
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