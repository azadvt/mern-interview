# Express.js Interview — Complete Deep Dive

> All commonly asked Express.js interview questions with crisp answers.

---

## Q1: What is Express.js?

Minimal, unopinionated web framework for Node.js. Provides:
- Routing
- Middleware support
- HTTP utility methods
- Template engine support

It sits on top of Node's `http` module and simplifies building APIs and web apps.

---

## Q2: Express vs raw Node.js http

| Raw http module | Express |
|---|---|
| Manual URL parsing | `app.get('/users/:id')` |
| Manual body parsing | `express.json()` middleware |
| Manual response headers | `res.json()`, `res.send()` |
| No middleware concept | Built-in middleware chain |
| Verbose, repetitive | Clean, minimal code |

---

## Q3: Basic Express Server

```js
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Start
app.listen(3000, () => console.log('Server running on port 3000'));
```

---

## Q4: Routing

```js
// Basic routes
app.get('/users', getUsers);
app.post('/users', createUser);
app.put('/users/:id', updateUser);
app.patch('/users/:id', patchUser);
app.delete('/users/:id', deleteUser);

// Route parameters
app.get('/users/:id', (req, res) => {
  req.params.id;  // '123'
});

// Multiple params
app.get('/users/:userId/posts/:postId', (req, res) => {
  req.params.userId;
  req.params.postId;
});

// Query strings — /search?q=node&page=2
app.get('/search', (req, res) => {
  req.query.q;     // 'node'
  req.query.page;  // '2'
});

// Route chaining
app.route('/users')
  .get(getUsers)
  .post(createUser);
```

---

## Q5: req.params vs req.query vs req.body

```js
// GET /users/5?role=admin
// Body: { "name": "Alice" }

req.params  // { id: '5' }       — from URL path /:id
req.query   // { role: 'admin' } — from ?key=value
req.body    // { name: 'Alice' } — from POST/PUT body (needs express.json())
```

---

## Q6: Express Router

Modularize routes into separate files.

```js
// routes/users.js
const router = require('express').Router();

router.get('/', (req, res) => res.json(users));
router.get('/:id', (req, res) => res.json(user));
router.post('/', (req, res) => res.status(201).json(newUser));

module.exports = router;

// app.js
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);
// Now: GET /api/users, GET /api/users/:id, POST /api/users
```

---

## Q7: Middleware — Types & Execution

Middleware = function with `(req, res, next)`. Runs in order of `app.use()`.

### 5 Types:

```js
// 1. Application-level
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// 2. Router-level
const router = express.Router();
router.use((req, res, next) => {
  console.log('Router middleware');
  next();
});

// 3. Built-in
app.use(express.json());                        // parse JSON body
app.use(express.urlencoded({ extended: true })); // parse form data
app.use(express.static('public'));               // serve static files

// 4. Third-party
const cors = require('cors');
const helmet = require('helmet');
app.use(cors());
app.use(helmet());

// 5. Error-handling (MUST have 4 parameters)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});
```

---

## Q8: Middleware Execution Flow

```
Request comes in
    ↓
app.use(logger)        → runs, calls next()
    ↓
app.use(express.json()) → parses body, calls next()
    ↓
app.use(auth)          → checks token, calls next()
    ↓
app.get('/users')      → route handler, sends response
    ↓
If error thrown → jumps to error middleware
    ↓
app.use((err, req, res, next) => {})
```

**Key rules:**
- Middleware runs **in order** of app.use()
- Must call `next()` or send response — otherwise request hangs
- Error middleware must have **exactly 4 params** (err, req, res, next)
- If you pass argument to next: `next(err)` → skips to error middleware

---

## Q9: Custom Middleware Examples

```js
// Logger
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

// Auth middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // attach user to request
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Role-based access
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};

// Usage
app.get('/admin', authenticate, authorize('admin'), adminController);
```

---

## Q10: Response Methods

