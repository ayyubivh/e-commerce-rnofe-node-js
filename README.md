# E-Commerce REST API

A basic REST API for an e-commerce app, built with Express. Uses in-memory/seeded
data (no database needed) so it's easy to run and test locally.

## Features

- JWT-based authentication (register / login with email + password)
- Password hashing with bcrypt
- Protected routes for cart and wishlist
- Seeded in-memory product catalog
- Input validation with clear error messages and proper HTTP status codes
- Centralized error handling
- Interactive Swagger/OpenAPI docs at `/api-docs`

## Folder structure

```
ecommerce-api/
├── server.js                  # entry point
├── src/
│   ├── app.js                 # express app setup, route mounting
│   ├── routes/                # route definitions + validation rules
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   └── wishlistRoutes.js
│   ├── controllers/           # request handlers / business logic
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   └── wishlistController.js
│   ├── models/                # in-memory data access
│   │   ├── User.js
│   │   └── Product.js
│   ├── data/
│   │   └── products.js        # seeded product catalog
│   ├── middleware/
│   │   ├── auth.js             # JWT auth guard
│   │   ├── validate.js         # express-validator error formatter
│   │   └── errorHandler.js     # 404 + centralized error handler
│   ├── config/
│   │   └── swagger.js          # OpenAPI spec (swagger-jsdoc config)
│   └── utils/
│       ├── jwt.js
│       └── asyncHandler.js
```

## Setup

Requires Node.js 18+.

```bash
cd ecommerce-api
npm install
cp .env.example .env
npm run dev   # starts with nodemon on http://localhost:3000
# or: npm start
```

Environment variables (`.env`):

| Variable         | Description                        | Default             |
|------------------|-------------------------------------|----------------------|
| `PORT`           | Port the server listens on          | `3000`               |
| `JWT_SECRET`     | Secret used to sign JWTs            | `dev-secret-change-me` |
| `JWT_EXPIRES_IN` | JWT expiry (e.g. `1h`, `7d`)         | `1h`                 |

> Note: all data (users, carts, wishlists) is stored **in memory** and resets
> whenever the server restarts.

## Deploying so other developers can use it

To let another developer integrate against this API without running it
themselves, deploy it to a free host and give them the resulting URL — the
app is already deploy-ready (`PORT` comes from the environment, there's a
`start` script, and `render.yaml` is included for a one-click setup on Render).

**Steps (Render — free, no credit card required):**

1. Push this project to a GitHub repo (from the `ecommerce-api` folder):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-empty-github-repo-url>
   git push -u origin main
   ```
2. Go to [render.com](https://render.com) → sign in with GitHub → **New > Blueprint**
   → select this repo. Render reads `render.yaml` and configures the service
   automatically (build: `npm install`, start: `npm start`, and it generates
   a random `JWT_SECRET` for you).
   - No `render.yaml`/Blueprint? Create a **New > Web Service** manually instead,
     point it at the repo, set Build Command `npm install` and Start Command
     `npm start`, and add an environment variable `JWT_SECRET` with a long
     random value.
3. Click **Create** / **Deploy**. Render gives you a public URL like
   `https://ecommerce-api-xxxx.onrender.com`.

**What to hand the other developer:**
- The base URL from step 3, in place of `http://localhost:3000` in every
  example below.
- A link to `https://<your-app>.onrender.com/api-docs` — the same interactive
  Swagger UI, but already live, so they can explore/try every endpoint without
  installing anything.
- A heads-up on two things specific to this setup:
  - **Cold starts**: Render's free tier spins the service down after ~15 minutes
    of inactivity. The first request after idle can take 30–50 seconds to respond
    while it wakes back up — not a bug.
  - **In-memory data**: users/carts/wishlists live in memory, so they reset
    whenever the service restarts or redeploys (including the free-tier spin
    down/wake cycle). Fine for API testing and demos; don't rely on data
    surviving long term.

**Alternatives:** [Railway](https://railway.app) works the same way (connect
GitHub repo, it auto-detects Node and the `start` script). For a quick,
no-deploy option instead of a permanent host, run the server locally and
expose it with a tunnel (e.g. `npx ngrok http 3000`) — you get a temporary
public URL instantly, but it only works while your machine and the server
are running.

## Swagger / OpenAPI docs

Once the server is running, open **http://localhost:3000/api-docs** for an
interactive Swagger UI covering every endpoint — you can try each request
right from the browser. Click **Authorize** and paste a token (from register/login)
to call the protected cart/wishlist routes.

The raw OpenAPI spec (JSON) is available at `http://localhost:3000/api-docs.json`
if you want to import it into Postman/Insomnia instead of using curl.

## Auth

Protected routes require an `Authorization: Bearer <token>` header, using the
token returned by register or login.

CORS is open to all origins (`cors()` with no config), so a frontend app on
any domain — `localhost:5173`, a deployed Vercel/Netlify app, etc. — can call
this API directly once it's hosted, no extra configuration needed.

## Endpoints

Base URL: `http://localhost:3000`

### 1. Register

`POST /api/auth/register`

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","password":"secret123"}'
```

Success `201`:
```json
{
  "user": { "id": 1, "email": "ada@example.com", "cart": [], "wishlist": [] },
  "token": "eyJhbGciOi..."
}
```

Errors: `400` invalid email / password shorter than 6 chars, `409` email already registered.

### 2. Log in

`POST /api/auth/login`

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","password":"secret123"}'
```

Success `200`: same shape as register (`user`, `token`).
Errors: `400` invalid input, `401` invalid credentials.

### 3. List products

`GET /api/products`

```bash
curl http://localhost:3000/api/products
```

Success `200`:
```json
{ "products": [ { "id": 1, "name": "Wireless Mouse", "price": 19.99, ... }, ... ] }
```

### 4. Get a single product

`GET /api/products/:id`

```bash
curl http://localhost:3000/api/products/2
```

Success `200`: `{ "product": { "id": 2, "name": "Mechanical Keyboard", ... } }`
Errors: `400` non-numeric id, `404` product not found.

### 5. Add to cart (protected)

`POST /api/cart`

```bash
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{"productId":1,"quantity":2}'
```

- `productId` (required, positive integer)
- `quantity` (optional, positive integer, defaults to `1`) — adding the same
  product again increments its quantity instead of duplicating the line item.

Success `201`: `{ "message": "Product added to cart", "cart": [ { "productId": 1, "quantity": 2 } ] }`
Errors: `400` invalid input, `401` missing/invalid token, `404` product not found.

### 6. Add to wishlist (protected)

`POST /api/wishlist`

```bash
curl -X POST http://localhost:3000/api/wishlist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{"productId":3}'
```

Success `201`: `{ "message": "Product added to wishlist", "wishlist": [3] }`
(Adding a duplicate returns `200` with the existing wishlist and a
"already in wishlist" message instead of erroring.)
Errors: `400` invalid input, `401` missing/invalid token, `404` product not found.

## Postman

Import as a Postman collection by creating requests for each `curl` command
above, or use Postman's "Import > Raw text" and paste a curl command directly
— Postman will convert it to a request automatically. Set a collection
variable `token` after login/register and use `Bearer {{token}}` as the
Authorization header value for the cart/wishlist requests.

## Testing quickly end-to-end

```bash
# 1. Register and capture the token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","password":"secret123"}' | \
  node -e "process.stdin.on('data',d=>console.log(JSON.parse(d).token))")

# 2. Use it on a protected route
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"productId":1,"quantity":2}'
```
