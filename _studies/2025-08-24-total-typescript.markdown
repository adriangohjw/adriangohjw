---
layout: study
title:  "Total TypeScript (by Matt Pocock)"
date:   2025-08-24 00:00:00 +0800
image: /assets/total-typescript/cover.jpg
categories: studies
tags: [typescript]
uncompleted: true
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

## Designing Your Types

### Basics

Let's say we have this:

```ts
type ErrorShape = {
  error: {
    message: string;
  };
};

type UserDataShape =
  | {
      data: {
        id: string;
        name: string;
        email: string;
      };
    }
  | ErrorShape;

type PostDataShape =
  | {
      data: {
        id: string;
        title: string;
        body: string;
      };
    }
  | ErrorShape;
```

Instead of repeating this pattern, we can define a reusable generic type:

```ts
// TData is a name we give
type DataShape<TData> =
  | {
      data: TData
    }
  | ErrorShape;

type UserDataShape = DataShape<{
  id: string;
  name: string;
  email: string;
}>;

type PostDataShape = DataShape<{
  id: string;
  title: string;
  body: string;
}>;
```

### Functions

```ts
type PromiseFunc<
  TInput,
  TOutput
> = (input: TInput) => Promise<TOutput>;

type Example1 = PromiseFunc<string, any>
type Example2 = PromiseFunc<number, boolean>
```

### Default type

```ts
type Result<
  TSuccess,
  TError = Error // If TError not passed in, it defaults to Error
>
```

### Constraints `extends`

```ts
type Result<
  TSuccess,
  TError extends { message: string } = Error
  // TError must have `.message` string prop
>
```

### Stricter Omit

```ts
type StricterOmit<
  TInput,
  K extends keyof TInput
> = Omit<TInput, K>

type AllowedExample = StricterOmit<
  { a: string },
  "a"
>

type NotAllowedExample = StricterOmit<
  { a: string },
  "b" // <-- "b" is not a key
>
```

### Template Literal Types

```ts
// This must be a string starting with "/"
type RouteType = `/${string}`
const goToRoute = (string: RouteType) => {}

goToRoute("/home") // allowed
goToRoute("home") // not allowed
```

Another example use case:
```ts
type BreadType = 'rye' | 'brown' | 'white';
type Filling = 'cheese' | 'ham' | 'salami';
type Sandwich = `${BreadType} sandwich with ${Filling}`;

const allowedOne: Sandwich = 'rye sandwich with cheese'
const allowedTwo: Sandwich = 'brown sandwich with ham'

// chicken is not Filling
const notAllowed: Sandwich = 'rye sandwich with chicken'
```

### Mapped Types

```ts
interface Attributes {
  firstName: string
  lastName: string
}

// DOES NOT WORK:
type AttributesGetter = Record<
  keyof Attributes,
  () => string
>
// generates this with generic string value
type AttributesGetter = {
  firstName: () => string;
  lastName: () => string;
}

// WORKS:
type AttributesGetter = {
  [K in keyof Attributes]: () => Attributes[K]
}
// generates this as we can reference K in both key-value
type AttributeGetters = {
  firstName: () => Attributes["firstName"];
  lastName: () => Attributes["lastName"];
}
```

More advanced possibilities:
```ts
type AttributesGetter = {
  [K in keyof Attributes as `get${Capitalize<K>}`]: () => Attributes[K]
}
// generates this
type AttributeGetters = {
  getFirstName: () => Attributes["firstName"];
  getLastName: () => Attributes["lastName"];
}
```

## Utils Folder

### `asserts`

```ts
function assertIsAdminUser(user: User): asserts user is AdminUser {
  if (!("roles" in user)) {
    throw new Error("User is not an admin");
  }
}

const handleRequest = (user: User | AdminUser) => {
  // user can be User or AdminUser here

  assertIsAdminUser(user);

  // user can only be AdminUser here
};
```

### Function overloads

When to use overloads:

1. Different parameter shapes → different return types:
```ts
function parse(input: string): object;
function parse(input: string, asArray: true): object[];
function parse(input: string, asArray?: boolean): object | object[] {
  return asArray ? JSON.parse(input) as object[] : JSON.parse(input);
}

const one = parse('{"a":1}');       // object
const many = parse('[{"a":1}]', true); // object[]
```

2. Same function, different argument types:
```ts
function length(value: string): number;
function length<T>(value: T[]): number;
function length(value: string | any[]): number {
  return value.length;
}

length("hello");   // number
length([1, 2, 3]); // number
```
