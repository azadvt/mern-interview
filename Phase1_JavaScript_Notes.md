# Phase 1 — JavaScript Fundamentals Notes

---

## 1. Data Types

JavaScript has **8 data types**:

**Primitive (7)** — stored by value
| Type | Example |
|---|---|
| `String` | `"hello"` |
| `Number` | `42`, `3.14`, `NaN`, `Infinity` |
| `BigInt` | `9007199254740991n` |
| `Boolean` | `true`, `false` |
| `undefined` | variable declared but not assigned |
| `null` | intentional empty value |
| `Symbol` | `Symbol("id")` — unique identifier |

**Non-Primitive (1)** — stored by reference
| Type | Example |
|---|---|
| `Object` | `{}`, `[]`, `function(){}`, `new Date()` |

**Interview Q:** *What is the difference between `null` and `undefined`?*
> `undefined` — variable declared but not assigned (JS engine sets it). `null` — explicitly assigned by developer to mean "no value".

```js
let a;          // undefined (JS did this)
let b = null;   // null (developer did this)

typeof null;       // "object" (famous JS bug)
typeof undefined;  // "undefined"

null == undefined;  // true  (loose)
null === undefined; // false (strict)
```

---

## 2. var, let, const

| Feature | `var` | `let` | `const` |
|---|---|---|---|
| Scope | Function | Block `{}` | Block `{}` |
| Hoisting | Yes (initialized as `undefined`) | Yes (but in **TDZ**) | Yes (but in **TDZ**) |
| Re-declare | Yes | No | No |
| Re-assign | Yes | Yes | No |

```js
// var — function scoped
function test() {
  if (true) {
    var x = 10;
  }
  console.log(x); // 10 (accessible outside if block!)
}

// let — block scoped
function test2() {
  if (true) {
    let y = 10;
  }
  console.log(y); // ReferenceError
}

// const — must initialize, can't reassign
const obj = { name: "azad" };
obj.name = "vijay";  // WORKS (mutating object is allowed)
obj = {};            // ERROR (reassigning reference is not)
```

**Interview Q:** *Why is `const` object mutable?*
> `const` prevents reassigning the **reference**, not mutating the content. The variable always points to the same object, but the object's properties can change. Use `Object.freeze()` for true immutability.

---

## 3. Hoisting

JavaScript moves **declarations** to the top of their scope before execution.

```js
// What you write:
console.log(a); // undefined (not error!)
var a = 5;

// What JS sees:
var a;           // declaration hoisted
console.log(a);  // undefined
a = 5;           // assignment stays
```

```js
// let/const — hoisted but in Temporal Dead Zone (TDZ)
console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 10;
```

```js
// Function declarations are FULLY hoisted
greet(); // "hello" — works!
function greet() {
  console.log("hello");
}

// Function expressions are NOT fully hoisted
sayHi(); // TypeError: sayHi is not a function
var sayHi = function() {
  console.log("hi");
};
```

**Interview Q:** *What is the Temporal Dead Zone?*
> The period between entering a scope and the `let`/`const` declaration being reached. The variable exists but cannot be accessed — accessing it throws a `ReferenceError`.

---

## 4. Scope

```
Global Scope
│
├── Function Scope (var, let, const)
│   │
│   ├── Block Scope { } (let, const only)
│   │
│   └── Block Scope { } (let, const only)
│
└── Function Scope
```

**Scope Chain** — inner functions can access outer variables, but not vice versa:

```js
let a = "global";

function outer() {
  let b = "outer";

  function inner() {
    let c = "inner";
    console.log(a); // "global"  (found in global scope)
    console.log(b); // "outer"   (found in outer scope)
    console.log(c); // "inner"   (found in own scope)
  }

  inner();
  console.log(c); // ReferenceError (can't look inward)
}
```

---

## 5. Closures

A **closure** is a function that remembers variables from its outer scope even after the outer function has returned.

```js
function counter() {
  let count = 0;             // this variable is "closed over"

  return function increment() {
    count++;
    console.log(count);
  };
}

const add = counter();  // counter() finished, but...
add(); // 1  — count is still alive!
add(); // 2
add(); // 3
```

**Real-world uses:**
- Data privacy (module pattern)
- Callbacks & event handlers
- Currying & partial application
- `setTimeout` inside loops

