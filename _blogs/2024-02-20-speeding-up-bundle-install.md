---
layout: blog
title:  Speeding up "bundle install" by 2x
date:   2024-02-20 +0800
categories: blogs
tags: [ruby on rails]
---

## Before

```sh
bundle install --redownload
# 115.20s user 31.70s system 183% cpu 1:20.08 total
```

## After

```sh
MAKE="make --jobs 8" bundle install --redownload
# 142.61s user 33.69s system 438% cpu 40.228 total
```

With a simple tweak, we halved the time needed to install the gems, which is very helpful for CI!

## Why does this work

The `MAKE` environment variable must be passed in for the `--jobs` argument to work because it allows parallelization across CPU cores during the bundle install process.

The `rake-compiler` library, commonly used by native extensions, leverages `make` with the `--jobs` option to achieve true parallelism.

By setting the `MAKE` environment variable, you can significantly improve bundle install performance, especially if your Gemfile contains numerous native extensions and you’re using MRI with multiple CPU cores available.

<i>Full explanation from this original blogpost I referenced - [One Weird Trick That Will Speed Up Your Bundle Install
](https://build.betterup.com/one-weird-trick-that-will-speed-up-your-bundle-install/)</i>