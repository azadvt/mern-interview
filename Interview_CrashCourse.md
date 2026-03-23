# MERN + SQL Interview Crash Course

> Quick-reference for your interview on 2026-03-17. Focus on understanding concepts, not memorizing.

---

## 1. JAVASCRIPT — Top Questions

### Q: var vs let vs const
| Feature | var | let | const |
|---|---|---|---|
| Scope | Function | Block | Block |
| Hoisting | Yes (initialized as `undefined`) | Yes (but TDZ — can't use before declaration) | Yes (but TDZ) |
| Re-declaration | Allowed | Not allowed | Not allowed |
| Re-assignment | Allowed | Allowed | Not allowed |

### Q: What is Hoisting?
JavaScript moves **declarations** (not assignments) to the top of their scope before execution.
```js
console.log(a); // undefined (var is hoisted)
var a = 5;

console.log(b); // ReferenceError (TDZ — Temporal Dead Zone)
let b = 10;

greet(); // works — function declarations are fully hoisted
function greet() { console.log("hi"); }

hello(); // TypeError — only the variable is hoisted, not the assignment
var hello = function() { console.log("hello"); };
```

### Q: Closures
A closure is a function that **remembers variables from its outer scope** even after the outer function has returned.
```js
function counter() {
  let count = 0;
  return {
    increment: () => ++count,
    getCount: () => count
  };
}
const c = counter();
c.increment(); // 1
c.increment(); // 2
c.getCount();  // 2
```
**Use cases**: data privacy, function factories, memoization, module pattern.

### Q: `this` keyword
| Context | `this` refers to |
|---|---|
| Global (non-strict) | `window` (browser) / `global` (Node) |
| Global (strict mode) | `undefined` |
| Object method | The object calling the method |
| Arrow function | Inherits `this` from enclosing scope (lexical) |
| `new` keyword | The newly created object |
| `call/apply/bind` | Explicitly set |

```js
const obj = {
  name: "Alice",
  greet() { console.log(this.name); },          // "Alice"
  greetArrow: () => console.log(this.name)       // undefined (lexical this)
};
```

### Q: call vs apply vs bind
```js
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}
const user = { name: "John" };

greet.call(user, "Hello", "!");    // call — args as comma-separated
greet.apply(user, ["Hello", "!"]); // apply — args as array
const bound = greet.bind(user, "Hello"); // bind — returns new function
bound("!");
```

### Q: Prototypal Inheritance
Every object has a `__proto__` linking to its prototype. When a property isn't found on the object, JS looks up the **prototype chain**.
```js
function Person(name) { this.name = name; }
Person.prototype.greet = function() { return `Hi, I'm ${this.name}`; };

const john = new Person("John");
john.greet(); // "Hi, I'm John" — found on prototype
```

### Q: Event Loop, Call Stack, Queues
```
Call Stack → executes synchronous code
Web APIs → handles async operations (setTimeout, fetch, DOM events)
Callback Queue (Macrotask) → setTimeout, setInterval, I/O
Microtask Queue → Promises (.then), queueMicrotask, MutationObserver

Order: Call Stack → ALL Microtasks → ONE Macrotask → repeat
```
```js
console.log("1");                    // 1 (sync)
setTimeout(() => console.log("2"), 0); // 4 (macrotask)
Promise.resolve().then(() => console.log("3")); // 3 (microtask)
console.log("4");                    // 2 (sync)
// Output: 1, 4, 3, 2
```

### Q: Promises & async/await
```js
// Promise
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("data"), 1000);
  });
}
fetchData().then(data => console.log(data)).catch(err => console.error(err));

