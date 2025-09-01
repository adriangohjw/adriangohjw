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
  return prisma.user.findUnique({ where: { id: "1" } })
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

## Weird Parts of TypeScript

### Accept any but null or undefined

Use `{}` to accept any but null or undefined

```ts
const myFunction = (input : {}) => {}
// throw error if null/undefined
// any other input like number, string etc. all works fine
```

### Truly empty object

`Record<PropertyKey, never>` used to type a truly empty object `{}`

### `Object.keys` and `Object.entries`

TypeScript considers `Object.keys` to return an array of strings, without the guarantee of containing all the correct properties.

Looking at `Object.entries`, we end up with a `Record<string, any>` as the output

```ts
const keys = Object.entries(user).forEach(([key, value]) => {
  // key is string, and value is any
});
```

### Evolving `any`

myValue infers the type to be string

```ts
let myValue = 'abc'
myValue = 123 // <-- this throws type error
```

myValue has no type yet so no type attached to it yet

```ts
let myValue
myValue = 'abc'
myValue = 123 // <-- this doe not throw type error
```

## Declation files `.d.ts`

- For type declarations only
- Runtime code is not allowed
- Types declared inside can be exported and imported elsewhere in the project
- If writing own app or library in TypeScript → just write `.ts`, and let the compiler emit `.d.ts` if you want consumers to use your types. Only hand-write `.d.ts` when describing JS code or external/global stuff.
