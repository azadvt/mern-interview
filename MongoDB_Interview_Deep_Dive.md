# MongoDB & Mongoose Interview — Complete Deep Dive

> All commonly asked MongoDB & Mongoose interview questions with crisp answers.

---

## Q1: What is MongoDB?

A **NoSQL, document-oriented** database. Stores data as **BSON** (Binary JSON) documents in **collections** (like tables). Schema-flexible — documents in the same collection can have different structures.

```
RDBMS          →  MongoDB
Database       →  Database
Table          →  Collection
Row            →  Document
Column         →  Field
Primary Key    →  _id (auto-generated ObjectId)
JOIN           →  $lookup / populate
```

---

## Q2: SQL vs NoSQL — When to use what?

| SQL (PostgreSQL/MySQL) | NoSQL (MongoDB) |
|---|---|
| Structured, relational data | Flexible, semi-structured data |
| Fixed schema | Dynamic schema |
| Complex joins & transactions | Fast reads, horizontal scaling |
| ACID by default | ACID with transactions (v4.0+) |
| Vertical scaling (scale up) | Horizontal scaling (sharding) |
| Banking, ERP, e-commerce | CMS, real-time apps, IoT, catalogs |

**Rule of thumb**: If your data has many relationships and needs strict consistency → SQL. If data is nested/hierarchical and needs flexibility → MongoDB.

---

## Q3: BSON & Data Types

BSON = Binary JSON. Supports more types than JSON.

```
String          "hello"
Number          42 (int32, int64, double, decimal128)
Boolean         true / false
ObjectId        ObjectId("507f1f77bcf86cd799439011")  — 12-byte unique ID
Date            ISODate("2026-03-17T00:00:00Z")
Array           [1, 2, 3]
Object          { nested: "doc" }
Null            null
Binary          BinData(...)
Regex           /pattern/
```

**ObjectId** (12 bytes): 4 bytes timestamp + 5 bytes random + 3 bytes counter. Sortable by creation time.

---

## Q4: CRUD Operations

```js
// CREATE
db.users.insertOne({ name: "Alice", age: 25 });
db.users.insertMany([{ name: "Bob" }, { name: "Carol" }]);

// READ
db.users.find();                           // all documents
db.users.find({ age: { $gt: 20 } });      // with filter
db.users.findOne({ name: "Alice" });       // first match
db.users.find({}, { name: 1, _id: 0 });   // projection (include name, exclude _id)

// UPDATE
db.users.updateOne(
  { name: "Alice" },                       // filter
  { $set: { age: 26 } }                   // update
);
db.users.updateMany(
  { age: { $lt: 18 } },
  { $set: { status: "minor" } }
);
db.users.replaceOne(
  { name: "Alice" },
  { name: "Alice", age: 26, city: "NYC" } // replaces entire document
);

// DELETE
db.users.deleteOne({ name: "Alice" });
db.users.deleteMany({ status: "inactive" });
```

---

## Q5: Query Operators

```js
// Comparison
$eq    // equal         { age: { $eq: 25 } }  or  { age: 25 }
$ne    // not equal     { status: { $ne: "inactive" } }
$gt    // greater than  { age: { $gt: 18 } }
$gte   // greater or eq
$lt    // less than
$lte   // less or eq
$in    // in array      { role: { $in: ["admin", "editor"] } }
$nin   // not in array

// Logical
$and   // all conditions   { $and: [{ age: { $gt: 18 } }, { status: "active" }] }
$or    // any condition    { $or: [{ role: "admin" }, { role: "editor" }] }
$not   // negate           { age: { $not: { $gt: 30 } } }
$nor   // none match

// Element
$exists   // field exists     { phone: { $exists: true } }
$type     // field type       { age: { $type: "number" } }

// Array
$all         // array contains all     { tags: { $all: ["js", "node"] } }
$elemMatch   // element matches all conditions
$size        // array length           { tags: { $size: 3 } }

// Regex
{ name: { $regex: /^ali/i } }   // starts with "ali", case-insensitive
```