```js
res.send('text');                              // send string
res.json({ name: 'Alice' });                  // send JSON
res.status(201).json({ created: true });       // set status + JSON
res.sendStatus(204);                           // send status only (No Content)
res.redirect('/login');                        // redirect
res.redirect(301, '/new-url');                 // permanent redirect
res.sendFile(path.join(__dirname, 'file.html')); // send file
res.download('file.pdf');                      // trigger download
res.cookie('token', 'abc', { httpOnly: true }); // set cookie
res.clearCookie('token');                      // clear cookie
res.set('X-Custom-Header', 'value');           // set header
res.type('json');                              // set Content-Type
```

---

## Q11: HTTP Status Codes (must-know)

```
2xx — Success
  200 OK
  201 Created
  204 No Content (successful delete)

3xx — Redirection
  301 Moved Permanently
  302 Found (temporary redirect)
  304 Not Modified (cached)

4xx — Client Error
  400 Bad Request (validation failed)
  401 Unauthorized (not authenticated)
  403 Forbidden (authenticated but no permission)
  404 Not Found
  409 Conflict (duplicate resource)
  422 Unprocessable Entity (semantic errors)
  429 Too Many Requests (rate limited)

5xx — Server Error
  500 Internal Server Error
  502 Bad Gateway
  503 Service Unavailable
  504 Gateway Timeout
```

---

## Q12: RESTful API Design

```
GET    /api/users          → get all users
GET    /api/users/:id      → get single user
POST   /api/users          → create user
PUT    /api/users/:id      → replace entire user
PATCH  /api/users/:id      → partial update
DELETE /api/users/:id      → delete user

GET    /api/users/:id/posts → get posts by user (nested resource)
```

**REST principles:**
- Use **nouns** not verbs (`/users` not `/getUsers`)
- Use **plural** names (`/users` not `/user`)
- Use proper **HTTP methods** for actions
- Use proper **status codes** in responses
- **Stateless** — each request contains all info needed
- Support **filtering, pagination, sorting** via query params
  - `GET /api/users?role=admin&page=2&limit=10&sort=-createdAt`

---

## Q13: CORS (Cross-Origin Resource Sharing)

Browser blocks requests from different origin (domain/port/protocol).

```js
// Simple — allow all origins
const cors = require('cors');
app.use(cors());

// Specific origins
app.use(cors({
  origin: ['http://localhost:3000', 'https://myapp.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,           // allow cookies
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Per-route
app.get('/api/public', cors(), (req, res) => {});
```

**How CORS works:**
1. Browser sends **preflight** request (OPTIONS) for non-simple requests
2. Server responds with allowed origins/methods/headers
3. If allowed → browser sends actual request
4. If not → browser blocks it (server never sees the request)

---

## Q14: Error Handling

```js
// 1. Route-level try/catch
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);  // pass to error middleware
  }
});

// 2. Async wrapper (avoid try/catch in every route)
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
}));

// 3. Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Throw: throw new AppError('Not found', 404);

// 4. Global error middleware (ALWAYS last)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});
```

---

## Q15: Request Lifecycle

```
Client sends HTTP request
    ↓
Express receives request
    ↓
Run app-level middleware (in order)
  - express.json()
  - cors()
  - logger
  - auth
    ↓
Match route (method + path)
    ↓
Run route-specific middleware
    ↓
Execute route handler
    ↓
Send response (res.json / res.send)
    ↓
If error → error handling middleware
    ↓
Response sent to client
```

---

## Q16: Serving Static Files

```js
// Serve files from 'public' directory
app.use(express.static('public'));
// /images/logo.png → public/images/logo.png

// With virtual prefix
app.use('/static', express.static('public'));
// /static/images/logo.png → public/images/logo.png

// Multiple directories
app.use(express.static('public'));
app.use(express.static('uploads'));

// Absolute path (recommended)
app.use(express.static(path.join(__dirname, 'public')));
```

---