// async/await — syntactic sugar over Promises
async function getData() {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```

### Q: == vs ===
- `==` — loose equality, performs **type coercion** (`"5" == 5` → true)
- `===` — strict equality, no coercion (`"5" === 5` → false)
- Always use `===` unless you have a specific reason not to.

### Q: Shallow Copy vs Deep Copy
```js
const original = { a: 1, b: { c: 2 } };

// Shallow — nested objects still share reference
const shallow = { ...original };
shallow.b.c = 99; // original.b.c is also 99!

// Deep — fully independent copy
const deep = structuredClone(original);
deep.b.c = 99; // original.b.c is still 2
```

### Q: Array Methods (must-know)
```js
// map — returns new array with transformed values
[1,2,3].map(x => x * 2);          // [2, 4, 6]

// filter — returns new array with elements passing test
[1,2,3,4].filter(x => x > 2);     // [3, 4]

// reduce — reduces array to single value
[1,2,3].reduce((acc, x) => acc + x, 0); // 6

// find — returns first match
[1,2,3].find(x => x > 1);         // 2

// some / every
[1,2,3].some(x => x > 2);         // true (at least one)
[1,2,3].every(x => x > 0);        // true (all)

// forEach — no return value, just iterates
// flat — flattens nested arrays
// includes — checks if value exists
```

### Q: Destructuring & Spread/Rest
```js
// Object destructuring
const { name, age, role = "user" } = user;

// Array destructuring
const [first, , third] = [1, 2, 3]; // first=1, third=3

// Spread — expands
const merged = { ...obj1, ...obj2 };
const combined = [...arr1, ...arr2];

// Rest — collects remaining
function sum(...nums) { return nums.reduce((a, b) => a + b, 0); }
```

### Q: Currying
Transforming a function with multiple arguments into a sequence of functions with single arguments.
```js
function multiply(a) {
  return function(b) {
    return a * b;
  };
}
const double = multiply(2);
double(5); // 10
```

### Q: Event Delegation
Instead of attaching events to every child, attach one listener to the **parent** and use `event.target` to identify the clicked child.
```js
document.getElementById("list").addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    console.log(e.target.textContent);
  }
});
```
**Benefits**: fewer event listeners, works for dynamically added elements.

---

## 2. NODE.JS — Top Questions

### Q: What is Node.js?
Node.js is a **JavaScript runtime** built on Chrome's **V8 engine**. It uses an **event-driven, non-blocking I/O** model, making it efficient for I/O-heavy applications.

### Q: How does Node.js handle concurrency if it's single-threaded?
- Uses an **event loop** with **non-blocking I/O**
- Heavy I/O tasks (file read, DB query, network) are delegated to **libuv's thread pool** (default 4 threads)
- Callbacks/Promises are pushed to the **callback queue** and processed when the call stack is empty
- CPU-intensive work can use **Worker Threads** or **child_process**

### Q: Event Loop Phases (in order)
1. **Timers** — executes `setTimeout`, `setInterval` callbacks
2. **Pending callbacks** — I/O callbacks deferred to next loop
3. **Idle/Prepare** — internal use
4. **Poll** — retrieves new I/O events, executes I/O callbacks
5. **Check** — `setImmediate()` callbacks
6. **Close callbacks** — e.g., `socket.on('close')`

### Q: CommonJS vs ES Modules
| CommonJS | ES Modules |
|---|---|
| `require()` / `module.exports` | `import` / `export` |
| Synchronous loading | Asynchronous loading |
| Default in Node.js | Need `"type": "module"` in package.json or `.mjs` |
| Dynamic (can require conditionally) | Static (enables tree-shaking) |

### Q: What are Streams?
Streams process data **piece by piece** without loading everything into memory.
- **Readable** — `fs.createReadStream()`, `http.IncomingMessage`
- **Writable** — `fs.createWriteStream()`, `http.ServerResponse`
- **Duplex** — both read & write (TCP socket)
- **Transform** — modify data as it passes through (zlib compression)

```js
const readable = fs.createReadStream('big-file.txt');
readable.pipe(res); // stream directly to HTTP response
```

### Q: Middleware concept
A function that has access to `req`, `res`, and `next()`. It can:
- Execute code
- Modify req/res objects
- End the request-response cycle
- Call `next()` to pass to the next middleware

### Q: Clustering
```js
const cluster = require('cluster');
const os = require('os');

if (cluster.isPrimary) {
  // Fork workers equal to CPU cores
  os.cpus().forEach(() => cluster.fork());
} else {
  // Workers share the same port
  app.listen(3000);
}
```

---

## 3. EXPRESS.JS — Top Questions

### Q: What is Express.js?
Minimal, unopinionated web framework for Node.js. Provides routing, middleware support, and HTTP utilities.

### Q: Types of Middleware
```js
// 1. Application-level
app.use((req, res, next) => { next(); });

