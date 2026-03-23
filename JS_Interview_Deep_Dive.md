# JavaScript Interview — Complete Deep Dive

> Covers ALL commonly asked JS interview topics.

---

## PART A: CORE FUNDAMENTALS (Covered)

---

### Q1: var vs let vs const
| Feature | var | let | const |
|---|---|---|---|
| Scope | Function | Block | Block |
| Hoisting | Yes (initialized as `undefined`) | Yes (but TDZ) | Yes (but TDZ) |
| Re-declaration | Allowed | Not allowed | Not allowed |
| Re-assignment | Allowed | Allowed | Not allowed |

**Bug example:**
```js
for (var i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 1000);
}
// Output: 5, 5, 5, 5, 5 — only ONE `i` shared (function-scoped)

for (let i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 1000);
}
// Output: 0, 1, 2, 3, 4 — each iteration gets its OWN `i` (block-scoped)
```

---

### Q2: Hoisting
JavaScript moves declarations to the top of their scope during compilation — but not assignments.
```js
console.log(a); // undefined — var hoisted
var a = 5;

console.log(b); // ReferenceError — let is in TDZ
let b = 10;

greet(); // works — function declarations fully hoisted
function greet() { console.log("hi"); }

hello(); // TypeError — var hello is hoisted as undefined, not a function
var hello = function() { console.log("hello"); };
```

---

### Q3: Closures
A function that remembers variables from its outer scope even after the outer function has returned.
```js
function createCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    getCount: () => count
  };
}
const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2
counter.getCount();  // 2
```
**Use cases**: data privacy, function factories, memoization, module pattern.

---

### Q4: `this` keyword
| Context | `this` refers to |
|---|---|
| Global (non-strict) | `window` / `global` |
| Global (strict mode) | `undefined` |
| Object method `obj.fn()` | `obj` |
| Arrow function | Inherits from enclosing scope (lexical) |
| `new Fn()` | The new object |
| `call/apply/bind` | Explicitly set |
| Event handler | The DOM element |

```js
const obj = {
  name: "Alice",
  regular() { console.log(this.name); },     // "Alice"
  arrow: () => console.log(this.name)         // undefined (lexical this)
};
```

---

### Q5: call vs apply vs bind
```js
function greet(greeting, punct) {
  console.log(`${greeting}, I'm ${this.name}${punct}`);
}
const person = { name: "John" };

greet.call(person, "Hi", "!");       // call — args comma-separated
greet.apply(person, ["Hi", "!"]);    // apply — args as array
const bound = greet.bind(person);    // bind — returns new function
bound("Hi", "!");
```
**Trick**: Call=Comma, Apply=Array, Bind=Bound(returns fn)

---

### Q6: Prototypal Inheritance & Prototype Chain
```js
function Animal(name) { this.name = name; }
Animal.prototype.speak = function() { return `${this.name} makes a sound`; };

function Dog(name) {
  Animal.call(this, name);
}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

const rex = new Dog("Rex");
rex.speak(); // found on Animal.prototype — walked up the chain
```
Chain: `rex` → `Dog.prototype` → `Animal.prototype` → `Object.prototype` → `null`

---

### Q7: Event Loop, Call Stack & Queues
**Order**: Sync code → ALL Microtasks (Promises) → ONE Macrotask (setTimeout) → repeat
```js
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
// Output: 1, 4, 3, 2
```

---

### Q8: Promises & async/await
```js
// Promise
const fetchData = () => new Promise((resolve, reject) => {
  setTimeout(() => resolve("data"), 1000);
});