---

## Q6: Update Operators

```js
$set       // set field value         { $set: { name: "Alice" } }
$unset     // remove field            { $unset: { tempField: "" } }
$inc       // increment               { $inc: { age: 1, score: -5 } }
$mul       // multiply                { $mul: { price: 1.1 } }
$rename    // rename field            { $rename: { "fname": "firstName" } }
$min       // set if less than current
$max       // set if greater than current

// Array operators
$push      // add to array            { $push: { tags: "new" } }
$pull      // remove from array       { $pull: { tags: "old" } }
$addToSet  // add only if not exists  { $addToSet: { tags: "unique" } }
$pop       // remove first (-1) or last (1)  { $pop: { tags: 1 } }
$each      // with $push/$addToSet    { $push: { tags: { $each: ["a","b"] } } }
```

---

## Q7: Embedding vs Referencing

### Embedding (denormalized)
```js
// User with embedded address
{
  name: "Alice",
  address: {
    street: "123 Main",
    city: "NYC",
    zip: "10001"
  }
}
```
**When**: 1:1 or 1:few, data accessed together, data doesn't change often.
**Pros**: Single query, no joins, fast reads.
**Cons**: Document size limit (16MB), duplication.

### Referencing (normalized)
```js
// Post references author
{
  title: "My Post",
  author: ObjectId("507f1f77bcf86cd799439011")  // reference to User
}
```
**When**: 1:many, many:many, data shared across documents, data changes often.
**Pros**: No duplication, smaller documents.
**Cons**: Needs multiple queries or $lookup.

### Relationship Patterns
```js
// One-to-One → embed
{ name: "Alice", profile: { bio: "...", avatar: "..." } }

// One-to-Few → embed array
{ name: "Alice", addresses: [{ city: "NYC" }, { city: "LA" }] }

// One-to-Many → reference (array of IDs in parent OR parentId in child)
// Parent: { name: "Alice", postIds: [id1, id2] }
// OR Child: { title: "Post", authorId: ObjectId("...") }  ← preferred

// Many-to-Many → reference (array of IDs on both sides)
// Student: { enrolledCourses: [courseId1, courseId2] }
// Course: { students: [studentId1, studentId2] }
```

---

## Q8: Indexing

Indexes speed up queries by avoiding full collection scans.

```js
// Create index
db.users.createIndex({ email: 1 });          // ascending
db.users.createIndex({ createdAt: -1 });     // descending

// Compound index
db.users.createIndex({ name: 1, age: -1 });

// Unique index
db.users.createIndex({ email: 1 }, { unique: true });

// Text index (full-text search)
db.posts.createIndex({ title: "text", body: "text" });
db.posts.find({ $text: { $search: "mongodb tutorial" } });

// TTL index (auto-delete after time)
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });

// Partial index (index subset of documents)
db.users.createIndex(
  { email: 1 },
  { partialFilterExpression: { status: "active" } }
);

// Multikey index (on array fields — automatic)
db.posts.createIndex({ tags: 1 });

// List indexes
db.users.getIndexes();

// Drop index
db.users.dropIndex("email_1");
```

### explain() — Query Analysis
```js
db.users.find({ email: "alice@test.com" }).explain("executionStats");
// Look for:
// - "COLLSCAN" = bad (full collection scan)
// - "IXSCAN" = good (using index)
// - executionTimeMillis
// - totalDocsExamined vs totalKeysExamined
```

**Index rules:**
- Index fields used in `find()`, `sort()`, `$match`, `$lookup`
- Compound index order matters (follows **ESR rule**: Equality → Sort → Range)
- Too many indexes slow down writes
- `_id` is automatically indexed

---

## Q9: Aggregation Pipeline

Process documents through stages — each stage transforms the data.