**Classic interview trap:**
```js
// Problem: prints 3, 3, 3
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000);
}

// Fix 1: use let (block scoped — new i each iteration)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000); // 0, 1, 2
}

// Fix 2: use closure (IIFE)
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 1000); // 0, 1, 2
  })(i);
}
```

**Interview Q:** *What is a closure and give a practical example?*
> A closure is when a function retains access to its lexical scope even when executed outside that scope. Used in data hiding, callbacks, and maintaining state without globals.

---

## 6. `this` keyword

`this` depends on **how** the function is called, not where it's defined.

| Context | `this` refers to |
|---|---|
| Global (non-strict) | `window` (browser) / `global` (Node) |
| Global (strict mode) | `undefined` |
| Object method | The object itself |
| Regular function | `window` or `undefined` (strict) |
| Arrow function | Inherits `this` from parent scope |
| `new` keyword | The new object being created |
| `call/apply/bind` | Whatever you pass |
| Event handler | The DOM element |

```js
const user = {
  name: "Azad",

  // regular function — this = user
  greet() {
    console.log(this.name); // "Azad"
  },

  // arrow function — this = parent scope (global)
  greetArrow: () => {
    console.log(this.name); // undefined
  },

  // nested problem & fix
  delayGreet() {
    // Problem: regular function loses `this`
    setTimeout(function() {
      console.log(this.name); // undefined
    }, 100);

    // Fix: arrow function inherits `this`
    setTimeout(() => {
      console.log(this.name); // "Azad"
    }, 100);
  }
};
```

---

## 7. call, apply, bind

All three let you **manually set `this`**.

```js
function introduce(city, age) {
  console.log(`${this.name} from ${city}, age ${age}`);
}

const person = { name: "Azad" };

// call — invokes immediately, args one by one
introduce.call(person, "Kerala", 25);

// apply — invokes immediately, args as array
introduce.apply(person, ["Kerala", 25]);

// bind — returns NEW function, call it later
const boundFn = introduce.bind(person, "Kerala", 25);
boundFn(); // "Azad from Kerala, age 25"
```

**Interview Q:** *Difference between call, apply, and bind?*
> `call` and `apply` invoke immediately (`call` takes individual args, `apply` takes array). `bind` returns a new function with `this` permanently set.

---

## 8. Prototypal Inheritance

Every JS object has a hidden `[[Prototype]]` link to another object.

```js
const animal = {
  eat() {
    console.log("eating");
  }
};

const dog = Object.create(animal); // dog's prototype = animal
dog.bark = function() {
  console.log("woof");
};

dog.bark(); // "woof"  — own property
dog.eat();  // "eating" — found on prototype chain

// Prototype chain:
// dog --> animal --> Object.prototype --> null
```

```js
// Constructor function pattern
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  console.log(`Hi, I'm ${this.name}`);
};

const p = new Person("Azad");
p.greet(); // "Hi, I'm Azad"

// p --> Person.prototype --> Object.prototype --> null
```

**Interview Q:** *What happens when you access a property on an object?*
> JS looks on the object itself first. If not found, it walks up the prototype chain until it finds the property or reaches `null`.

---

## 9. Event Loop

```
   ┌──────────────────────┐
   │      Call Stack       │  ← runs synchronous code
   │  (one thing at a time)│
   └──────────┬───────────┘
              │
   ┌──────────▼───────────┐
   │   Web APIs / Node    │  ← setTimeout, fetch, DOM events
   │   (runs in background)│     handed off here
   └──────────┬───────────┘
              │ when done, callback goes to:
   ┌──────────▼───────────┐
   │  Microtask Queue     │  ← Promises (.then), queueMicrotask
   │  (higher priority)   │     processed FIRST
   ├──────────────────────┤
   │  Macrotask Queue     │  ← setTimeout, setInterval, I/O
   │  (lower priority)    │     processed AFTER microtasks
   └──────────────────────┘

Event Loop: when call stack is empty →
  1. Drain ALL microtasks
  2. Pick ONE macrotask
  3. Repeat
```

**Classic interview question:**
```js
console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

console.log("4");

