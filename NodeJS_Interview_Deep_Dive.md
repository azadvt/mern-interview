# Node.js Interview — Complete Deep Dive

> All commonly asked Node.js interview questions with crisp answers.

---

## Q1: What is Node.js?

Node.js is a **JavaScript runtime** built on Chrome's **V8 engine**. It lets you run JavaScript **outside the browser** — on servers, CLI tools, etc.

Key features:
- **Single-threaded** with event-driven architecture
- **Non-blocking I/O** — doesn't wait for file reads, DB queries, network calls
- Uses **libuv** (C library) under the hood for async I/O and thread pool
- Great for **I/O-heavy** apps (APIs, real-time), not ideal for CPU-heavy tasks

---

## Q2: Why Node.js? When to use / not use?

**Use when:**
- REST APIs, real-time apps (chat, notifications)
- Microservices, streaming applications
- Same language (JS) on frontend + backend

**Don't use when:**
- Heavy CPU tasks (image processing, ML) — blocks the single thread
- Fix: use Worker Threads or offload to separate service

---

## Q3: Node.js Architecture

```
Client Request
    ↓
[Single Thread - Event Loop]
    ↓
Is it blocking (I/O)?
  Yes → Delegate to libuv Thread Pool (default 4 threads)
         → When done, callback pushed to Event Queue
         → Event Loop picks it up
  No  → Execute immediately, return response
```

Key points:
- **Single-threaded** for JS execution
- **libuv thread pool** handles heavy I/O (file system, DNS, crypto)
- **Event loop** coordinates everything
- This is why Node handles thousands of concurrent connections efficiently

---

## Q4: Event Loop Phases (in order)

```
   ┌───────────────────────────┐
┌─>│        timers              │  → setTimeout, setInterval callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks      │  → I/O callbacks deferred from previous cycle
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare        │  → internal use only
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │          poll              │  → retrieve new I/O events, execute I/O callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │          check             │  → setImmediate() callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │      close callbacks       │  → socket.on('close'), etc.
│  └─────────────┬─────────────┘
└─────────────────┘
```

**Between every phase**: process.nextTick() and Promise microtasks run.

---

## Q5: process.nextTick() vs setImmediate()

```js
setImmediate(() => console.log("immediate"));   // check phase
setTimeout(() => console.log("timeout"), 0);     // timers phase
process.nextTick(() => console.log("nextTick")); // before any phase

// Output: nextTick, timeout OR immediate (timer/immediate order varies)
// But nextTick ALWAYS runs first
```

- `process.nextTick()` → runs **before** the next event loop phase (microtask, highest priority)
- `setImmediate()` → runs in **check phase** (after poll)
- `setTimeout(fn, 0)` → runs in **timers phase**

**Rule**: nextTick > microtasks (Promises) > macrotasks (setTimeout/setImmediate)

---

## Q6: CommonJS vs ES Modules

| Feature | CommonJS | ES Modules |
|---|---|---|
| Syntax | `require()` / `module.exports` | `import` / `export` |
| Loading | Synchronous | Asynchronous |
| When parsed | Runtime (dynamic) | Compile time (static) |
| Tree shaking | No | Yes |
| Top-level await | No | Yes |
| File extension | `.js` (default) | `.mjs` or `"type": "module"` in package.json |
| `this` at top level | `module.exports` | `undefined` |

```js
// CommonJS
const fs = require('fs');
module.exports = { myFunc };
module.exports.myFunc = () => {};

// ES Modules
import fs from 'fs';
export const myFunc = () => {};
export default myFunc;
```

---

## Q7: Core Modules

### fs (File System)
```js
const fs = require('fs');

// Async (non-blocking) — preferred
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// Sync (blocking) — avoid in production
const data = fs.readFileSync('file.txt', 'utf8');

// Promises API (modern)
const fsPromises = require('fs').promises;
const data2 = await fsPromises.readFile('file.txt', 'utf8');

// Other operations
fs.writeFile('out.txt', 'content', callback);
fs.appendFile('log.txt', 'new line\n', callback);
fs.unlink('file.txt', callback);        // delete
fs.rename('old.txt', 'new.txt', callback);
fs.mkdir('dir', { recursive: true }, callback);
fs.readdir('./', callback);             // list directory
fs.stat('file.txt', callback);          // file info
```