```js
db.orders.aggregate([
  // Stage 1: Filter
  { $match: { status: "completed" } },

  // Stage 2: Group & calculate
  { $group: {
    _id: "$customerId",
    totalSpent: { $sum: "$amount" },
    orderCount: { $count: {} },
    avgOrder: { $avg: "$amount" },
    maxOrder: { $max: "$amount" }
  }},

  // Stage 3: Sort
  { $sort: { totalSpent: -1 } },

  // Stage 4: Limit
  { $limit: 10 },

  // Stage 5: Reshape output
  { $project: {
    _id: 0,
    customerId: "$_id",
    totalSpent: 1,
    orderCount: 1,
    avgOrder: { $round: ["$avgOrder", 2] }
  }}
]);
```

---

## Q10: Aggregation Stages (all important ones)

```js
// $match — filter (like find, use early to reduce data)
{ $match: { age: { $gte: 18 } } }

// $group — group by field, calculate aggregates
{ $group: { _id: "$department", count: { $sum: 1 } } }

// $project — include/exclude/reshape fields
{ $project: { name: 1, fullName: { $concat: ["$first", " ", "$last"] } } }

// $sort — sort documents
{ $sort: { createdAt: -1 } }  // -1 = descending

// $limit & $skip — pagination
{ $skip: 20 }, { $limit: 10 }

// $unwind — deconstruct array (one doc per array element)
// Input: { name: "Alice", tags: ["js", "node"] }
{ $unwind: "$tags" }
// Output: { name: "Alice", tags: "js" }, { name: "Alice", tags: "node" }

// $lookup — join with another collection
{ $lookup: {
  from: "users",           // target collection
  localField: "userId",    // field in current docs
  foreignField: "_id",     // field in target collection
  as: "userDetails"        // output array field
}}

// $addFields — add new fields
{ $addFields: { totalPrice: { $multiply: ["$price", "$quantity"] } } }

// $facet — multiple pipelines in parallel
{ $facet: {
  stats: [{ $group: { _id: null, total: { $sum: 1 } } }],
  data: [{ $skip: 0 }, { $limit: 10 }]
}}

// $bucket — group into ranges
{ $bucket: {
  groupBy: "$age",
  boundaries: [0, 18, 30, 50, 100],
  default: "Other",
  output: { count: { $sum: 1 } }
}}

// $out — write results to new collection
{ $out: "aggregated_results" }

// $merge — write results to existing collection
{ $merge: { into: "monthly_stats" } }
```

---

## Q11: Transactions

Multi-document ACID transactions (MongoDB 4.0+).

```js
const session = await mongoose.startSession();
session.startTransaction();

try {
  await Account.updateOne(
    { _id: senderId },
    { $inc: { balance: -amount } },
    { session }
  );
  await Account.updateOne(
    { _id: receiverId },
    { $inc: { balance: amount } },
    { session }
  );

  await session.commitTransaction();
} catch (err) {
  await session.abortTransaction();
  throw err;
} finally {
  session.endSession();
}
```

**When to use**: Operations that must succeed or fail together (bank transfers, order + inventory update).

---

## Q12: Schema Validation ($jsonSchema)

```js
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email"],
      properties: {
        name: { bsonType: "string", description: "must be string" },
        email: { bsonType: "string", pattern: "^.+@.+$" },
        age: { bsonType: "int", minimum: 0, maximum: 150 }
      }
    }
  }
});
```

---

## Q13: Pagination Strategies

```js
// 1. Skip/Limit (simple but slow for large offsets)
db.users.find().skip(100).limit(10);
// Problem: skip(100000) still scans 100000 docs

// 2. Cursor-based (efficient — use for infinite scroll)
// First page
db.users.find().sort({ _id: 1 }).limit(10);
// Next page — use last _id as cursor
db.users.find({ _id: { $gt: lastId } }).sort({ _id: 1 }).limit(10);
// Always uses index, no scanning
```

---

## Q14: Mongoose — Setup & Connection