// Output: 1, 4, 3, 2
// Why: 1 & 4 are sync (call stack)
//      3 is microtask (Promise) — runs before macrotask
//      2 is macrotask (setTimeout) — runs last
```

---

## 10. Callbacks, Promises, Async/Await

**Callback** — function passed to another function
```js
function fetchData(callback) {
  setTimeout(() => {
    callback("data");
  }, 1000);
}
fetchData((result) => console.log(result));
```

Problem: **Callback Hell**
```js
getUser(id, (user) => {
  getOrders(user, (orders) => {
    getDetails(orders[0], (details) => {
      // deeply nested = hard to read
    });
  });
});
```

**Promise** — object representing future value
```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("success");
    // or reject("error");
  }, 1000);
});

promise
  .then((data) => console.log(data))    // "success"
  .catch((err) => console.log(err))
  .finally(() => console.log("done"));

// Promise states: pending → fulfilled OR rejected
```

**Promise utilities:**
```js
// All must succeed
Promise.all([p1, p2, p3]).then(([r1, r2, r3]) => {});

// First to settle (resolve OR reject)
Promise.race([p1, p2]).then((fastest) => {});

// All settled (never rejects)
Promise.allSettled([p1, p2]).then((results) => {});

// First to resolve (ignores rejections)
Promise.any([p1, p2]).then((firstSuccess) => {});
```

**Async/Await** — syntactic sugar over Promises
```js
async function getData() {
  try {
    const user = await fetchUser();      // waits
    const orders = await fetchOrders(user); // waits
    return orders;
  } catch (err) {
    console.log(err);
  }
}
```

**Interview Q:** *Is async/await truly synchronous?*
> No. It looks synchronous but is still non-blocking. `await` pauses only that function and returns control to the event loop. Other code continues running.

---

## 11. Array Methods

```js
const nums = [1, 2, 3, 4, 5];

// map — transform each element, returns NEW array
nums.map(n => n * 2);        // [2, 4, 6, 8, 10]

// filter — keep elements that pass test
nums.filter(n => n > 3);     // [4, 5]

// reduce — accumulate into single value
nums.reduce((acc, n) => acc + n, 0); // 15

// forEach — just loops, returns undefined
nums.forEach(n => console.log(n));

// find — first match
nums.find(n => n > 3);       // 4

// findIndex — index of first match
nums.findIndex(n => n > 3);  // 3

// some — at least one passes?
nums.some(n => n > 4);       // true

// every — all pass?
nums.every(n => n > 0);      // true

// includes
nums.includes(3);            // true

// flat — flatten nested arrays
[1, [2, [3]]].flat(Infinity); // [1, 2, 3]

// splice — mutates original (remove/insert)
nums.splice(1, 2);           // removes 2 items at index 1

// slice — does NOT mutate (returns copy)
nums.slice(1, 3);            // [2, 3]
```

**Interview Q:** *Difference between `map` and `forEach`?*
> `map` returns a new array with transformed values. `forEach` returns `undefined` and is used only for side effects. Use `map` when you need the result.

---

## 12. Destructuring & Spread/Rest

```js
// Object destructuring
const user = { name: "Azad", age: 25, city: "Kerala" };
const { name, age, city: location } = user; // rename with :

// Array destructuring
const [first, , third] = [10, 20, 30]; // skip with comma

// Default values
const { role = "user" } = user;

// Nested destructuring
const { address: { street } } = { address: { street: "MG Road" } };
```

```js
// Spread (...) — expands
const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4];     // [1, 2, 3, 4]

const obj1 = { a: 1 };
const obj2 = { ...obj1, b: 2 };   // { a: 1, b: 2 }

// Rest (...) — collects remaining
function sum(...numbers) {          // rest parameter
  return numbers.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3); // 6

const { name: n, ...rest } = user; // rest = { age: 25, city: "Kerala" }
```

---

## 13. == vs === & Type Coercion

```js
// == (loose) — converts types before comparing
"5" == 5;       // true  (string → number)
0 == false;     // true  (false → 0)
null == undefined; // true  (special rule)
"" == 0;        // true

// === (strict) — no conversion, must match type AND value
"5" === 5;      // false
0 === false;    // false

// Type coercion traps
"5" + 3;        // "53" (number → string, concatenation)
"5" - 3;        // 2    (string → number, subtraction)
true + true;    // 2    (true → 1)
[] + [];        // ""   (both → "")
[] + {};        // "[object Object]"
{} + [];        // 0    (block + [])
```

**Rule:** Always use `===` unless you have a specific reason for `==`.

---

## 14. Shallow Copy vs Deep Copy

```js
const original = { name: "Azad", address: { city: "Kerala" } };

