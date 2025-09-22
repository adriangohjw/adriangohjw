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

## Unique keys

Given this code:
```ts
const stickers = []
stickers.push({
  x: event.clientX,
  y: event.clientY,
})

{stickers.map((sticker) => {
  <img ...>
})}
```

<b>Do not do this:</b>
```ts
{stickers.map((sticker, index) => {
  <img key={`sticker-${index}`} ...>
})}
```

- Issue: Work in some case, but NOT in every case.
- This removes the warning but isn’t safe if stickers are added, removed, or reordered.  If we remove the first item in the array, React will actually delete the DOM nodes associated with the last item in the array, and will then have to do a bunch of work on all the other DOM nodes.

![](/assets/joy-of-react/unique-keys-index.png)

<b>Slightly better:</b>
```ts
{stickers.map((sticker, index) => {
  <img key={sticker.src} ...>
})}
```

- This is okay ONLY if we know and can guarantee that `src` is unique

<b>Ideally, do this:</b>
```ts
stickers.push({
  x: event.clientX,
  y: event.clientY,
  id: crypto.randomUUID(),
})

{stickers.map((sticker) => {
  <img key={sticker.id} ...>
})}
```

- Unlike `Math.random()` (changes every render) or index keys (shift when array changes),
- Stable IDs let React only add new elements and leave existing ones untouched -> minimizing expensive DOM operations and avoiding mismatched reuse.

<b>But there's limitations:</b>
- We may not be able to assign unique IDs at creation
- However, we can store temporary ID in memory as it is still cheaper than generating it for every item in every render
```ts
const [stickersWithKeys, setStickersWithKeys] = useState(
  stickers.map(s => ({ ...s, key: crypto.randomUUID() }))
)
```

## Hooks

### `useId`

- Each instance of this component will receive a different value -> Multiple instances of the component can exist compared to if we hardcode `id`
- Produces the same value across server and client renders

```ts
function LoginForm() {
  const id = React.useId();
  return <Something id={id}>
}
```

### `useRef`

Why:

1. Accessing DOM elements directly

```ts
const videoRef = useRef()

// assigning it
<video ref={videoRef}>

// accessing it
videoRef.current.playbackRate = 2
```

2. Storing value without causing a re-render

```ts
const countRef = useRef(0);

const increment = () => {
  countRef.current += 1; // doesn't trigger render
  console.log(countRef.current);
};
```

### `useEffect`

#### Event subscriptions

Instead of:
```ts
<div
  className="wrapper"
  onMouseMove={(event) => {
    setMousePosition({
      x: event.clientX,
      y: event.clientY,
    });
  }}
/>
```

Do this:
```ts
// Avoids recreating the event listener on every render
React.useEffect(() => {
  function handleMouseMove(event) {
    setMousePosition({
      x: event.clientX,
      y: event.clientY,
    });
  }
  window.addEventListener('mousemove', handleMouseMove);
}, []);

<div className="wrapper" />
```