```js
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  // Options (most are default in v6+)
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Connection failed:', err));

// Connection events
mongoose.connection.on('connected', () => console.log('Connected'));
mongoose.connection.on('error', (err) => console.error(err));
mongoose.connection.on('disconnected', () => console.log('Disconnected'));

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
```

---

## Q15: Mongoose Schema & Model

```js
const userSchema = new mongoose.Schema({
  // String
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },

  // String with validation
  email: {
    type: String,
    required: [true, 'Email is required'],  // custom error message
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email']
  },

  // Number
  age: { type: Number, min: 0, max: 150 },

  // Enum
  role: { type: String, enum: ['user', 'admin', 'editor'], default: 'user' },

  // Boolean
  isActive: { type: Boolean, default: true },

  // Date
  birthDate: Date,

  // Array of strings
  tags: [String],

  // Array of objects (subdocuments)
  addresses: [{
    street: String,
    city: String,
    zip: String
  }],

  // Reference to another model
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],

  // Mixed type (any)
  metadata: mongoose.Schema.Types.Mixed

}, {
  timestamps: true,     // adds createdAt & updatedAt
  versionKey: false     // removes __v field
});

const User = mongoose.model('User', userSchema);
```

---

## Q16: Mongoose Queries (CRUD)

```js
// CREATE
const user = await User.create({ name: "Alice", email: "a@a.com" });
// or
const user = new User({ name: "Alice" });
await user.save();

// READ
const all = await User.find();                              // all
const active = await User.find({ isActive: true });         // filter
const one = await User.findOne({ email: "a@a.com" });      // first match
const byId = await User.findById("65a1b2c3d4e5f6a7b8c9d0"); // by _id

// Chaining
const users = await User.find({ role: "admin" })
  .select('name email')       // include only these fields
  .sort({ createdAt: -1 })    // sort descending
  .skip(10)                   // skip first 10
  .limit(5)                   // return 5
  .lean();                    // return plain JS objects (faster, no Mongoose methods)

// UPDATE
await User.findByIdAndUpdate(id, { $set: { name: "Bob" } }, { new: true }); // new: returns updated doc
await User.updateOne({ email: "a@a.com" }, { $inc: { loginCount: 1 } });
await User.updateMany({ isActive: false }, { $set: { deletedAt: new Date() } });

// DELETE
await User.findByIdAndDelete(id);
await User.deleteOne({ email: "a@a.com" });
await User.deleteMany({ isActive: false });

// COUNT
await User.countDocuments({ role: "admin" });
await User.estimatedDocumentCount(); // fast, uses metadata
```

---

## Q17: Mongoose Populate (Joins)

```js
// Schema with reference
const postSchema = new mongoose.Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Populate — replace ObjectId with actual document
const post = await Post.findById(id).populate('author');
// post.author = { _id: ..., name: "Alice", email: "a@a.com" }

// Select specific fields
await Post.findById(id).populate('author', 'name email');

// Multiple populates
await Post.findById(id)
  .populate('author', 'name')
  .populate('comments');

// Nested populate
await Post.findById(id)
  .populate({
    path: 'comments',
    populate: { path: 'user', select: 'name' }
  });
```

---

## Q18: Mongoose Middleware (Hooks)

```js
// PRE — runs BEFORE the operation
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.pre('find', function() {
  this.where({ isActive: true });  // auto-filter inactive
});

userSchema.pre('deleteOne', { document: true }, async function() {
  await Post.deleteMany({ author: this._id }); // cascade delete
});

// POST — runs AFTER the operation
userSchema.post('save', function(doc) {
  console.log(`User ${doc.name} saved`);
});

userSchema.post('findOneAndDelete', async function(doc) {
  if (doc) await Post.deleteMany({ author: doc._id });
});
```

**Types**: `save`, `validate`, `remove`, `find`, `findOne`, `findOneAndUpdate`, `deleteOne`, `updateOne`, `aggregate`, `init`

---

## Q19: Mongoose Virtuals

Computed properties that don't get stored in DB.