// Shallow copy — only first level is copied
const shallow = { ...original };
shallow.name = "Vijay";         // doesn't affect original
shallow.address.city = "Delhi"; // AFFECTS original! (same reference)

// Deep copy methods
const deep1 = JSON.parse(JSON.stringify(original));  // works but loses functions, dates, undefined
const deep2 = structuredClone(original);              // modern, best approach
```

**Interview Q:** *When does spread operator fail for copying?*
> When the object has nested objects/arrays. Spread only copies one level deep — nested references are shared.

---

## 15. Debouncing & Throttling

```js
// Debounce — wait until user STOPS doing something
// Use: search input, window resize
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const search = debounce((query) => {
  console.log("API call:", query);
}, 500);

// Throttle — execute at most once per interval
// Use: scroll events, button clicks
function throttle(fn, limit) {
  let inThrottle = false;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
```

**Interview Q:** *Debounce vs Throttle?*
> Debounce waits for a pause in activity (fires once after delay). Throttle ensures the function fires at a regular interval (fires at most once per interval). Debounce for search input, throttle for scroll.

---

## 16. Currying & Higher-Order Functions

```js
// Higher-Order Function — takes or returns a function
function withLogging(fn) {
  return function(...args) {
    console.log("Calling with:", args);
    return fn(...args);
  };
}

const add = (a, b) => a + b;
const loggedAdd = withLogging(add);
loggedAdd(2, 3); // "Calling with: [2, 3]" → 5

// Currying — transforms f(a, b, c) into f(a)(b)(c)
function multiply(a) {
  return function(b) {
    return a * b;
  };
}

const double = multiply(2);
double(5);  // 10
double(10); // 20

// Arrow syntax
const multiply2 = a => b => a * b;
```

---

## 17. ES6 Modules

```js
// Named export/import
export const PI = 3.14;
export function add(a, b) { return a + b; }

import { PI, add } from './math.js';
import { add as sum } from './math.js'; // rename

// Default export/import (one per file)
export default function greet() { return "hello"; }

import greet from './greet.js';       // any name works
import whatever from './greet.js';    // this too
```

| Feature | CommonJS (`require`) | ES Modules (`import`) |
|---|---|---|
| Syntax | `require()` / `module.exports` | `import` / `export` |
| Loading | Synchronous | Asynchronous |
| Where | Node.js (default) | Browsers & Node |
| When parsed | Runtime | Compile time (enables tree-shaking) |

---

## 18. Error Handling

```js
try {
  JSON.parse("invalid");
} catch (error) {
  console.log(error.message);  // "Unexpected token i"
  console.log(error.name);     // "SyntaxError"
} finally {
  console.log("always runs");  // cleanup code
}

// Custom error
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

throw new ValidationError("Invalid email", "email");
```

---

## 19. setTimeout, setInterval, requestAnimationFrame

```js
// setTimeout — run once after delay
const id = setTimeout(() => console.log("hello"), 2000);
clearTimeout(id); // cancel

// setInterval — run repeatedly
const id2 = setInterval(() => console.log("tick"), 1000);
clearInterval(id2); // cancel

// requestAnimationFrame — syncs with screen refresh (60fps)
// Used for smooth animations
function animate() {
  // update animation
  requestAnimationFrame(animate); // recursive
}
requestAnimationFrame(animate);
```

**Interview Q:** *Why `setTimeout(fn, 0)` doesn't run immediately?*
> It goes to the macrotask queue and waits for the call stack to be empty. So all synchronous code runs first, then the callback executes.

---

## 20. WeakMap, WeakSet, Symbol, Iterators, Generators

```js
// WeakMap — keys must be objects, garbage collected when no other reference
const wm = new WeakMap();
let obj = {};
wm.set(obj, "data");
obj = null; // entry in WeakMap is garbage collected

// WeakSet — same concept, stores objects weakly
const ws = new WeakSet();

// Symbol — guaranteed unique identifier
const id = Symbol("id");
const user = { [id]: 123, name: "Azad" };
// Symbols don't show in for...in or Object.keys()
```

```js
// Iterator — object with next() method
const range = {
  [Symbol.iterator]() {
    let i = 1;
    return {
      next() {
        return i <= 3 ? { value: i++, done: false } : { done: true };
      }
    };
  }
};
for (const n of range) console.log(n); // 1, 2, 3

// Generator — function that can pause and resume
function* counter() {
  yield 1;
  yield 2;
  yield 3;
}
const gen = counter();
gen.next(); // { value: 1, done: false }
gen.next(); // { value: 2, done: false }
gen.next(); // { value: 3, done: false }
gen.next(); // { value: undefined, done: true }
```

**Interview Q:** *When would you use WeakMap?*
> Storing metadata about DOM elements or objects without preventing garbage collection. Common use: caching computed data tied to object lifetimes.

---

## 21. Template Literals

```js
const name = "Azad";
const age = 25;

// Template literal — backticks with ${expression}
const greeting = `Hello, my name is ${name} and I am ${age} years old.`;

// Multi-line strings (no \n needed)
const html = `
  <div>
    <h1>${name}</h1>
    <p>Age: ${age}</p>
  </div>
`;

// Expressions inside ${}
console.log(`Total: ${10 + 20}`);           // "Total: 30"
console.log(`Status: ${age >= 18 ? "Adult" : "Minor"}`); // "Status: Adult"

// Tagged templates (advanced)
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    return result + str + (values[i] ? `<b>${values[i]}</b>` : "");
  }, "");
}