// async/await
async function getData() {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```

---

### Q9: == vs ===
- `==` loose — type coercion (`"5" == 5` → true)
- `===` strict — no coercion (`"5" === 5` → false)
- Always use `===`.

---

### Q10: Shallow Copy vs Deep Copy
```js
const obj = { a: 1, b: { c: 2 } };
const shallow = { ...obj };       // nested objects share reference
const deep = structuredClone(obj); // fully independent
```

---

### Q11: Array Methods
```js
[1,2,3].map(x => x * 2);           // [2,4,6] — transform
[1,2,3].filter(x => x > 1);        // [2,3] — keep matching
[1,2,3].reduce((a,x) => a+x, 0);   // 6 — accumulate
[1,2,3].find(x => x > 1);          // 2 — first match
[1,2,3].some(x => x > 2);          // true — any match?
[1,2,3].every(x => x > 0);         // true — all match?
```

---

### Q12: Destructuring & Spread/Rest
```js
const { name, age, role = "user" } = user;     // object destructure
const [a, , c] = [1, 2, 3];                    // array destructure
const merged = { ...obj1, ...obj2 };            // spread
function sum(...nums) { return nums.reduce((a,b) => a+b, 0); } // rest
```

---

### Q13: Currying
```js
const multiply = (a) => (b) => a * b;
const double = multiply(2);
double(5); // 10
```

---

### Q14: Debouncing & Throttling
- **Debounce** = wait for silence (search input)
- **Throttle** = max one per interval (scroll event)
```js
function debounce(fn, delay) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}
function throttle(fn, limit) {
  let last = 0;
  return (...args) => { const now = Date.now(); if (now - last >= limit) { last = now; fn(...args); } };
}
```

---

### Q15: Event Delegation
One listener on parent instead of many on children. Works because events **bubble up**.
```js
document.getElementById("list").addEventListener("click", (e) => {
  if (e.target.tagName === "LI") console.log(e.target.textContent);
});
```

---

---

## PART B: MORE INTERVIEW QUESTIONS

---

### Q16: Truthy & Falsy Values

**Falsy values** (only 8 — memorize these):
```js
false, 0, -0, 0n, "", null, undefined, NaN
```
**Everything else is truthy**, including:
```js
"0"       // truthy (non-empty string)
" "       // truthy (space is still a character)
[]        // truthy (empty array)
{}        // truthy (empty object)
function(){} // truthy
```

**Tricky interview questions:**
```js
Boolean([])        // true
Boolean("")        // false
[] == false        // true  ([] → "" → 0, false → 0)
[] == ![]          // true! ([] is truthy, ![] is false, then coercion makes both 0)
```

---

### Q17: typeof vs instanceof

```js
// typeof — returns a string of the type
typeof "hello"     // "string"
typeof 42          // "number"
typeof true        // "boolean"
typeof undefined   // "undefined"
typeof null        // "object"     ← famous JS bug!
typeof {}          // "object"
typeof []          // "object"     ← arrays are objects
typeof function(){} // "function"
typeof Symbol()    // "symbol"
typeof 10n         // "bigint"

// instanceof — checks prototype chain
[] instanceof Array   // true
[] instanceof Object  // true (Array inherits from Object)
{} instanceof Object  // true

// How to properly check for an array:
Array.isArray([]);    // true  ← best way
Array.isArray({});    // false
```

---

### Q18: IIFE (Immediately Invoked Function Expression)

A function that runs **immediately** after it's defined.
```js
(function() {
  var secret = "hidden";
  console.log("I run immediately!");
})();

// With arrow function
(() => {
  console.log("Arrow IIFE");
})();

// With parameters
((name) => {
  console.log(`Hello ${name}`);
})("Alice");
```

**Why use it?**
- Create a **private scope** (avoid polluting global scope)
- **Module pattern** (before ES6 modules existed)
- Run initialization code once

---

### Q19: Higher-Order Functions

A function that either **takes a function as an argument** or **returns a function**.
```js
// Takes a function
function repeat(n, action) {
  for (let i = 0; i < n; i++) action(i);
}
repeat(3, console.log); // 0, 1, 2

// Returns a function
function greeter(greeting) {
  return function(name) {
    return `${greeting}, ${name}!`;
  };
}
const sayHi = greeter("Hi");
sayHi("Alice"); // "Hi, Alice!"

// Built-in HOFs: map, filter, reduce, forEach, sort, etc.
```

---

### Q20: Pure Functions & Side Effects

**Pure function** — same input always gives same output, no side effects.
```js
// PURE ✓
function add(a, b) { return a + b; }

// IMPURE ✗ — modifies external state
let total = 0;
function addToTotal(n) { total += n; return total; }

// IMPURE ✗ — depends on external state
function getTime() { return new Date(); }
```

**Side effects**: modifying global variables, DOM manipulation, API calls, console.log, writing to files.

---

### Q21: Memoization

Caching the result of a function call so you don't recompute it for the same inputs.
```js
function memoize(fn) {
  const cache = {};
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache[key] !== undefined) return cache[key];
    cache[key] = fn(...args);
    return cache[key];
  };
}