### path
```js
const path = require('path');

path.join('/users', 'alice', 'docs');      // /users/alice/docs
path.resolve('src', 'index.js');           // absolute path
path.basename('/home/user/file.txt');      // file.txt
path.extname('file.txt');                  // .txt
path.dirname('/home/user/file.txt');       // /home/user
path.parse('/home/user/file.txt');
// { root: '/', dir: '/home/user', base: 'file.txt', ext: '.txt', name: 'file' }
```

### http
```js
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Hello' }));
});

server.listen(3000, () => console.log('Server on port 3000'));
```

### os
```js
const os = require('os');
os.cpus();          // CPU info (useful for clustering)
os.totalmem();      // total RAM
os.freemem();       // free RAM
os.platform();      // 'linux', 'darwin', 'win32'
os.homedir();       // home directory
```

---

## Q8: EventEmitter

The foundation of Node's event-driven architecture. Many core modules inherit from it.

```js
const EventEmitter = require('events');

class OrderService extends EventEmitter {
  placeOrder(order) {
    // process order...
    this.emit('orderPlaced', order);    // fire event
  }
}

const service = new OrderService();

// Listen for event
service.on('orderPlaced', (order) => {
  console.log('Send email for:', order.id);
});

service.once('orderPlaced', (order) => {
  console.log('This runs only once');
});

service.placeOrder({ id: 1, item: 'Book' });

// Remove listener
service.off('orderPlaced', handlerFn);
service.removeAllListeners('orderPlaced');

// Get listener count
service.listenerCount('orderPlaced');
```

**Key**: `http.Server`, `fs.ReadStream`, `process` — all extend EventEmitter.

---

## Q9: Streams

Process data **piece by piece** — no need to load entire file into memory.

4 types:
- **Readable** — source of data (fs.createReadStream, http request)
- **Writable** — destination (fs.createWriteStream, http response)
- **Duplex** — both read & write (TCP socket)
- **Transform** — modify data as it passes through (zlib, crypto)

```js
const fs = require('fs');

// Read large file without loading into memory
const readable = fs.createReadStream('bigfile.csv', { encoding: 'utf8' });
const writable = fs.createWriteStream('output.csv');

// Pipe — connect streams (handles backpressure automatically)
readable.pipe(writable);

// Events on readable
readable.on('data', (chunk) => console.log('Received:', chunk.length));
readable.on('end', () => console.log('Done reading'));
readable.on('error', (err) => console.error(err));

// Transform stream example
const { Transform } = require('stream');
const uppercase = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  }
});

readable.pipe(uppercase).pipe(writable);
```

**Why streams?** A 2GB file with `fs.readFile` → loads 2GB into RAM. With streams → processes in ~64KB chunks.

---

## Q10: Buffer

Raw binary data. Used when dealing with files, network, or streams.

```js
// Create
const buf1 = Buffer.from('Hello');
const buf2 = Buffer.alloc(10);           // 10 zero-filled bytes
const buf3 = Buffer.from([72, 101, 108]); // from bytes

// Convert
buf1.toString();              // 'Hello'
buf1.toString('base64');      // 'SGVsbG8='
buf1.toJSON();                // { type: 'Buffer', data: [72, 101, ...] }

// Properties
buf1.length;                  // 5 (bytes, not characters)

// Compare
buf1.equals(Buffer.from('Hello')); // true
```

---

## Q11: process Object

Global object with info about the current Node process.

