# MERN Stack Interview Preparation Plan

---

## Phase 1: Prerequisites (Week 1-2) - [x]

### HTML & CSS
- [x] Semantic HTML tags, forms, tables
- [x] CSS Box Model, Flexbox, Grid
- [x] Positioning (relative, absolute, fixed, sticky)
- [x] Media queries & responsive design
- [x] CSS specificity & cascading

### JavaScript Fundamentals
- [x] Data types, variables (`var`, `let`, `const`)
- [x] Hoisting, scope (block, function, global)
- [x] Closures & lexical environment
- [x] `this` keyword, `call`, `apply`, `bind`
- [x] Prototypal inheritance & prototype chain
- [x] Event loop, call stack, task queue, microtask queue
- [x] Callbacks, Promises, `async/await`
- [x] Array methods (`map`, `filter`, `reduce`, `forEach`, `find`, `some`, `every`)
- [x] Destructuring, spread/rest operators
- [x] Template literals, optional chaining, nullish coalescing
- [x] `typeof`, `==` vs `===`, type coercion
- [x] Shallow copy vs deep copy
- [x] Debouncing & throttling
- [x] Currying & higher-order functions
- [x] ES6+ modules (`import`/`export`)
- [x] Error handling (`try/catch/finally`)
- [x] `setTimeout`, `setInterval`, `requestAnimationFrame`
- [x] WeakMap, WeakSet, Symbol, Iterators, Generators

---

## Phase 2: Node.js (Week 3) - [ ]

- [ ] What is Node.js, V8 engine, libuv
- [ ] Node.js architecture (single-threaded, event-driven, non-blocking I/O)
- [ ] Modules system (`CommonJS` vs `ES Modules`)
- [ ] Core modules (`fs`, `path`, `http`, `os`, `events`, `stream`, `buffer`)
- [ ] `EventEmitter` class
- [ ] Streams (readable, writable, duplex, transform)
- [ ] `process` object, environment variables
- [ ] Error handling in Node
- [ ] `npm` / `yarn` — package.json, versioning, scripts
- [ ] Middleware concept
- [ ] Clustering & worker threads
- [ ] `nodemon`, debugging

---

## Phase 3: Express.js (Week 4) - [ ]

- [ ] What is Express, why use it
- [ ] Routing (params, query, body)
- [ ] Middleware (built-in, custom, third-party, error-handling)
- [ ] `req` and `res` objects in depth
- [ ] RESTful API design principles
- [ ] HTTP methods & status codes
- [ ] Request lifecycle
- [ ] CORS — what & why
- [ ] File uploads (`multer`)
- [ ] Template engines (EJS/Pug — basic awareness)
- [ ] Error handling middleware
- [ ] Rate limiting, helmet, compression
- [ ] MVC architecture pattern
- [ ] Environment config (`dotenv`)

---

## Phase 4: MongoDB & Mongoose (Week 5) - [ ]

- [ ] SQL vs NoSQL, when to use what
- [ ] MongoDB architecture (documents, collections, databases)
- [ ] CRUD operations (shell & driver)
- [ ] Data types in MongoDB (ObjectId, BSON)
- [ ] Mongoose — schema, model, connection
- [ ] Schema types, validation, default values
- [ ] Mongoose queries (`find`, `findOne`, `findById`, `aggregate`)
- [ ] Population (`ref` & `populate`)
- [ ] Indexing (single, compound, text)
- [ ] Aggregation pipeline (`$match`, `$group`, `$lookup`, `$project`, `$unwind`)
- [ ] Transactions
- [ ] Schema design patterns (embedding vs referencing)
- [ ] Pagination (skip/limit, cursor-based)
- [ ] Mongoose middleware (pre/post hooks)
- [ ] Virtuals & instance methods

---

## Phase 5: React.js (Week 6-7) - [ ]

### Core Concepts
- [ ] JSX, Virtual DOM, reconciliation, diffing algorithm
- [ ] Components (functional vs class)
- [ ] Props, state, lifting state up
- [ ] Event handling in React
- [ ] Conditional rendering
- [ ] Lists & keys (why keys matter)
- [ ] Controlled vs uncontrolled components
- [ ] Refs (`useRef`, `createRef`)

### Hooks (deep dive)
- [ ] `useState`, `useEffect`, `useContext`
- [ ] `useReducer`, `useMemo`, `useCallback`
- [ ] `useRef`, `useLayoutEffect`
- [ ] Custom hooks — when & how
- [ ] Rules of hooks

### Advanced React
- [ ] Context API (prop drilling problem)
- [ ] React Router (`v6`) — nested routes, params, navigate, loaders
- [ ] State management (Redux / Redux Toolkit / Zustand — at least one)
- [ ] Higher-Order Components (HOC)
- [ ] Render props pattern
- [ ] Code splitting & lazy loading (`React.lazy`, `Suspense`)
- [ ] Error boundaries
- [ ] React.memo, performance optimization
- [ ] Portals
- [ ] Synthetic events
- [ ] React lifecycle (class-based awareness)
- [ ] SSR vs CSR vs SSG (concept level)

---

## Phase 6: Full Stack Integration (Week 8) - [ ]

- [ ] Connecting React frontend to Express backend (proxy, axios/fetch)
- [ ] Authentication & Authorization
  - [ ] JWT (access token, refresh token)
  - [ ] bcrypt for password hashing
  - [ ] Cookie vs localStorage vs sessionStorage
  - [ ] OAuth concept (Google login etc.)
  - [ ] Role-based access control
- [ ] File upload (frontend to backend to DB/cloud)
- [ ] Image handling (Cloudinary / S3 — concept)
- [ ] Environment variables (frontend vs backend)
- [ ] Deployment basics (Vercel, Render, Railway, AWS EC2)
- [ ] CORS issues & fixes

---

## Phase 7: Must-Know Topics (Week 9) - [ ]

### API & Networking
- [ ] REST vs GraphQL (basics)
- [ ] HTTP/HTTPS, SSL/TLS
- [ ] WebSockets (Socket.io basics)
- [ ] Caching (Redis concept, browser caching)
- [ ] API versioning
- [ ] Pagination strategies

### Security
- [ ] XSS, CSRF, SQL/NoSQL injection
- [ ] Input validation & sanitization
- [ ] Helmet.js, rate limiting
- [ ] HTTPS, HSTS

### DSA (commonly asked)
- [ ] Arrays, Strings, Objects, Linked Lists
- [ ] Stacks, Queues, Hash Maps
- [ ] Sorting (bubble, merge, quick)
- [ ] Searching (binary search)
- [ ] Recursion basics
- [ ] Time & space complexity (Big O)
- [ ] Common patterns: two pointers, sliding window, frequency counter

### System Design (basics)
- [ ] Monolith vs Microservices
- [ ] Load balancing concept
- [ ] Database scaling (horizontal vs vertical)
- [ ] Caching strategies
- [ ] Message queues (concept)

---

## Phase 8: Projects to Discuss (Week 10) - [ ]

Build or review 2-3 projects you can explain in depth:
1. **Auth App** — signup/login with JWT, protected routes
2. **E-commerce / Blog** — CRUD, search, pagination, file upload
3. **Real-time App** — chat app with Socket.io

For each project, be ready to explain:
- [ ] Architecture & folder structure
- [ ] Database schema design decisions
- [ ] Authentication flow
- [ ] Challenges faced & how you solved them
- [ ] What you'd improve

---

## Daily Practice

| Activity | Time |
|---|---|
| Concepts & theory | 2 hrs |
| Coding practice (DSA) | 1 hr |
| Build/review projects | 2 hrs |
| Mock interview questions | 30 min |