const expensiveSquare = memoize((n) => {
  console.log("Computing...");
  return n * n;
});

expensiveSquare(4); // "Computing..." → 16
expensiveSquare(4); // 16 (from cache, no "Computing...")
```

---

### Q22: ES6 Classes

Syntactic sugar over prototypal inheritance.
```js
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);            // MUST call super() before using `this`
    this.breed = breed;
  }
  speak() {
    return `${this.name} barks`; // method overriding
  }
}

const dog = new Dog("Rex", "Labrador");
dog.speak();            // "Rex barks"
dog instanceof Dog;     // true
dog instanceof Animal;  // true
```

**Static methods** — called on the class itself, not instances:
```js
class MathHelper {
  static add(a, b) { return a + b; }
}
MathHelper.add(2, 3); // 5
```

**Private fields** (ES2022):
```js
class User {
  #password;  // private — can't access outside class
  constructor(name, password) {
    this.name = name;
    this.#password = password;
  }
  checkPassword(input) { return input === this.#password; }
}
```

---

### Q23: Getters & Setters

```js
class Circle {
  constructor(radius) {
    this.radius = radius;
  }
  get area() {
    return Math.PI * this.radius ** 2;  // computed property
  }
  get diameter() {
    return this.radius * 2;
  }
  set diameter(d) {
    this.radius = d / 2;               // set radius when diameter is assigned
  }
}

const c = new Circle(5);
c.area;           // 78.54 — accessed like a property, not a method call
c.diameter = 20;  // sets radius to 10
```

---

### Q24: Map vs Object

| Feature | Map | Object |
|---|---|---|
| Key types | Any (objects, functions, primitives) | Strings and Symbols only |
| Order | Insertion order guaranteed | Mostly ordered (but quirks with numeric keys) |
| Size | `map.size` | `Object.keys(obj).length` |
| Iteration | Directly iterable (for...of) | Need `Object.keys/values/entries` |
| Performance | Better for frequent add/delete | Better for static structure |
| Prototype | No inherited keys | Has prototype chain keys |

```js
const map = new Map();
map.set("name", "Alice");
map.set(42, "number key");
map.set({ id: 1 }, "object key");   // objects as keys!

map.get("name");    // "Alice"
map.has(42);        // true
map.size;           // 3
map.delete(42);

// Iterate
for (const [key, value] of map) {
  console.log(key, value);
}
```

---

### Q25: Set

A collection of **unique values** — no duplicates.
```js
const set = new Set([1, 2, 3, 3, 2]);
// Set { 1, 2, 3 } — duplicates removed

set.add(4);
set.has(2);      // true
set.delete(2);
set.size;        // 3

// Remove duplicates from array (most asked!)
const arr = [1, 2, 2, 3, 3, 4];
const unique = [...new Set(arr)]; // [1, 2, 3, 4]
```

---

### Q26: WeakMap & WeakSet

**WeakMap** — keys must be objects, keys are **weakly referenced** (garbage collected when no other reference exists).
```js
const wm = new WeakMap();
let obj = { data: "important" };
wm.set(obj, "metadata");
wm.get(obj);  // "metadata"
obj = null;   // obj is now garbage collected, entry removed from WeakMap
```

**WeakSet** — same concept, stores objects with weak references.

**Use case**: Storing metadata about objects without preventing garbage collection (e.g., tracking visited DOM nodes).

**Key difference**: WeakMap/WeakSet are NOT iterable and have no `.size`.

---

### Q27: Symbol

A **unique, immutable** primitive used as object property keys.
```js
const id1 = Symbol("id");
const id2 = Symbol("id");
id1 === id2;  // false — every Symbol is unique!

const user = {
  name: "Alice",
  [id1]: 123   // Symbol as property key
};

user[id1];         // 123
Object.keys(user); // ["name"] — Symbols are NOT enumerable!

// Global symbol registry
const s1 = Symbol.for("shared");
const s2 = Symbol.for("shared");
s1 === s2; // true — same symbol from registry
```

**Use cases**: Avoid property name collisions, define metadata, well-known symbols (`Symbol.iterator`, `Symbol.toPrimitive`).

---

### Q28: Iterators & Generators

**Iterator** — an object with a `next()` method that returns `{ value, done }`.
```js
const range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next() {
        return current <= last
          ? { value: current++, done: false }
          : { done: true };
      }
    };
  }
};

