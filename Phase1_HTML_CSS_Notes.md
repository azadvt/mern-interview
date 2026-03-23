# Phase 1 — HTML & CSS Notes

---

## 1. Semantic HTML Tags

Semantic tags give **meaning** to your HTML structure (important for accessibility & SEO).

| Tag | Purpose |
|---|---|
| `<header>` | Top section of page/section |
| `<nav>` | Navigation links |
| `<main>` | Main unique content |
| `<section>` | Thematic grouping |
| `<article>` | Self-contained content |
| `<aside>` | Sidebar/related content |
| `<footer>` | Bottom section |
| `<figure>` / `<figcaption>` | Image with caption |

**Interview Q:** *Why use semantic tags instead of `<div>` everywhere?*
> Better accessibility (screen readers), SEO (search engines understand structure), and code readability.

---

## 2. HTML Forms

```html
<form action="/submit" method="POST">
  <!-- Text input -->
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" required placeholder="Enter name">

  <!-- Email -->
  <input type="email" name="email" required>

  <!-- Password -->
  <input type="password" name="password" minlength="6">

  <!-- Number -->
  <input type="number" name="age" min="18" max="100">

  <!-- Radio buttons (same name = one selection) -->
  <input type="radio" name="gender" value="male"> Male
  <input type="radio" name="gender" value="female"> Female

  <!-- Checkbox -->
  <input type="checkbox" name="agree" required> I agree

  <!-- Dropdown -->
  <select name="city">
    <option value="">Select</option>
    <option value="kerala">Kerala</option>
    <option value="delhi">Delhi</option>
  </select>

  <!-- Textarea -->
  <textarea name="message" rows="4" cols="50"></textarea>

  <!-- File upload -->
  <input type="file" name="avatar" accept="image/*">

  <!-- Submit -->
  <button type="submit">Submit</button>
</form>
```

**Key input types:** `text`, `email`, `password`, `number`, `tel`, `url`, `date`, `file`, `hidden`, `range`, `color`, `search`

**Form attributes:**
| Attribute | Purpose |
|---|---|
| `action` | URL where form data is sent |
| `method` | `GET` (query string) or `POST` (body) |
| `enctype` | `multipart/form-data` for file uploads |
| `novalidate` | Disables browser validation |

**Validation attributes:** `required`, `minlength`, `maxlength`, `min`, `max`, `pattern` (regex)

**Interview Q:** *What is the difference between GET and POST form methods?*
> `GET` appends data to URL as query parameters (visible, limited size, cacheable). `POST` sends data in request body (hidden, no size limit, not cached). Use `GET` for searches, `POST` for sensitive data.

---

## 3. HTML Tables

```html
<table>
  <caption>Student Marks</caption>
  <thead>
    <tr>
      <th>Name</th>
      <th>Subject</th>
      <th>Marks</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Azad</td>
      <td>JavaScript</td>
      <td>95</td>
    </tr>
    <tr>
      <td rowspan="2">Vijay</td>  <!-- spans 2 rows -->
      <td>React</td>
      <td>88</td>
    </tr>
    <tr>
      <td>Node</td>
      <td>90</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="2">Average</td>  <!-- spans 2 columns -->
      <td>91</td>
    </tr>
  </tfoot>
</table>
```

**Key tags:**
| Tag | Purpose |
|---|---|
| `<table>` | Table container |
| `<thead>` / `<tbody>` / `<tfoot>` | Table sections |
| `<tr>` | Table row |
| `<th>` | Header cell (bold, centered by default) |
| `<td>` | Data cell |
| `<caption>` | Table title |
| `colspan` / `rowspan` | Merge cells |

**Interview Q:** *When should you use tables vs CSS Grid/Flexbox?*
> Use `<table>` for actual tabular data (spreadsheets, schedules, comparison data). Use CSS Grid/Flexbox for page layout. Tables should never be used for layout purposes.

---

## 4. CSS Box Model

Every element is a **box** with 4 layers:

```
+---------------------------+
|        MARGIN             |
|  +---------------------+  |
|  |      BORDER          |  |
|  |  +-----------------+ |  |
|  |  |    PADDING      | |  |
|  |  |  +-----------+  | |  |
|  |  |  |  CONTENT  |  | |  |
|  |  |  +-----------+  | |  |
|  |  +-----------------+ |  |
|  +---------------------+  |
+---------------------------+
```

**Interview Q:** *What does `box-sizing: border-box` do?*
> Makes `width` and `height` include padding and border (not just content). Without it, `width: 200px` + `padding: 20px` = 240px total. With `border-box`, total stays 200px.

---

## 5. Flexbox vs Grid

**Flexbox** — 1-dimensional (row OR column)
```css
.container {
  display: flex;
  justify-content: center;  /* main axis */
  align-items: center;      /* cross axis */
  gap: 10px;
}
```

**Grid** — 2-dimensional (rows AND columns)
```css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto;
  gap: 10px;
}
```

**Interview Q:** *When to use Flexbox vs Grid?*
> Flexbox for single-direction layouts (navbar, card row). Grid for complex 2D layouts (full page layout, dashboard).

---

## 6. CSS Positioning

| Value | Behavior |
|---|---|
| `static` | Default, normal flow |
| `relative` | Offset from its normal position, still takes space |
| `absolute` | Removed from flow, positioned relative to nearest `relative` parent |
| `fixed` | Removed from flow, relative to viewport (stays on scroll) |
| `sticky` | Acts `relative` until scroll threshold, then acts `fixed` |

---

## 7. CSS Specificity

Priority order (highest to lowest):
```
!important  >  inline style  >  #id  >  .class / [attr] / :pseudo  >  tag  >  *
```

Specificity score: `(inline, id, class, tag)` — e.g., `#nav .link a` = `(0, 1, 1, 1)`

---

## 8. Media Queries & Responsive Design

```css
/* Mobile first approach */
.container {
  width: 100%;
}

@media (min-width: 768px) {
  .container {
    width: 750px;
  }
}

@media (min-width: 1024px) {
  .container {
    width: 960px;
  }
}
```

Common breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Viewport meta tag (required for responsive):**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