```js
process.env.NODE_ENV          // environment variables
process.argv                  // command line arguments
process.cwd()                 // current working directory
process.pid                   // process ID
process.exit(0)               // exit (0 = success, 1 = error)
process.memoryUsage()         // heap used, RSS, etc.
process.uptime()              // seconds since process started

// Handle uncaught errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise:', reason);
});

// stdin/stdout
process.stdout.write('Hello\n');  // like console.log
process.stdin.on('data', (data) => console.log(data.toString()));
```

---

## Q12: Environment Variables

```js
// Access
process.env.PORT          // reads PORT from environment
process.env.NODE_ENV      // 'development', 'production', 'test'

// Set (terminal)
// PORT=3000 node app.js
// NODE_ENV=production node app.js

// Using dotenv package
require('dotenv').config();   // loads .env file
// .env file:
// PORT=3000
// DB_URL=mongodb://localhost:27017/mydb
// JWT_SECRET=mysecretkey

// NEVER commit .env to git — add to .gitignore
```

---

## Q13: Error Handling in Node

```js
// 1. Synchronous — try/catch
try {
  const data = fs.readFileSync('missing.txt');
} catch (err) {
  console.error(err.message);
}

// 2. Async callbacks — error-first pattern
fs.readFile('file.txt', (err, data) => {
  if (err) return console.error(err);  // always check err first
  console.log(data);
});

// 3. Promises — .catch()
fsPromises.readFile('file.txt')
  .then(data => console.log(data))
  .catch(err => console.error(err));

// 4. async/await — try/catch
async function read() {
  try {
    const data = await fsPromises.readFile('file.txt');
  } catch (err) {
    console.error(err);
  }
}

// 5. Global handlers (last resort, for logging before crash)
process.on('uncaughtException', (err) => {
  console.error('Uncaught:', err);
  process.exit(1);  // should still exit
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled:', reason);
});
```

---

## Q14: Middleware Concept

A function in the request-response pipeline. Gets `req`, `res`, `next`.

```js
// Flow:
// Request → middleware1 → middleware2 → route handler → Response

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();  // MUST call next() to pass to next middleware
};

const auth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Unauthorized' });
    // no next() — ends the cycle
  }
  next();
};

app.use(logger);     // runs on ALL routes
app.use('/api', auth); // runs only on /api routes
```

---

## Q15: npm & package.json

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

**Version symbols:**
- `^4.18.0` → allows minor + patch updates (4.x.x)
- `~4.18.0` → allows only patch updates (4.18.x)
- `4.18.0` → exact version only

**Commands:**
```bash
npm init -y                    # create package.json
npm install express            # add to dependencies
npm install -D nodemon         # add to devDependencies
npm install                    # install all from package.json
npm run dev                    # run script
npm list                       # see installed packages
```

**package-lock.json** — locks exact versions of all dependencies. Always commit it.

---

## Q16: Clustering

Node is single-threaded. Clustering creates **multiple processes** (workers) sharing the same port.

```js
const cluster = require('cluster');
const os = require('os');
const express = require('express');

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`Primary ${process.pid} forking ${numCPUs} workers`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died, restarting...`);
    cluster.fork();  // auto-restart
  });
} else {
  const app = express();
  app.get('/', (req, res) => res.send(`Worker ${process.pid}`));
  app.listen(3000);
}
```

**In production**: Use **PM2** instead of manual clustering.
```bash
pm2 start app.js -i max    # auto-cluster across all CPUs
```

---

## Q17: Worker Threads

For **CPU-intensive** tasks. Unlike clustering (separate processes), workers share memory.

```js
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  worker.on('message', (result) => console.log('Result:', result));
  worker.postMessage(1000000);
} else {
  parentPort.on('message', (n) => {
    // Heavy CPU work
    let sum = 0;
    for (let i = 0; i < n; i++) sum += i;
    parentPort.postMessage(sum);
  });
}
```

**Cluster vs Worker Threads:**
| Cluster | Worker Threads |
|---|---|
| Separate processes | Same process, separate threads |
| No shared memory | Can share memory (SharedArrayBuffer) |
| For scaling HTTP servers | For CPU-heavy computation |

---

## Q18: child_process

Spawn external processes or commands from Node.

```js
const { exec, spawn, fork } = require('child_process');

