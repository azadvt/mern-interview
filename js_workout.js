// ==========================================
// JavaScript Interview Prep — Workout File
// ==========================================
// Run this file: node js_workout.js
// Uncomment each section as you learn!

// ==========================================
// TOPIC 3: HOISTING
// ==========================================

// --- Exercise 1: var hoisting ---
// Predict the output before running!

// console.log(a);
// var a = 5;
// console.log(a);

// --- Exercise 2: let hoisting (TDZ) ---
// What happens here?

// console.log(b);
// let b = 10;

// --- Exercise 3: Function declaration vs expression ---
// Which one works?

// greet();
// function greet() {
//   console.log("Hello from function declaration!");
// }

// sayHi();
// var sayHi = function () {
//   console.log("Hello from function expression!");
// };

// --- Exercise 4: Tricky one ---
// What does this print?

// var x = 1;
// function test() {
//   console.log(x);
//   var x = 2;
//   console.log(x);
// }
// test();

// --- Exercise 5: const hoisting ---
// What happens?

// console.log(PI);
// const PI = 3.14;


// ==========================================
// TOPIC 4: SCOPE
// ==========================================

// --- Exercise 1: Scope chain ---
// Predict ALL 3 outputs

// let color = "red";
// function outer() {
//   let color = "blue";
//   function inner() {
//     console.log(color);  // ?
//   }
//   inner();
//   console.log(color);    // ?
// }
// outer();
// console.log(color);      // ?


// --- Exercise 2: Block scope ---
// Which logs work, which throw errors?

// {
//   var a = 1;
//   let b = 2;
//   const c = 3;
// }
// console.log(a);  // ?
// console.log(b);  // ?
// console.log(c);  // ?


// --- Exercise 3: Loop scoping ---
// What prints?

// for (var i = 0; i < 3; i++) {}
// console.log("var i:", i);     // ?

// for (let j = 0; j < 3; j++) {}
// console.log("let j:", j);     // ?


// --- Exercise 4: Function scope ---
// Does this work?

// function secret() {
//   var password = "1234";
// }
// secret();
// console.log(password);  // ?


// --- Exercise 5: Nested scope chain ---
// Predict the output

// let x = 10;
// function a() {
//   let y = 20;
//   function b() {
//     let z = 30;
//     console.log(x + y + z);  // ?
//   }
//   b();
// }
// a();


// ==========================================
// TOPIC 5: CLOSURES
// ==========================================

// --- Exercise 1: Basic closure ---
// What does this print?

// function counter() {
//   let count = 0;
//   return function () {
//     count++;
//     return count;
//   };
// }
// const increment = counter();
// console.log(increment());  // ?
// console.log(increment());  // ?
// console.log(increment());  // ?


// --- Exercise 2: Separate closures ---
// Are counter1 and counter2 connected?

// function makeCounter() {
//   let count = 0;
//   return {
//     add: () => ++count,
//     get: () => count,
//   };
// }
// const counter1 = makeCounter();
// const counter2 = makeCounter();
// counter1.add();
// counter1.add();
// counter2.add();
// console.log(counter1.get());  // ?
// console.log(counter2.get());  // ?


// --- Exercise 3: The classic var loop trap ---
// What prints after 1 second?

// for (var i = 0; i < 3; i++) {
//   setTimeout(() => console.log("var loop:", i), 1000);
// }

// Now fix it with let:
// for (let i = 0; i < 3; i++) {
//   setTimeout(() => console.log("let loop:", i), 1000);
// }


// --- Exercise 4: Closure with parameter ---
// What does this print?

// function greet(name) {
//   return function (message) {
//     console.log(`${name}: ${message}`);
//   };
// }
// const azadSays = greet("Azad");
// const vijSays = greet("Vijay");
// azadSays("Hello");    // ?
// azadSays("Bye");      // ?
// vijSays("Hey");       // ?


// --- Exercise 5: Tricky - what value is closed over? ---
// Predict carefully!

// function create() {
//   let val = 1;
//   function show() {
//     console.log(val);
//   }
//   val = 2;
//   return show;
// }
// const fn = create();
// fn();  // ?  (is it 1 or 2?)
