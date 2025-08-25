---
layout: study
title:  "Total TypeScript (by Matt Pocock)"
date:   2025-08-24 00:00:00 +0800
image: /assets/total-typescript/cover.jpg
categories: studies
tags: [typescript]
---

Just jotting down some quick notes and learnings from the [course](https://www.totaltypescript.com/) by Matt Pocock.

![](/assets/total-typescript/cover.jpg)

# TypeScript Pro Essentials

## `Readonly<>`

- Good for ensuring certain objects aren't mutable e.g. `Readonly<SearchParams>`

## `Parameters<>`

Gives us tuple type (array-like), because functions' parameters are, by default, a list of arguments.

```ts
function greet(name: string, age: number) {
  return `Hello ${name}, age ${age}`;
}

type GreetParams = Parameters<typeof greet>;
// GreetParams = [name: string, age: number]
```

Useful when writing wrappers, especially <b>around 3rd party functions where we cannot rewrite it to use our own types</b>:
```ts
function fetchUser(id: number, includePosts: boolean) {}

type FetchUserArgs = Parameters<typeof fetchUser>;
// Automatically = [id: number, includePosts: boolean]

function callApi(...args: FetchUserArgs) {
  return fetchUser(...args);
}
```

## `ReturnType<>`

Similar to `Parameters<>` where it's more useful when using with wrappers.

```ts
const userQuery = () => {
  return prisma.user.findUnique({   where: { id: "1" } })
};

type User = Awaited<ReturnType<typeof userQuery>>;
// User = { id: string; name: string; ... } | null
```

## `satisfies`

- `as` is *"Trust me, I know the type of this value."* - it forces the type without checking
- `satisfies` checks that it matches a type but keeps the original type. Allows for extra properties.

```ts
/* Use `as` */
let value: unknown = "123";

// TypeScript doesn't know it's a string, so we force it
let length = (value as string).length;

////

/* Use `satisfies` */
type User = { name: string };

const user = {
  name: "Alice",
  age: 30 // extra property
} satisfies User;

// TypeScript knows user has name, AND age
console.log(user.age); // 30
```

| Feature     | `as`                | `satisfies`                            |
| ----------- | ------------------- | -------------------------------------- |
| Type check  | No (forces type)    | Yes (checks type compatibility)        |
| Keeps type  | No (overrides type) | Yes (keeps full type inference)        |
| Extra props | Can hide them       | Allows them while ensuring type safety |