// exec — runs shell command, buffers output
exec('ls -la', (err, stdout, stderr) => {
  console.log(stdout);
});

// spawn — streams output (better for large output)
const child = spawn('ls', ['-la']);
child.stdout.on('data', (data) => console.log(data.toString()));

// fork — spawns a new Node.js process (has IPC channel)
const child2 = fork('./worker.js');
child2.send({ task: 'heavy' });
child2.on('message', (result) => console.log(result));
```

| Method | Use case |
|---|---|
| `exec` | Short commands, small output |
| `spawn` | Long-running, large output (streaming) |
| `fork` | New Node process with messaging (IPC) |

---

## Q19: Global Objects in Node

```js
// Available globally (no require needed)
__dirname      // directory of current file
__filename     // full path of current file
process        // current process info
console        // logging
setTimeout / setInterval / setImmediate
Buffer         // binary data
require()      // load modules (CommonJS)

// NOT global in Node (unlike browser)
// window, document, alert — don't exist in Node
```

**Note**: In ES modules, `__dirname` and `__filename` don't exist. Use:
```js
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

---

## Q20: REST API with Node (no Express)

```js
const http = require('http');

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === 'GET' && url === '/api/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify([{ id: 1, name: 'Alice' }]));
  }
  else if (method === 'POST' && url === '/api/users') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const user = JSON.parse(body);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    });
  }
  else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(3000);
```

This is why Express exists — to simplify this boilerplate.

---

## Q21: Blocking vs Non-Blocking

```js
// BLOCKING — entire server waits
const data = fs.readFileSync('big.txt');  // nothing else runs until done
console.log(data);

// NON-BLOCKING — server keeps handling other requests
fs.readFile('big.txt', (err, data) => {
  console.log(data);  // runs when file is ready
});
console.log('I run immediately, no waiting!');
```

**Rule**: Never use sync methods (`readFileSync`, `writeFileSync`) in a server. They block the entire event loop.

---

## Q22: Callback Pattern (Error-First)

Node's convention: first argument is always the error.

```js
function fetchData(id, callback) {
  if (!id) return callback(new Error('ID required'), null);
  // simulate async
  setTimeout(() => callback(null, { id, name: 'Alice' }), 100);
}

fetchData(1, (err, data) => {
  if (err) return console.error(err.message);
  console.log(data);
});
```

---

## Q23: Util Module — promisify

Convert callback-based functions to Promises.

```js
const util = require('util');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);

// Now use with async/await
async function read() {
  const data = await readFile('file.txt', 'utf8');
  console.log(data);
}
```

---

## Q24: crypto Module

```js
const crypto = require('crypto');

// Hash (one-way, for checksums/verification)
const hash = crypto.createHash('sha256').update('password').digest('hex');

// HMAC (hash with secret key)
const hmac = crypto.createHmac('sha256', 'secret').update('data').digest('hex');

// Random bytes (for tokens, salts)
const token = crypto.randomBytes(32).toString('hex');

// UUID
const { randomUUID } = require('crypto');
randomUUID(); // '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
```

---

## Q25: How require() Works (Module Resolution)

```
require('express')
  1. Is it a core module (fs, path, http)? → Use it
  2. Does it start with './' or '/'? → Load as file/directory
  3. Look in node_modules/ (current dir → parent → parent → ... → root)
  4. Check package.json "main" field
  5. Try index.js

Modules are CACHED after first load:
require('./db') → loads and caches
require('./db') → returns cached version (singleton behavior)
```

---

## Q26: Security Best Practices

- **Never trust user input** — validate and sanitize
- Use **helmet** for secure HTTP headers
- Use **rate limiting** to prevent brute force
- **Never expose stack traces** in production (`NODE_ENV=production`)
- Use **parameterized queries** (prevent injection)
- Store secrets in **environment variables**, not code
- Keep dependencies **updated** (`npm audit`)
- Use **HTTPS** in production
- Set **httpOnly, secure, sameSite** flags on cookies