// 2. Router-level
router.use((req, res, next) => { next(); });

// 3. Built-in
app.use(express.json());        // parses JSON body
app.use(express.urlencoded({ extended: true })); // form data
app.use(express.static('public'));  // serve static files

// 4. Third-party
app.use(cors());
app.use(helmet());

// 5. Error-handling (4 parameters!)
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
```

### Q: RESTful API Design
| Method | Route | Purpose |
|---|---|---|
| GET | /api/users | Get all users |
| GET | /api/users/:id | Get single user |
| POST | /api/users | Create user |
| PUT | /api/users/:id | Update entire user |
| PATCH | /api/users/:id | Partial update |
| DELETE | /api/users/:id | Delete user |

### Q: HTTP Status Codes (must-know)
- **200** OK, **201** Created, **204** No Content
- **301** Moved Permanently, **304** Not Modified
- **400** Bad Request, **401** Unauthorized, **403** Forbidden, **404** Not Found, **409** Conflict
- **500** Internal Server Error, **502** Bad Gateway, **503** Service Unavailable

### Q: What is CORS?
**Cross-Origin Resource Sharing** — browser security mechanism that blocks requests from a different origin (domain/port/protocol). Fix:
```js
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
```

### Q: req.params vs req.query vs req.body
```js
// GET /users/5?role=admin
req.params  // { id: '5' }       — from URL path /:id
req.query   // { role: 'admin' } — from query string ?key=val
req.body    // { name: 'John' }  — from POST/PUT body (needs parser)
```

---

## 4. MONGODB & MONGOOSE — Top Questions

### Q: SQL vs NoSQL — when to use what?
| SQL (PostgreSQL/MySQL) | NoSQL (MongoDB) |
|---|---|
| Structured, relational data | Flexible, document-based |
| Strong schema enforcement | Schema-less (or flexible schema) |
| Complex joins, transactions | Fast reads, horizontal scaling |
| ACID by default | ACID with transactions (v4.0+) |
| Best for: banking, ERP, e-commerce | Best for: CMS, real-time apps, IoT |

### Q: Embedding vs Referencing
**Embed** when:
- Data is accessed together (1:1, 1:few)
- Data doesn't change often
- Example: address inside user document

**Reference** when:
- Data is shared across documents (many:many)
- Data changes frequently
- Document would exceed 16MB limit
- Example: author reference in blog posts

### Q: Aggregation Pipeline (must-know stages)
```js
db.orders.aggregate([
  { $match: { status: "completed" } },          // filter
  { $group: { _id: "$userId", total: { $sum: "$amount" } } }, // group
  { $sort: { total: -1 } },                     // sort
  { $limit: 10 },                               // limit
  { $lookup: {                                   // join
    from: "users",
    localField: "_id",
    foreignField: "_id",
    as: "userDetails"
  }},
  { $unwind: "$userDetails" },                   // flatten array
  { $project: { name: "$userDetails.name", total: 1 } } // shape output
]);
```

### Q: Mongoose Schema Example
```js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
}, { timestamps: true });

// Middleware (pre-save hook)
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Virtual
userSchema.virtual('postCount').get(function() {
  return this.posts.length;
});

// Instance method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
```

### Q: Indexing
```js
// Single field
userSchema.index({ email: 1 });

// Compound index
userSchema.index({ name: 1, createdAt: -1 });

// Text index (for search)
postSchema.index({ title: 'text', body: 'text' });

// Use explain() to analyze query performance
db.users.find({ email: "test@test.com" }).explain("executionStats");
```

### Q: Populate (joins in Mongoose)
```js
const post = await Post.findById(id)
  .populate('author', 'name email')    // only get name & email
  .populate('comments');
```

---

## 5. REACT.JS — Top Questions

### Q: What is Virtual DOM?
- A lightweight **in-memory** copy of the real DOM
- When state changes → new virtual DOM is created → **diffing** with old virtual DOM → only changed nodes are updated in the real DOM (**reconciliation**)
- This makes React fast by minimizing actual DOM operations

### Q: useState vs useReducer
```js
// useState — simple state
const [count, setCount] = useState(0);