for (const num of range) console.log(num); // 1, 2, 3, 4, 5
```

**Generator** — a function that can **pause and resume** using `yield`.
```js
function* idGenerator() {
  let id = 1;
  while (true) {
    yield id++;  // pauses here, resumes on next .next() call
  }
}

const gen = idGenerator();
gen.next(); // { value: 1, done: false }
gen.next(); // { value: 2, done: false }
gen.next(); // { value: 3, done: false }
```

**Use cases**: Lazy evaluation, infinite sequences, custom iterables, managing async flow.

---

### Q29: Optional Chaining (?.) & Nullish Coalescing (??)

```js
const user = { address: { city: "NYC" } };

// Optional chaining — safely access nested properties
user?.address?.city;      // "NYC"
user?.phone?.number;      // undefined (no error!)
user?.greet?.();          // undefined (safe method call)

// Without optional chaining
user && user.address && user.address.city; // old way

// Nullish coalescing — fallback only for null/undefined
const name = null ?? "Guest";         // "Guest"
const count = 0 ?? 10;                // 0 (0 is not null/undefined!)
const empty = "" ?? "default";        // "" (empty string is not null/undefined!)

// vs || (logical OR) — which also treats 0, "", false as falsy
const count2 = 0 || 10;              // 10 (0 is falsy!)
const empty2 = "" || "default";      // "default" (empty string is falsy!)
```

**Rule**: Use `??` when 0, "", false are valid values. Use `||` when you want to fallback for any falsy value.

---

### Q30: Short-Circuit Evaluation

```js
// && — returns first falsy value, or last value if all truthy
false && "hello"    // false
"hi" && "hello"     // "hello"
"hi" && 0 && "bye"  // 0

// || — returns first truthy value, or last value if all falsy
false || "hello"    // "hello"
"" || 0 || "bye"    // "bye"
"" || 0 || null     // null

// Practical uses
const name = user && user.name;           // safe access
const displayName = username || "Guest";  // default value
isLoggedIn && showDashboard();            // conditional execution
```

---

### Q31: for...in vs for...of

```js
const arr = ["a", "b", "c"];

// for...in — iterates over KEYS (indices / property names)
for (const key in arr) console.log(key);    // "0", "1", "2" (strings!)

// for...of — iterates over VALUES (works with iterables: arrays, strings, maps, sets)
for (const val of arr) console.log(val);    // "a", "b", "c"

const obj = { x: 1, y: 2 };

// for...in — works on objects (iterates enumerable properties)
for (const key in obj) console.log(key);    // "x", "y"

// for...of — does NOT work on plain objects (they're not iterable)
// for (const val of obj) {} // TypeError!
// Fix: use Object.entries
for (const [key, val] of Object.entries(obj)) console.log(key, val);
```

**Rule**: `for...in` = keys (objects), `for...of` = values (iterables)

---

### Q32: Object Methods (Object.keys/values/entries/freeze/seal)

```js
const user = { name: "Alice", age: 25, city: "NYC" };

Object.keys(user);     // ["name", "age", "city"]
Object.values(user);   // ["Alice", 25, "NYC"]
Object.entries(user);  // [["name","Alice"], ["age",25], ["city","NYC"]]

// Object.assign — merge/clone (shallow)
const clone = Object.assign({}, user);
const merged = Object.assign({}, obj1, obj2);

// Object.freeze — no add, delete, or modify (shallow)
const frozen = Object.freeze({ a: 1, b: { c: 2 } });
frozen.a = 99;       // silently fails (strict mode: TypeError)
frozen.b.c = 99;     // WORKS! freeze is shallow

// Object.seal — can modify existing, but can't add or delete
const sealed = Object.seal({ a: 1 });
sealed.a = 99;       // works
sealed.b = 2;        // fails — can't add
delete sealed.a;     // fails — can't delete