---

## Q27: Debugging Node.js

```bash
# Built-in debugger
node --inspect app.js          # opens debugger on port 9229
node --inspect-brk app.js     # breaks on first line

# Connect via Chrome: chrome://inspect
# Or use VS Code debugger

# nodemon for auto-restart during development
npx nodemon app.js

# Simple logging
console.log()
console.error()
console.time('label') / console.timeEnd('label')  # measure time
console.trace()  # print stack trace
```

---

## Q28: Memory Leaks in Node

Common causes:
1. **Global variables** — never garbage collected
2. **Closures** holding references unnecessarily
3. **Event listeners** not removed (`removeListener` / `off`)
4. **Caching without limits** — unbounded in-memory cache
5. **Timers** not cleared (`clearInterval`)

Detect:
```js
process.memoryUsage();
// { rss, heapTotal, heapUsed, external }
// If heapUsed keeps growing → leak
```

---

## Q29: libuv & Thread Pool

- **libuv** is a C library that provides async I/O for Node
- Has a **thread pool** (default 4 threads)
- Used for: file system ops, DNS lookup, crypto, zlib compression
- Network I/O (TCP, HTTP) uses **OS kernel** async mechanisms, NOT the thread pool
- Increase pool: `process.env.UV_THREADPOOL_SIZE = 8`

---

## Q30: REPL

Read-Eval-Print Loop. Interactive Node shell.

```bash
$ node
> 2 + 3
5
> const x = [1,2,3]
> x.map(n => n * 2)
[2, 4, 6]
> .exit
```

Commands: `.help`, `.exit`, `.clear`, `.save filename`, `.load filename`

---

## Q31: Timers in Node

```js
// setTimeout — run once after delay
const t1 = setTimeout(() => console.log('after 1s'), 1000);
clearTimeout(t1);

// setInterval — run repeatedly
const t2 = setInterval(() => console.log('every 2s'), 2000);
clearInterval(t2);

// setImmediate — run after current poll phase
setImmediate(() => console.log('immediate'));

// process.nextTick — run before next event loop phase
process.nextTick(() => console.log('nextTick'));

// Order: nextTick > Promise.then > setTimeout(0) ≈ setImmediate
```

---

## Q32: Handling Large Files

```js
// BAD — loads entire file into memory
const data = fs.readFileSync('2GB-file.csv');

// GOOD — streams process chunk by chunk
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('2GB-file.csv'),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  // process one line at a time
});
rl.on('close', () => console.log('Done'));
```

---

## Q33: Graceful Shutdown

```js
const server = app.listen(3000);

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    // close DB connections
    mongoose.connection.close();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  // same for Ctrl+C
  server.close(() => process.exit(0));
});
```

---

## Q34: Event-Driven Architecture

```
Traditional (thread-per-request):
  Request 1 → Thread 1 (waiting for DB...)
  Request 2 → Thread 2 (waiting for file...)
  Request 3 → Thread 3 (waiting for API...)
  Request 4 → NO THREAD AVAILABLE! (blocked)

Node.js (event-driven):
  Request 1 → Register callback, move on
  Request 2 → Register callback, move on
  Request 3 → Register callback, move on
  Request 4 → Register callback, move on
  DB result ready → Execute callback 1
  File ready → Execute callback 2
  ...
```

This is why Node handles 10,000+ concurrent connections with one thread.

---

## Q35: Common Interview Tricky Output Questions

```js
// Q: What's the output?
console.log('start');
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('promise'));
console.log('end');

// Answer:
// start
// end
// nextTick
// promise
// timeout (or immediate — these two can swap)
// immediate (or timeout)
```

```js
// Q: Will this crash?
const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('error', (err) => console.log('Caught:', err.message));
emitter.emit('error', new Error('oops'));
// Answer: No — error is caught by the listener
// Without the listener → CRASHES (unhandled 'error' event)
```

---

*End of Node.js Deep Dive — 35 Questions*