// useReducer — complex state logic, multiple sub-values
const reducer = (state, action) => {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    default: return state;
  }
};
const [state, dispatch] = useReducer(reducer, { count: 0 });
dispatch({ type: 'increment' });
```

### Q: useEffect — lifecycle mapping
```js
useEffect(() => {
  // componentDidMount + componentDidUpdate
  console.log('runs on every render');
});

useEffect(() => {
  // componentDidMount only
  console.log('runs once');
}, []);

useEffect(() => {
  // runs when `dep` changes
  console.log('dep changed');
}, [dep]);

useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer); // componentWillUnmount (cleanup)
}, []);
```

### Q: useMemo vs useCallback
```js
// useMemo — memoize a computed VALUE
const expensiveValue = useMemo(() => computeExpensive(a, b), [a, b]);

// useCallback — memoize a FUNCTION reference
const handleClick = useCallback(() => {
  doSomething(a);
}, [a]);
```
Use when: passing callbacks to child components wrapped in `React.memo`, or expensive computations.

### Q: Context API (avoid prop drilling)
```js
const ThemeContext = createContext('light');

// Provider
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>

// Consumer
const theme = useContext(ThemeContext);
```

### Q: React Router v6
```js
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/users" element={<Users />}>
      <Route path=":id" element={<UserDetail />} />  {/* nested */}
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>

// Navigate programmatically
const navigate = useNavigate();
navigate('/dashboard');

// Get params
const { id } = useParams();

// Get query string
const [searchParams] = useSearchParams();
```

### Q: Keys in lists — why?
Keys help React identify which items changed, were added, or removed. **Never use array index as key** if list can reorder — use unique IDs.

### Q: Controlled vs Uncontrolled Components
- **Controlled**: React state drives the input value (`value={state}` + `onChange`)
- **Uncontrolled**: DOM handles it, use `ref` to access value

### Q: React.memo / Performance
```js
// Prevents re-render if props haven't changed
const MemoChild = React.memo(({ data }) => <div>{data}</div>);

// Lazy loading
const LazyComponent = React.lazy(() => import('./Heavy'));
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
```

### Q: Error Boundaries (class component only)
```js
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError(error) { return { hasError: true }; }
  componentDidCatch(error, info) { logError(error, info); }
  render() {
    if (this.state.hasError) return <h1>Something went wrong</h1>;
    return this.props.children;
  }
}
```

### Q: Redux Toolkit (quick overview)
```js
// slice
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; }, // Immer allows mutation
    addBy: (state, action) => { state.value += action.payload; }
  }
});

// store
const store = configureStore({ reducer: { counter: counterSlice.reducer } });

// component
const count = useSelector(state => state.counter.value);
const dispatch = useDispatch();
dispatch(increment());
```

---

## 6. POSTGRESQL / MySQL — Top Questions

### Q: What is a Relational Database?
Data stored in **tables** (rows & columns) with defined **relationships** (foreign keys). Uses **SQL** for querying. Follows **ACID** properties.

### Q: ACID Properties
- **Atomicity** — transaction is all-or-nothing
- **Consistency** — DB moves from one valid state to another
- **Isolation** — concurrent transactions don't interfere
- **Durability** — committed data survives crashes

### Q: Joins (most asked!)
```sql
-- INNER JOIN: only matching rows from both tables
SELECT u.name, o.total
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- LEFT JOIN: all rows from left table + matching from right
SELECT u.name, o.total
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

-- RIGHT JOIN: all rows from right + matching from left
-- FULL OUTER JOIN: all rows from both tables (PostgreSQL only)
-- CROSS JOIN: cartesian product (every combination)

-- SELF JOIN: table joined with itself
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
```

### Q: Normalization
- **1NF**: No repeating groups, atomic values
- **2NF**: 1NF + no partial dependencies (every non-key column depends on the whole primary key)
- **3NF**: 2NF + no transitive dependencies (non-key columns don't depend on other non-key columns)

**Denormalization**: Intentionally adding redundancy for read performance (common in analytics).

### Q: Primary Key vs Foreign Key vs Unique Key
- **Primary Key**: Uniquely identifies a row, NOT NULL, one per table
- **Foreign Key**: References primary key of another table, enforces referential integrity
- **Unique Key**: Ensures uniqueness, allows one NULL, multiple per table

### Q: Indexes
```sql
-- Speed up queries but slow down writes
CREATE INDEX idx_users_email ON users(email);