const msg = highlight`Welcome ${name}, you are ${age}`;
// "Welcome <b>Azad</b>, you are <b>25</b>"
```

**Interview Q:** *What are template literals and how are they different from regular strings?*
> Template literals use backticks and allow embedded expressions with `${}`, multi-line strings without `\n`, and tagged templates for custom processing. Regular strings with quotes don't support any of these.

---

## 22. Optional Chaining (?.)

Safely access deeply nested properties without checking each level.

```js
const user = {
  name: "Azad",
  address: {
    city: "Kerala"
  }
};

// Without optional chaining — verbose and error-prone
const zip = user && user.address && user.address.zip; // undefined

// With optional chaining — clean and safe
const zip2 = user?.address?.zip;    // undefined (no error)
const street = user?.address?.street; // undefined (no error)

// Without optional chaining — would throw error
const bad = user.contact.phone;       // TypeError: Cannot read property 'phone' of undefined

// With optional chaining — safe
const phone = user?.contact?.phone;   // undefined (no crash)

// Works with methods
const result = user?.getName?.();     // undefined if getName doesn't exist

// Works with arrays
const first = user?.orders?.[0];      // undefined if orders doesn't exist

// Works with delete
delete user?.address?.city;
```

**Interview Q:** *What does optional chaining return when it hits a null/undefined?*
> It short-circuits and returns `undefined` immediately without throwing an error. It works with property access (`.`), bracket notation (`[]`), and function calls (`()`).

---

## 23. Nullish Coalescing (??)

Returns the right-hand value only when the left is `null` or `undefined` (not falsy).

```js
// Problem with || (OR operator)
const count = 0;
const result1 = count || 10;    // 10  (0 is falsy, but we WANTED 0!)

const name = "";
const result2 = name || "Guest"; // "Guest" (empty string is falsy, but maybe we wanted "")

// Solution: ?? (nullish coalescing)
const result3 = count ?? 10;    // 0   (0 is NOT null/undefined)
const result4 = name ?? "Guest"; // ""  (empty string is NOT null/undefined)

// ?? only triggers for null and undefined
null ?? "default";      // "default"
undefined ?? "default"; // "default"
0 ?? "default";         // 0
"" ?? "default";        // ""
false ?? "default";     // false

// Combining with optional chaining
const city = user?.address?.city ?? "Unknown";
// If any part is null/undefined → "Unknown"
```

**Falsy vs Nullish:**
| | `\|\|` (OR) | `??` (Nullish) |
|---|---|---|
| Triggers on | All falsy: `0`, `""`, `false`, `null`, `undefined`, `NaN` | Only `null` and `undefined` |
| Use when | You want any fallback | You want to keep `0`, `""`, `false` as valid values |

**Interview Q:** *When would you use `??` instead of `||`?*
> When `0`, `""`, or `false` are valid values that should NOT be replaced by a default. `||` treats all falsy values as "missing", while `??` only treats `null` and `undefined` as "missing".
