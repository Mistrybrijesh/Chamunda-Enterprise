# 🪑 FurniCraft — Full Stack Furniture E-Commerce

A production-ready MERN stack furniture store with a separate React Admin Panel.

## Project Structure

```
Funiture/
├── backend/    ← Node.js + Express REST API   (port 5000)
├── admin/      ← React Admin Panel (Vite)     (port 3001)
└── frontend/   ← Next.js Customer Site        (port 3000)
```

---

## ⚡ Quick Start

### Step 1: Setup Backend

```bash
cd backend
copy .env.example .env
# Edit .env and fill in: MONGO_URI, JWT_SECRET, CLOUDINARY_*, RAZORPAY_*
npm install
npm run dev
```

### Step 2: Create First Admin User

Once backend is running, make a POST request to create your admin account:

```
POST http://localhost:5000/api/auth/admin/register
Body: { "name": "Admin", "email": "admin@yourstore.com", "password": "yourpassword", "role": "superadmin" }
```

You can use Postman, Insomnia, or Thunder Client (VS Code extension).

### Step 3: Start Admin Panel

```bash
cd admin
npm run dev
# Open http://localhost:3001
# Login with the admin credentials you just created
```

### Step 4: Add Data via Admin Panel

1. **Categories** → Add: Sofa, Bed, Table, Chair, etc.
2. **Banners** → Upload homepage slider images
3. **Products** → Add products with images, prices, categories

### Step 5: Start Customer Frontend

```bash
cd frontend
# Edit .env.local — add your NEXT_PUBLIC_RAZORPAY_KEY_ID
npm run dev
# Open http://localhost:3000
```

---

## 🔑 Environment Variables

### backend/.env
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Random secret key (min 32 chars) |
| `CLOUDINARY_CLOUD_NAME` | From cloudinary.com dashboard |
| `CLOUDINARY_API_KEY` | From cloudinary.com dashboard |
| `CLOUDINARY_API_SECRET` | From cloudinary.com dashboard |
| `RAZORPAY_KEY_ID` | From razorpay.com dashboard |
| `RAZORPAY_KEY_SECRET` | From razorpay.com dashboard |

### frontend/.env.local
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend URL (default: http://localhost:5000/api) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay Key ID (public, same as backend) |

---

## 📡 API Endpoints

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/admin/register` | Public (first time) |
| POST | `/api/auth/admin/login` | Public |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/products` | Public |
| POST | `/api/products` | Admin only |
| PUT | `/api/products/:id` | Admin only |
| DELETE | `/api/products/:id` | Admin only |
| GET | `/api/categories` | Public |
| GET | `/api/banners` | Public |
| POST | `/api/orders` | Public |
| PUT | `/api/orders/:id/status` | Admin only |
| POST | `/api/upload` | Admin only |
| POST | `/api/payments/create-order` | Public |
| POST | `/api/payments/verify` | Public |

---

## 🚀 Deployment

| Service | Platform | Notes |
|---|---|---|
| Frontend | [Vercel](https://vercel.com) | Connect GitHub repo, auto-deploys |
| Backend | [Render](https://render.com) | Free tier available |
| Database | [MongoDB Atlas](https://cloud.mongodb.com) | Free 512MB tier |
| Images | [Cloudinary](https://cloudinary.com) | Free 25GB tier |

---

## 🛡️ Security Features

- JWT authentication for admin panel
- bcrypt password hashing
- Protected API routes (admin-only)
- CORS restricted to known origins
- Razorpay payment signature verification

---

## 📱 Pages

### Customer Site (Next.js)
- `/` — Homepage with dynamic banners + featured products
- `/products` — Product listing with filters
- `/products/[id]` — Product detail with image gallery
- `/cart` — Shopping cart
- `/checkout` — Address + payment
- `/orders/[id]` — Order confirmation + tracking
- `/account` — Login / Register / Order history
- `/about` — About page
- `/contact` — Contact form

### Admin Panel (React)
- `/login` — Admin login
- `/` — Dashboard with live stats
- `/products` — Full product CRUD + image upload
- `/categories` — Category management
- `/banners` — Banner slider management
- `/orders` — Order management + status updates