// Object.create — create object with specific prototype
const proto = { greet() { return "hi"; } };
const child = Object.create(proto);
child.greet(); // "hi" — inherited from proto
```

---

### Q33: Property Descriptors

```js
const obj = {};
Object.defineProperty(obj, "name", {
  value: "Alice",
  writable: false,      // can't reassign
  enumerable: true,     // shows in for...in and Object.keys
  configurable: false   // can't delete or redefine
});

obj.name = "Bob";       // fails silently (strict: TypeError)

// Check descriptors
Object.getOwnPropertyDescriptor(obj, "name");
// { value: "Alice", writable: false, enumerable: true, configurable: false }
```

---

### Q34: Promise.all vs Promise.allSettled vs Promise.race vs Promise.any

```js
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.reject("error");

// Promise.all — resolves when ALL resolve, REJECTS on FIRST rejection
await Promise.all([p1, p2]);      // [1, 2]
await Promise.all([p1, p3]);      // throws "error"

// Promise.allSettled — waits for ALL (never rejects)
await Promise.allSettled([p1, p3]);
// [{ status:"fulfilled", value:1 }, { status:"rejected", reason:"error" }]

// Promise.race — resolves/rejects with whichever settles FIRST
await Promise.race([p1, p2]);     // 1 (p1 resolved first)

// Promise.any — resolves with FIRST fulfilled, ignores rejections
await Promise.any([p3, p1, p2]);  // 1 (first successful one)
await Promise.any([p3]);          // AggregateError (all rejected)
```

| Method | Resolves | Rejects |
|---|---|---|
| `all` | All fulfill | First rejection |
| `allSettled` | Always (after all settle) | Never |
| `race` | First settled (fulfill) | First settled (reject) |
| `any` | First fulfilled | All rejected |

---

### Q35: Callback Hell & Solutions

```js
// Callback hell (pyramid of doom)
getUser(id, (user) => {
  getOrders(user.id, (orders) => {
    getItems(orders[0].id, (items) => {
      // deeply nested...
    });
  });
});

// Solution 1: Promises
getUser(id)
  .then(user => getOrders(user.id))
  .then(orders => getItems(orders[0].id))
  .then(items => console.log(items))
  .catch(err => console.error(err));

// Solution 2: async/await (cleanest)
async function fetchData(id) {
  const user = await getUser(id);
  const orders = await getOrders(user.id);
  const items = await getItems(orders[0].id);
  return items;
}
```

---

### Q36: Error Handling Patterns

```js
// try/catch/finally
try {
  const data = JSON.parse(invalidJSON);
} catch (err) {
  console.error(err.message);   // handle error
} finally {
  console.log("always runs");   // cleanup
}

// Custom errors
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}
throw new ValidationError("Invalid email", "email");

// Async error handling
async function fetchData() {
  try {
    const res = await fetch("/api/data");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}
```

---

### Q37: Template Literals & Tagged Templates

```js
// Basic template literals
const name = "Alice";
const greeting = `Hello, ${name}!`;       // string interpolation
const multiline = `Line 1
Line 2`;                                    // multiline strings
const expr = `Sum: ${2 + 3}`;             // expressions inside ${}

// Tagged templates — function processes the template
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    return result + str + (values[i] ? `<b>${values[i]}</b>` : "");
  }, "");
}

const name2 = "Alice";
const age = 25;
highlight`Name: ${name2}, Age: ${age}`;
// "Name: <b>Alice</b>, Age: <b>25</b>"

// Real use: styled-components uses tagged templates!
// const Button = styled.button`color: ${props => props.primary ? "blue" : "gray"}`;
```

---

### Q38: Proxy & Reflect

**Proxy** — intercept and customize operations on objects.
```js
const handler = {
  get(target, prop) {
    return prop in target ? target[prop] : `Property "${prop}" not found`;
  },
  set(target, prop, value) {
    if (prop === "age" && typeof value !== "number") {
      throw new TypeError("Age must be a number");
    }
    target[prop] = value;
    return true;
  }
};

const user = new Proxy({}, handler);
user.age = 25;         // works
user.age = "twenty";   // TypeError!
user.name;             // 'Property "name" not found'
```

**Use cases**: validation, logging, data binding (Vue.js reactivity), default values.

---

### Q39: NaN Quirks

```js
typeof NaN;           // "number" (yes, NaN is of type number!)
NaN === NaN;          // false (NaN is not equal to itself!)
NaN == NaN;           // false