## Q17: File Uploads with Multer

```js
const multer = require('multer');

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only images allowed'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Single file
app.post('/upload', upload.single('avatar'), (req, res) => {
  res.json({ file: req.file });  // req.file has file info
});

// Multiple files
app.post('/gallery', upload.array('photos', 10), (req, res) => {
  res.json({ files: req.files }); // req.files is array
});
```

---

## Q18: Template Engines (EJS)

```js
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index', { title: 'Home', users: [...] });
});

// views/index.ejs
// <h1><%= title %></h1>
// <% users.forEach(user => { %>
//   <p><%= user.name %></p>
// <% }) %>
```

Not commonly used with React (React handles the frontend). Asked for awareness.

---

## Q19: MVC Pattern

```
Model      → Data logic (Mongoose schema, DB queries)
View       → Response/UI (JSON response or template)
Controller → Business logic (handle request, call model, send response)

project/
├── models/
│   └── User.js          → schema + DB operations
├── controllers/
│   └── userController.js → request handling logic
├── routes/
│   └── userRoutes.js     → route definitions
├── middleware/
│   └── auth.js           → authentication
├── config/
│   └── db.js             → database connection
├── utils/
│   └── AppError.js       → custom error class
├── app.js                → express setup, middleware
└── server.js             → app.listen()
```

```js
// models/User.js
const userSchema = new mongoose.Schema({ name: String, email: String });
module.exports = mongoose.model('User', userSchema);

// controllers/userController.js
const User = require('../models/User');
exports.getUsers = async (req, res, next) => {
  const users = await User.find();
  res.json(users);
};

// routes/userRoutes.js
const router = require('express').Router();
const { getUsers } = require('../controllers/userController');
router.get('/', getUsers);
module.exports = router;

// app.js
app.use('/api/users', require('./routes/userRoutes'));
```

---

## Q20: Security Middleware

```js
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Helmet — sets secure HTTP headers
app.use(helmet());

// Rate limiting — prevent brute force
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // max 100 requests per window
  message: 'Too many requests'
});
app.use('/api', limiter);

// Sanitize against NoSQL injection
app.use(mongoSanitize());
// Prevents: { "email": { "$gt": "" } }

// Sanitize against XSS
app.use(xss());

// Prevent HTTP parameter pollution
app.use(hpp());
```

---

## Q21: Cookie & Session Handling

```js
// Cookies
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Set cookie
res.cookie('token', 'abc123', {
  httpOnly: true,     // can't access via JS (XSS protection)
  secure: true,       // HTTPS only
  sameSite: 'strict', // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

// Read cookie
req.cookies.token;

// Clear cookie
res.clearCookie('token');

// Sessions (server-side)
const session = require('express-session');
app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true, maxAge: 86400000 }
}));

req.session.userId = user.id;  // set
req.session.destroy();          // clear
```

---

## Q22: Input Validation (express-validator)

```js
const { body, validationResult } = require('express-validator');

app.post('/users', [
  body('name').trim().notEmpty().withMessage('Name required'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Min 6 characters'),
  body('age').optional().isInt({ min: 0 }).withMessage('Age must be positive')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // proceed with valid data
});
```

---

## Q23: Pagination

```js
app.get('/api/users', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments()
  ]);

  res.json({
    data: users,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit
    }
  });
});
// GET /api/users?page=2&limit=10
```

---

## Q24: API Versioning

```js
// Method 1: URL prefix (most common)
app.use('/api/v1/users', v1UserRoutes);
app.use('/api/v2/users', v2UserRoutes);

// Method 2: Custom header
app.use('/api/users', (req, res, next) => {
  const version = req.headers['api-version'] || '1';
  if (version === '2') return v2Handler(req, res, next);
  v1Handler(req, res, next);
});
```

---

## Q25: Compression & Performance

