---
layout: study
title:  "Joy of React (by Josh Comeau)"
date:   2025-09-21 00:00:00 +0800
image: /assets/joy-of-react/cover.jpg
categories: studies
tags: [typescript]
uncompleted: true
---

Just jotting down some quick notes and learnings from the [course](https://www.joyofreact.com/) by Josh Comeau.

![](/assets/joy-of-react/cover.jpg)

## Rendering v.s. Painting

The difference:
- A re-render is when React checks if anything needs to change on the screen.
- A repaint happens when the browser actually updates what you see.

For example:
```ts
function AgeLimit({ age }) {
  if (age < 18) {
    return <p>You're not old enough!</p>;
  }
  return <p>Hello, adult!</p>;
}
```
- If you change `age` from 16 to 17, React re-renders, but since the output is the same, nothing changes in the DOM.
- If you change `age` to 18, React sees a difference and updates the DOM.