// How to check for NaN:
Number.isNaN(NaN);    // true  ✓ (recommended)
Number.isNaN("hello"); // false (doesn't coerce)
isNaN("hello");       // true  ✗ (coerces string, unreliable)
Object.is(NaN, NaN);  // true

// What produces NaN:
0 / 0;                // NaN
parseInt("hello");    // NaN
Math.sqrt(-1);        // NaN
undefined + 1;        // NaN
```

---

### Q40: Type Coercion — Tricky Interview Questions

```js
// String coercion (+ with string)
"5" + 3          // "53" (number → string)
"5" + true       // "5true"
"5" + null       // "5null"
"5" + undefined  // "5undefined"

// Numeric coercion (-, *, /, comparison)
"5" - 3          // 2  (string → number)
"5" * "2"        // 10
true + true      // 2  (true → 1)
false + 1        // 1  (false → 0)
null + 1         // 1  (null → 0)
undefined + 1    // NaN

// Object coercion
[] + []           // ""  (both → "")
[] + {}           // "[object Object]"
{} + []           // 0   (browser: {} is empty block, +[] → 0)
![] + []          // "false"  (![] → false, false + [] → "false")

// Comparison traps
null == undefined  // true  (special rule)
null === undefined // false
null == 0          // false (null only equals undefined)
null >= 0          // true  (comparison coerces null to 0!)
```

---

### Q41: arguments Object vs Rest Parameters

```js
// arguments — array-like object (NOT a real array), only in regular functions
function sum() {
  console.log(arguments);       // { 0: 1, 1: 2, 2: 3, length: 3 }
  // Convert to real array:
  return Array.from(arguments).reduce((a, b) => a + b, 0);
}
sum(1, 2, 3); // 6

// Arrow functions do NOT have `arguments`
const arrowSum = () => console.log(arguments); // ReferenceError

// REST parameters — modern, IS a real array
function sum2(...nums) {
  return nums.reduce((a, b) => a + b, 0);  // nums is a real array
}
```

**Rule**: Always use rest parameters (`...args`) over `arguments`.

---

### Q42: Module Pattern (Pre-ES6)

```js
const UserModule = (function() {
  // Private
  let users = [];

  function validate(user) {
    return user.name && user.email;
  }

  // Public (revealed)
  return {
    addUser(user) {
      if (validate(user)) users.push(user);
    },
    getUsers() {
      return [...users]; // return copy, not reference
    },
    count() {
      return users.length;
    }
  };
})();

UserModule.addUser({ name: "Alice", email: "a@a.com" });
UserModule.count(); // 1
UserModule.users;   // undefined (private!)
```

---

### Q43: ES6 Modules (import/export)

```js
// Named exports (multiple per file)
export const PI = 3.14;
export function add(a, b) { return a + b; }
// import: import { PI, add } from './math.js';
// import with rename: import { add as sum } from './math.js';

// Default export (one per file)
export default class User { ... }
// import: import User from './User.js';
// can use any name: import MyUser from './User.js';

// Import all
import * as Math from './math.js';
Math.PI; Math.add(1, 2);

// Dynamic import (code splitting)
const module = await import('./heavy-module.js');
```

---

### Q44: Recursion — Common Examples

```js
// Factorial
function factorial(n) {
  if (n <= 1) return 1;       // base case
  return n * factorial(n - 1); // recursive case
}
factorial(5); // 120

// Fibonacci
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

// Flatten nested array
function flatten(arr) {
  return arr.reduce((acc, val) =>
    Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []);
}
flatten([1, [2, [3, [4]]]]); // [1, 2, 3, 4]

// Deep clone
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  const clone = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) clone[key] = deepClone(obj[key]);
  }
  return clone;
}
```

---

### Q45: setTimeout / setInterval — Tricky Questions

```js
// Q: What does this print?
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000);
}
// Answer: 3, 3, 3 (var is function-scoped, same `i`)

// Fix 1: use let
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000);
}
// 0, 1, 2

// Fix 2: use IIFE
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 1000);
  })(i);
}

// Q: What's the order?
setTimeout(() => console.log("a"), 0);
console.log("b");
// Answer: "b", "a" — setTimeout goes to macrotask queue
```

---

### Q46: Strict Mode ("use strict")

```js
"use strict";