```js
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual('fullName').set(function(name) {
  const [first, last] = name.split(' ');
  this.firstName = first;
  this.lastName = last;
});

// Include virtuals in JSON output
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// Reverse populate (virtual populate)
userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'author'
});
// Now: await User.findById(id).populate('posts');
```

---

## Q20: Static Methods vs Instance Methods

```js
// Instance method — called on a document
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
const user = await User.findOne({ email });
const isMatch = await user.comparePassword("123456");

// Static method — called on the model
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};
const user = await User.findByEmail("alice@test.com");

// Query helper — chainable
userSchema.query.byRole = function(role) {
  return this.where({ role });
};
const admins = await User.find().byRole('admin');
```

---

## Q21: Custom Validators

```js
const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number`
    }
  },
  endDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return value > this.startDate;  // compare with another field
      },
      message: 'End date must be after start date'
    }
  }
});

// Async validator
userSchema.path('email').validate(async function(value) {
  const count = await User.countDocuments({ email: value });
  return count === 0;
}, 'Email already exists');
```

---

## Q22: Mongoose Lean Queries

```js
// Normal — returns Mongoose documents (with methods, virtuals, change tracking)
const users = await User.find();
users[0].save();  // works
users[0] instanceof mongoose.Document; // true

// Lean — returns plain JavaScript objects (2-5x faster)
const users = await User.find().lean();
users[0].save();  // ERROR — no Mongoose methods
users[0] instanceof mongoose.Document; // false
```

**Use lean()** when: read-only operations, API responses, no need for save/validate.
**Don't use** when: you need to modify and save, or use virtuals/methods.

---

## Q23: Subdocuments

```js
const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  zip: String
});

const userSchema = new mongoose.Schema({
  name: String,
  addresses: [addressSchema]  // array of subdocuments
});

// Add subdocument
user.addresses.push({ street: "123 Main", city: "NYC" });
await user.save();

// Find specific subdocument
const addr = user.addresses.id(subdocId);

// Remove subdocument
user.addresses.pull(subdocId);
await user.save();
```

Subdocuments have their own `_id` by default. They share the parent's lifecycle (saved/validated together).

---

## Q24: Discriminators (Inheritance)

```js
const eventSchema = new mongoose.Schema({ date: Date, location: String });
const Event = mongoose.model('Event', eventSchema);

// Child model — adds extra fields
const ClickEvent = Event.discriminator('ClickEvent',
  new mongoose.Schema({ element: String, url: String })
);

const PageViewEvent = Event.discriminator('PageViewEvent',
  new mongoose.Schema({ page: String, duration: Number })
);

// All stored in same collection with __t field (discriminator key)
await ClickEvent.create({ date: new Date(), element: "button", url: "/home" });
await Event.find(); // returns all event types
await ClickEvent.find(); // returns only click events
```

---

## Q25: Connection Pooling

```js
mongoose.connect(uri, {
  maxPoolSize: 10,     // max connections in pool (default: 100 in v6+)
  minPoolSize: 2,      // min connections maintained
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000
});
```

Connection pool reuses connections instead of creating new ones. Important for performance under load.

---

## Q26: Replica Sets

A group of MongoDB servers maintaining the **same data**:
- **Primary** — receives all writes
- **Secondary** (2+) — replicate from primary, can serve reads
- If primary goes down → **automatic failover** (secondary becomes primary)

```
Primary (writes) ──replicates──→ Secondary 1 (reads)
                 ──replicates──→ Secondary 2 (reads)
```

**Benefits**: high availability, data redundancy, read scaling.

---

## Q27: Sharding

Distributing data across **multiple servers** (horizontal scaling).

```
               ┌── Shard 1 (users A-M)
mongos router ─┼── Shard 2 (users N-Z)
               └── Shard 3 (overflow)