-- Composite index
CREATE INDEX idx_name_date ON users(name, created_at);

-- Unique index
CREATE UNIQUE INDEX idx_unique_email ON users(email);
```
**When to use**: Columns in WHERE, JOIN, ORDER BY, frequently queried.
**When NOT to**: Small tables, columns with low cardinality, heavily written tables.

### Q: GROUP BY + Aggregate Functions
```sql
SELECT department, COUNT(*) as emp_count, AVG(salary) as avg_salary
FROM employees
WHERE status = 'active'
GROUP BY department
HAVING AVG(salary) > 50000
ORDER BY avg_salary DESC;
```
**Execution order**: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT

### Q: Subqueries
```sql
-- Subquery in WHERE
SELECT name FROM employees
WHERE department_id IN (
  SELECT id FROM departments WHERE location = 'NYC'
);

-- Correlated subquery
SELECT name, salary FROM employees e
WHERE salary > (
  SELECT AVG(salary) FROM employees WHERE department_id = e.department_id
);
```

### Q: Views
```sql
CREATE VIEW active_users AS
SELECT id, name, email FROM users WHERE status = 'active';

-- Materialized view (PostgreSQL) — stores data physically, needs refresh
CREATE MATERIALIZED VIEW monthly_sales AS
SELECT ... FROM orders GROUP BY month;
REFRESH MATERIALIZED VIEW monthly_sales;
```

### Q: Transactions
```sql
BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
-- If anything fails: ROLLBACK;
```

### Q: PostgreSQL vs MySQL (common differences)
| Feature | PostgreSQL | MySQL |
|---|---|---|
| FULL OUTER JOIN | Yes | No (emulate with UNION) |
| JSONB support | Excellent | JSON (less powerful) |
| CTEs (WITH) | Full support | Supported (8.0+) |
| Materialized Views | Yes | No |
| Default engine | Single engine | InnoDB (default), MyISAM |
| Array data type | Yes | No |
| Enum handling | CREATE TYPE | Column definition |
| Best for | Complex queries, analytics | Simple reads, web apps |

### Q: Window Functions (advanced but impressive)
```sql
-- Rank employees by salary within each department
SELECT name, department, salary,
  RANK() OVER (PARTITION BY department ORDER BY salary DESC) as dept_rank,
  ROW_NUMBER() OVER (ORDER BY salary DESC) as overall_rank
FROM employees;
```

### Q: Common Table Expression (CTE)
```sql
WITH high_earners AS (
  SELECT * FROM employees WHERE salary > 80000
)
SELECT department, COUNT(*)
FROM high_earners
GROUP BY department;
```

### Q: Stored Procedures vs Functions (PostgreSQL)
```sql
-- Function (returns value, can be used in SELECT)
CREATE FUNCTION get_user_count() RETURNS INTEGER AS $$
  SELECT COUNT(*) FROM users;
$$ LANGUAGE SQL;

-- Procedure (performs action, no return)
CREATE PROCEDURE transfer_funds(sender INT, receiver INT, amount DECIMAL) AS $$
BEGIN
  UPDATE accounts SET balance = balance - amount WHERE id = sender;
  UPDATE accounts SET balance = balance + amount WHERE id = receiver;
END;
$$ LANGUAGE plpgsql;
```

---

## 7. AUTHENTICATION — Top Questions

### Q: JWT Flow
```
1. User sends login credentials (email/password)
2. Server verifies → generates JWT (access + refresh token)
3. Access token sent in response (short-lived: 15min)
4. Refresh token stored in httpOnly cookie (long-lived: 7d)
5. Client sends access token in Authorization header: "Bearer <token>"
6. Server verifies token on each request using middleware
7. When access token expires → use refresh token to get new one
```

### Q: JWT Structure
```
header.payload.signature
```
- **Header**: algorithm + token type `{"alg":"HS256","typ":"JWT"}`
- **Payload**: claims (userId, role, exp, iat)
- **Signature**: `HMACSHA256(header + "." + payload, secret)`

### Q: Password Hashing
```js
// NEVER store plain passwords
const salt = await bcrypt.genSalt(10);
const hashed = await bcrypt.hash(password, salt);