```js
const compression = require('compression');
app.use(compression());  // gzip responses

// Other tips:
// - Use caching headers (Cache-Control, ETag)
// - Enable gzip/brotli compression
// - Use pagination for large datasets
// - Use lean() for read-only Mongoose queries
// - Avoid N+1 queries (use populate/join wisely)
// - Use indexes on frequently queried fields
// - Use connection pooling for DB
```

---

## Q26: express.json() vs express.urlencoded()

```js
// express.json() — parses JSON body
// Content-Type: application/json
// Body: {"name": "Alice"}
app.use(express.json());

// express.urlencoded() — parses form data
// Content-Type: application/x-www-form-urlencoded
// Body: name=Alice&age=25
app.use(express.urlencoded({ extended: true }));

// extended: true → uses 'qs' library (nested objects)
// extended: false → uses 'querystring' (flat only)
```

---

## Q27: 404 Handler

```js
// MUST be after all routes
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// Error handler after 404
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({ error: err.message });
});
```

---

## Q28: Environment Configuration

```js
// config.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  dbUri: process.env.DB_URI,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV || 'development'
};

// Usage
const config = require('./config');
app.listen(config.port);

// Different behavior per environment
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));  // logging
}
```

---

## Q29: Proxy Setup (React + Express)

```json
// React package.json — development proxy
{
  "proxy": "http://localhost:5000"
}

// Now React's fetch('/api/users') → proxied to Express at port 5000
```

In production: serve React build from Express:
```js
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});
```

---

## Q30: Testing Express APIs

```js
// Using Jest + Supertest
const request = require('supertest');
const app = require('../app');

describe('GET /api/users', () => {
  it('should return all users', async () => {
    const res = await request(app)
      .get('/api/users')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toBeInstanceOf(Array);
  });

  it('should return 404 for invalid user', async () => {
    await request(app)
      .get('/api/users/invalidid')
      .expect(404);
  });
});
```

---

## Q31: app.use() vs app.get() vs app.all()

```js
// app.use() — matches ALL methods, matches path PREFIX
app.use('/api', middleware);
// Matches: GET /api, POST /api/users, DELETE /api/users/1

// app.get() — matches only GET, matches EXACT path
app.get('/api', handler);
// Matches only: GET /api

// app.all() — matches ALL methods, matches EXACT path
app.all('/api', handler);
// Matches: GET /api, POST /api, etc. (but not /api/users)
```

---

## Q32: Express behind Reverse Proxy (Nginx)

```js
// Trust proxy headers (X-Forwarded-For, X-Forwarded-Proto)
app.set('trust proxy', 1);

// Now req.ip gives real client IP, not proxy IP
// req.protocol gives 'https' even if proxy handles SSL
```

---

## Q33: Graceful Shutdown

```js
const server = app.listen(3000);

const shutdown = () => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('Closed all connections');
      process.exit(0);
    });
  });
  // Force close after 10s
  setTimeout(() => process.exit(1), 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
```

---

## Q34: Common Interview Questions — Quick Fire

**Q: What's the difference between res.send() and res.json()?**
Both send JSON for objects. `res.json()` also converts non-objects (null, undefined) and sets Content-Type. Use `res.json()` for APIs.

**Q: What's the difference between res.end() and res.send()?**
`res.end()` sends no body or raw data. `res.send()` sets headers automatically and supports strings, objects, buffers.

**Q: How to handle 404?**
Add a catch-all middleware AFTER all routes: `app.use((req, res) => res.status(404).json(...))`.

**Q: What's the difference between PUT and PATCH?**
PUT replaces the entire resource. PATCH updates only specified fields.

**Q: How does Express handle errors?**
Pass error to `next(err)` → Express skips all middleware until it finds one with 4 parameters `(err, req, res, next)`.

**Q: Can you have multiple callback functions in a route?**
```js
app.get('/route', middleware1, middleware2, handler);
// or
app.get('/route', [middleware1, middleware2], handler);
```

---

*End of Express.js Deep Dive — 34 Questions*