```

- **Shard key** — determines which shard stores a document
- **mongos** — router that directs queries to correct shard
- **Config servers** — store metadata about shard distribution

**Choose shard key carefully**: high cardinality, evenly distributed, frequently queried.

---

## Q28: MongoDB Atlas

Cloud-hosted MongoDB service:
- Auto-scaling, backups, monitoring
- Free tier (M0): 512MB storage
- Built-in security: IP whitelisting, encryption, VPC peering
- Connection: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`

---

## Q29: Read/Write Concerns

```js
// Write concern — how many nodes must acknowledge a write
{ w: 1 }          // acknowledged by primary only (default)
{ w: "majority" } // acknowledged by majority of replica set
{ w: 0 }          // fire and forget (no acknowledgment)

// Read concern
"local"       // return data from current node (may be stale)
"majority"    // return data acknowledged by majority
"linearizable" // strongest — reflects all successful writes

// Read preference
"primary"            // read from primary only (default)
"primaryPreferred"   // primary if available, else secondary
"secondary"          // read from secondary only
"secondaryPreferred" // secondary if available, else primary
"nearest"            // lowest latency node
```

---

## Q30: Change Streams

Watch real-time changes to a collection.

```js
const changeStream = User.watch();

changeStream.on('change', (change) => {
  console.log(change.operationType); // 'insert', 'update', 'delete'
  console.log(change.fullDocument);  // the changed document
});

// With filter
const pipeline = [{ $match: { operationType: 'insert' } }];
const stream = User.watch(pipeline);
```

**Use case**: real-time notifications, syncing data, event-driven architecture.

---

## Q31: GridFS

Store files **larger than 16MB** in MongoDB. Splits files into chunks (default 255KB).

```js
const { GridFSBucket } = require('mongodb');
const bucket = new GridFSBucket(db);

// Upload
fs.createReadStream('large-video.mp4')
  .pipe(bucket.openUploadStream('video.mp4'));

// Download
bucket.openDownloadStreamByName('video.mp4')
  .pipe(fs.createWriteStream('downloaded.mp4'));
```

**Collections**: `fs.files` (metadata) + `fs.chunks` (file data).

---

## Q32: Capped Collections

Fixed-size collections that automatically remove oldest documents when full.

```js
db.createCollection("logs", { capped: true, size: 1048576, max: 1000 });
// size: max bytes, max: max documents
```

**Use case**: logs, cache, circular buffers. Inserts are very fast. No deletes allowed.

---

## Q33: Backup & Restore

```bash
# Backup entire database
mongodump --uri="mongodb://localhost:27017/mydb" --out=./backup

# Backup single collection
mongodump --db=mydb --collection=users --out=./backup

# Restore
mongorestore --uri="mongodb://localhost:27017/mydb" ./backup/mydb

# Export to JSON
mongoexport --db=mydb --collection=users --out=users.json

# Import from JSON
mongoimport --db=mydb --collection=users --file=users.json
```

---

## Q34: MongoDB vs Mongoose

| MongoDB Driver | Mongoose |
|---|---|
| Raw MongoDB operations | ODM (Object Document Mapper) |
| No schema enforcement | Schema with validation |
| No middleware | Pre/post hooks |
| No populate | Populate (joins) |
| More flexible | More structure |
| Faster (less overhead) | Developer-friendly |

Use Mongoose for most apps. Use raw driver for performance-critical or simple scripts.

---

## Q35: Common Aggregation Exercises

### Total revenue per product category
```js
db.orders.aggregate([
  { $unwind: "$items" },
  { $group: {
    _id: "$items.category",
    totalRevenue: { $sum: { $multiply: ["$items.price", "$items.qty"] } },
    totalSold: { $sum: "$items.qty" }
  }},
  { $sort: { totalRevenue: -1 } }
]);
```

### Users who placed more than 5 orders
```js
db.orders.aggregate([
  { $group: { _id: "$userId", orderCount: { $sum: 1 } } },
  { $match: { orderCount: { $gt: 5 } } },
  { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
  { $unwind: "$user" },
  { $project: { name: "$user.name", orderCount: 1 } }
]);
```

