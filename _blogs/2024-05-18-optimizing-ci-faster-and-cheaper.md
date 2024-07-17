---
layout: blog
title:  Optimizing our CI (3x Faster, 6x Cheaper)
date:   2024-05-18 +0800
categories: blogs
tags: [optimization, ruby, ci/cd]
---

[cover]:  /assets/optimizing-ci-faster-and-cheaper-cover.png

![][cover]

## <b>TL;DR</b>

- Run tests in parallelize with `flatware`
- Switched our CI runners from Github Actions to third-party runners

## Background

As we developed more features at [NodeFlair](https://nodeflair.com) and wrote more tests, the time for our CI started to creep up to as long as 15 minutes per build.

While this isn’t necessarily a huge issue on its own, now that I have 2-3 engineering interns at any given time, this slow build results in slower feedback and <b>affects our shipping speed</b>.

## Bottlenecks

1. When I examined the build process log, I discovered that container initialization takes 1 minute.

2. Additionally, although we enabled caching for our dependencies (`yarn build` and `bundle install`), the caches are not being reused often as they are frequently evicted. This is likely due to the 10 GB cache size limit imposed by GitHub Actions.

3. Furthermore, our RSpec tests are taking a long time to run (~12 minutes).

## Solutions

### 1. Switch to 3rd-party runners and caches

I researched third-party runners and decided to use [Blacksmith](https://blacksmith.sh/) <i>(comparisons can be found in the Appendix section)</i>. Blacksmith’s machines are faster because they use gaming CPUs that are better than GitHub’s decade-old server CPUs <i>([GitHub uses old hardwares from 2015](https://buildjet.com/for-github-actions/blog/a-performance-review-of-github-actions-the-cost-of-slow-hardware))</i>.

With the drop-in replacement, the time taken for <b>container initialization dropped from 60 seconds to 30 seconds</b>.

Additionally, with their 25 GB cache limit instead of GitHub’s 10 GB, we experienced <b>less cache eviction</b>. For context, not having to run `bundle install` saves us 2 minutes!

Also, not to worry – with all these improvements, they are still <b>2x cheaper than GitHub</b>!

### 2. Parallize tests with Flatware

Previously, we were running our tests without parallelization. This means only one test runs at a time, despite having multiple CPU cores available. Given that our machines have multiple CPU cores, we can (and should) instead run the tests in parallel.

We opted for the [Flatware gem](https://github.com/briandunn/flatware) because it nails what we need without any extra fluff. As demonstrated in the examples below, it integrates easily and <b>requires minimal changes</b> to our codebase.

```yaml
# BEFORE
- name: Database setup
  run: bundle exec flatware fan rake db:test:prepare
- name: Run tests
  run: bundle exec rspec
```

```yaml
# AFTER
- name: Database setup
  run: bundle exec rake db:test:prepare
- name: Run tests
  run: bundle exec flatware rspec
```

Some simple benchmarking on my machine (MacBook M2 Air) yielded the following results:
- Original: 3 minutes 13 seconds
- Flatware (-w 2): 2 minutes 41 seconds (-16.5%)
- Flatware (-w 8): 2 minutes 5 seconds (-35.2%)

It appears that the greater the number of CPU cores, the more parallelization and significant the improvement. Therefore, should we use machines with as many vCPUs as possible?


NO!

Machines with more vCPU cores typically incur higher costs, as cost tends to scale with the number of cores. For reasons of <b>cost efficiency</b>, we have chosen not to do that because:

1. While more cores increase performance for the tests during parallelization, they <b>do not speed up other parts of the CI process</b>.
2. Time savings is not linearly proportional to the number of cores due to <b>contention for other resources</b>, such as RAM.

## Overall

With the combinations of these methods:
- The CI build time is reduced by 3x (from ~15 minutes to ~5 minutes)
- Our CI bills are 6x cheaper ($0.12213/build → $0.02006/build)

## Appendix: Comparison of 3rd-party runners

### 1. [BuildJet](https://buildjet.com/)

We initially went for BuildJet. While it worked well, we quickly learnt that Blacksmith provided faster caches and a more generous free tier.

### 2. [Blacksmith](https://blacksmith.sh/)

Blacksmith offers pricing that matches BuildJet’s rates, which are 50% cheaper than GitHub’s.

What made us switch from BuildJet was their Colocated Cache. In our brief benchmarks, it is much faster—approximately 7 times faster — jumping from around 100MB/s to 700MB/s.

![](/assets/buildjet-vs-blacksmith-cache.png)

In addition, they provide 25GB of free cache storage, up from BuildJet’s 20GB.

Most importantly, they offer a generous 3,000 free minutes per month, which is enough to reduce our CI bills to zero!

Additionally, the founders are incredibly responsive via email. I reached out regarding a minor issue, and they fixed it within a few hours! Thanks, Aayush!

### 3. [Ubicloud](https://www.ubicloud.com/)

Of all the third-party runners, <b>Ubicloud is the cheapest — 10 times cheaper than GitHub’s cost</b> and 5 times cheaper than Blacksmith and BuildJet.

Additionally, they provide 1,250 free minutes each month.

If your monthly CI build duration significantly exceeds the 3,000 free minutes provided by Blacksmith, then Ubicloud might be a better alternative for you.