// What it prevents:
x = 10;                    // ReferenceError (no implicit globals)
delete Object.prototype;   // TypeError (can't delete non-configurable)
function f(a, a) {}        // SyntaxError (no duplicate params)
var let = 5;               // SyntaxError (reserved words)
this;                      // undefined (in functions, not window)
0123;                      // SyntaxError (no octal literals)
```

**Where it's automatic**: ES6 modules, ES6 classes.

---

### Q47: Web Storage API (localStorage / sessionStorage)

```js
// localStorage — persists until manually cleared
localStorage.setItem("theme", "dark");
localStorage.getItem("theme");      // "dark"
localStorage.removeItem("theme");
localStorage.clear();                // remove all

// sessionStorage — cleared when tab closes
sessionStorage.setItem("token", "abc123");

// Only stores strings! Objects need JSON:
localStorage.setItem("user", JSON.stringify({ name: "Alice" }));
const user = JSON.parse(localStorage.getItem("user"));

// Storage event (fires in OTHER tabs)
window.addEventListener("storage", (e) => {
  console.log(e.key, e.oldValue, e.newValue);
});
```

---

### Q48: Event Propagation (Bubbling & Capturing)

```js
// Events travel in 3 phases:
// 1. CAPTURING — window → document → ... → target's parent (top-down)
// 2. TARGET — the element that was clicked
// 3. BUBBLING — target's parent → ... → document → window (bottom-up)

// Default: listeners fire during BUBBLING phase
parent.addEventListener("click", handler);          // bubbling (default)
parent.addEventListener("click", handler, true);    // capturing phase

// Stop propagation
element.addEventListener("click", (e) => {
  e.stopPropagation();       // stops event from going further
  e.stopImmediatePropagation(); // also stops other listeners on same element
});

// Prevent default behavior (e.g., form submit, link navigation)
form.addEventListener("submit", (e) => {
  e.preventDefault();
});

// event.target vs event.currentTarget
// target: the element that was ACTUALLY clicked
// currentTarget: the element the listener is ATTACHED to
```

---

### Q49: Fetch API & Error Handling

```js
// Basic GET
const response = await fetch("/api/users");
const data = await response.json();

// POST with body
const res = await fetch("/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Alice", email: "a@a.com" })
});

// IMPORTANT: fetch does NOT throw on HTTP errors (404, 500)!
const res2 = await fetch("/api/data");
if (!res2.ok) {
  throw new Error(`HTTP ${res2.status}: ${res2.statusText}`);
}

// AbortController — cancel requests
const controller = new AbortController();
fetch("/api/data", { signal: controller.signal });
controller.abort(); // cancels the request

// Timeout pattern
const fetchWithTimeout = (url, timeout = 5000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(id));
};
```

---

### Q50: Miscellaneous Quick-Fire (Often Asked)

**Q: What is "use strict"?**
Strict mode catches common errors: no implicit globals, no duplicate params, `this` is undefined in functions.

**Q: What is the difference between `null` and `undefined`?**
- `undefined` — variable declared but not assigned, or missing function return
- `null` — intentional "empty" value, explicitly assigned by developer

**Q: What is the Temporal Dead Zone?**
The period between entering a scope and the `let`/`const` declaration where the variable exists but can't be accessed.

**Q: What does `Object.is()` do?**
Like `===` but handles edge cases: `Object.is(NaN, NaN)` → true, `Object.is(+0, -0)` → false.

**Q: What are tagged templates?**
Template literals prefixed with a function: `` fn`hello ${name}` `` — used in styled-components, i18n, sanitization.

**Q: What is tree shaking?**
Dead code elimination. Bundlers (Webpack, Vite) remove unused `export`s. Only works with ES modules (static `import`/`export`), not CommonJS.

**Q: Difference between `Object.freeze()` and `Object.seal()`?**
- `freeze`: no add, no delete, no modify (read-only)
- `seal`: no add, no delete, but CAN modify existing properties

**Q: How do you check if a property exists?**
```js
"name" in obj;              // true (checks prototype chain too)
obj.hasOwnProperty("name"); // true (own properties only)
Object.hasOwn(obj, "name"); // true (modern, recommended)
```

---

*End of JavaScript Deep Dive — 50 Questions*