// Compare
const isMatch = await bcrypt.compare(candidatePassword, hashed);
```

### Q: Cookie vs localStorage vs sessionStorage
| Feature | Cookie | localStorage | sessionStorage |
|---|---|---|---|
| Size | 4KB | 5-10MB | 5-10MB |
| Sent with requests | Yes (automatic) | No | No |
| Expiry | Set manually | Never | Tab close |
| Accessible by JS | Unless httpOnly | Yes | Yes |
| Best for | Auth tokens | User preferences | Temp data |

**Best practice**: Store refresh token in **httpOnly cookie** (XSS-safe), access token in **memory** (variable).

---

## 8. SECURITY — Quick Hits

- **XSS** (Cross-Site Scripting): Injecting malicious scripts → Sanitize input, escape output, use `httpOnly` cookies
- **CSRF** (Cross-Site Request Forgery): Forged requests from another site → CSRF tokens, SameSite cookies
- **SQL Injection**: `' OR 1=1 --` → Use parameterized queries / ORM
- **NoSQL Injection**: `{ "$gt": "" }` → Validate input types, use Mongoose schemas
- **Helmet.js**: Sets security headers (`X-XSS-Protection`, `Content-Security-Policy`, etc.)
- **Rate Limiting**: Prevent brute force / DDoS → `express-rate-limit`
- **Input Validation**: Use `express-validator` or `Joi`

---

## 9. SYSTEM DESIGN — Quick Concepts

### Monolith vs Microservices
- **Monolith**: Single codebase, easy to start, hard to scale independently
- **Microservices**: Separate services, independently deployable, complex but scalable

### Scaling
- **Vertical**: More CPU/RAM to one server (limited)
- **Horizontal**: Add more servers + load balancer (preferred)

### Caching
- **Browser cache**: Cache-Control headers
- **Application cache**: Redis (in-memory key-value store)
- **CDN**: Cache static assets closer to users

### SSR vs CSR vs SSG
- **CSR** (Client-Side Rendering): React default, JS renders in browser
- **SSR** (Server-Side Rendering): Server renders HTML, sends to client (Next.js)
- **SSG** (Static Site Generation): HTML generated at build time (Gatsby, Next.js)

---

## 10. COMMON CODING QUESTIONS

### Debounce
```js
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

### Throttle
```js
function throttle(fn, limit) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}
```

### Deep Clone
```js
// Simple (no functions, dates, undefined)
JSON.parse(JSON.stringify(obj));

// Proper
structuredClone(obj); // modern browsers + Node 17+
```

### Flatten Array
```js
// Built-in
[1, [2, [3]]].flat(Infinity); // [1, 2, 3]

// Recursive
function flatten(arr) {
  return arr.reduce((acc, val) =>
    Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []);
}
```

### Promise.all vs Promise.allSettled vs Promise.race
```js
// all: resolves when ALL resolve, rejects on FIRST rejection
await Promise.all([p1, p2, p3]);

// allSettled: waits for ALL to finish (resolve or reject)
await Promise.allSettled([p1, p2, p3]);
// [{ status:'fulfilled', value:... }, { status:'rejected', reason:... }]

// race: resolves/rejects with FIRST settled promise
await Promise.race([p1, p2, p3]);
```

---

## 11. BEHAVIORAL / PROJECT QUESTIONS

### "Tell me about yourself"
> I'm a full-stack developer working with the MERN stack. I build end-to-end web applications using React for the frontend, Node.js/Express for the backend, and MongoDB/PostgreSQL for databases. [Mention 1-2 projects briefly]

### "Explain your project architecture"
- Frontend: React + React Router + state management (Redux/Context)
- Backend: Express.js with MVC pattern
- Database: MongoDB with Mongoose (or PostgreSQL with Sequelize/Knex)
- Auth: JWT with bcrypt
- Deployment: [your deployment platform]

### Questions to ask the interviewer
- What does the tech stack look like?
- How does the team handle code reviews?
- What's the onboarding process like?
- What are the biggest challenges the team is currently facing?

---

**Last tip**: If you don't know an answer, say *"I haven't worked with that directly, but here's how I'd approach it..."* — honesty + problem-solving mindset wins.