### Monthly registration stats
```js
db.users.aggregate([
  { $group: {
    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
    count: { $sum: 1 }
  }},
  { $sort: { "_id.year": 1, "_id.month": 1 } }
]);
```

---

## Q36: Performance Optimization

1. **Indexing** — index fields used in queries/sort
2. **Projection** — only fetch needed fields `find({}, { name: 1 })`
3. **Lean queries** — `find().lean()` for read-only
4. **Aggregation** — use `$match` early to reduce pipeline data
5. **Connection pooling** — reuse connections
6. **Covered queries** — query + projection fully satisfied by index
7. **Avoid $where** — runs JavaScript, very slow
8. **Avoid large arrays** — embedded arrays shouldn't grow unbounded
9. **Use explain()** — analyze query performance
10. **Batch operations** — `insertMany`, `bulkWrite` instead of loops

---

## Q37: Common Interview Scenario Questions

**Q: Design a schema for a blog application**
```js
// User
{ name, email, password, role, avatar, createdAt }

// Post
{ title, body, author: ObjectId(User), tags: [String],
  likes: [ObjectId(User)], status: enum['draft','published'],
  createdAt, updatedAt }

// Comment — reference (can grow large)
{ text, author: ObjectId(User), post: ObjectId(Post), createdAt }
```
Why? Comments can grow unbounded → reference, not embed. Tags are few → embed as array. Likes as array of userIds for quick "has user liked" check.

**Q: How would you handle millions of documents?**
- Proper indexing (compound indexes)
- Cursor-based pagination (not skip/limit)
- Sharding for horizontal scaling
- Read replicas for read-heavy loads
- Aggregation pipeline for analytics
- Caching frequently accessed data (Redis)

**Q: How to prevent duplicate entries?**
- Unique index: `db.users.createIndex({ email: 1 }, { unique: true })`
- Mongoose: `unique: true` in schema
- Handle duplicate key error (code 11000)

---

## Q38: Error Code 11000 (Duplicate Key)

```js
try {
  await User.create({ email: "existing@test.com" });
} catch (err) {
  if (err.code === 11000) {
    // Duplicate key error
    const field = Object.keys(err.keyPattern)[0];
    res.status(409).json({ error: `${field} already exists` });
  }
}
```

---

## Q39: Mongoose vs Sequelize (SQL ORM)

| Feature | Mongoose (MongoDB) | Sequelize (SQL) |
|---|---|---|
| Database | MongoDB | PostgreSQL, MySQL, SQLite |
| Schema | Schema + Model | Model + Migrations |
| Relationships | populate (manual) | hasMany, belongsTo (automatic) |
| Migrations | Not built-in | Built-in |
| Transactions | Manual session | Built-in |
| Query builder | Chaining | Chaining + raw SQL |

---

## Q40: Quick-Fire Questions

**Q: Max document size?** 16MB.

**Q: Default port?** 27017.

**Q: What is ObjectId?** 12-byte unique identifier. Contains timestamp (first 4 bytes) — so it's roughly sortable by creation time.

**Q: findOne vs find?** `findOne` returns single document or null. `find` returns cursor (array).

**Q: find() vs findById()?** `findById(id)` is shorthand for `findOne({ _id: id })`.

**Q: What is $lookup?** Left outer join in aggregation — like SQL JOIN.

**Q: What is $unwind?** Deconstructs array field — creates one document per array element.

**Q: What is lean()?** Returns plain JS objects instead of Mongoose documents. 2-5x faster, no methods.

**Q: How to handle schema migrations?** MongoDB is schema-flexible. Handle in app code with defaults, or use a migration tool like `migrate-mongo`.

**Q: What are compound indexes?** Index on multiple fields. Order matters (prefix rule). `{ name: 1, age: -1 }` supports queries on `name` alone or `name + age`, but NOT `age` alone.

---

*End of MongoDB & Mongoose Deep Dive — 40 Questions*
