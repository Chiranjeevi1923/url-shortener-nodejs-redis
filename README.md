# 🔗 Scalable URL Shortener

A **production-ready URL Shortener backend** built with **Node.js**, **PostgreSQL**, **Drizzle ORM**, and **Redis**, focusing on **performance, scalability, and clean system design**.

This project demonstrates how real-world URL shorteners are designed using **cache-aside patterns**, **database indexing**, and **efficient analytics tracking**.

---

## 🚀 Features

- 🔐 Generate **unique short URLs** using Base62 encoding
- ⚡ Ultra-fast redirects using **Redis caching**
- 📊 **Click analytics** with Redis atomic counters
- 🧱 Persistent storage using **PostgreSQL**
- 📌 Indexed lookups for high performance
- 🕒 Background sync of analytics from Redis → DB
- 🧠 System-design best practices applied

---

## 🏗️ Tech Stack

- **Node.js** – Backend runtime
- **Express.js** – HTTP server
- **PostgreSQL** – Primary database
- **Drizzle ORM** – Type-safe ORM
- **Redis** – Caching & analytics
- **Docker** – Local infrastructure (optional)

---

## 🔁 URL Redirect Flow

1. Client hits `GET /:shortCode`
2. Redis cache lookup (O(1))
3. If cache miss → DB lookup using indexed `shortCode`
4. Store result in Redis with TTL
5. Increment click counter using Redis `INCR`
6. Redirect to original URL

---

## 📊 Click Analytics Design

- Each redirect increments a Redis key: `clicks:{shortCode}`
- Periodic background job flushes aggregated counts to DB
- Prevents database write amplification
- Scales to millions of clicks/day



## 🛠️ Setup Instructions

1️⃣ Clone Repository
```
git clone https://github.com/Chiranjeevi1923/url-shortener-nodejs-redis.git
cd url-shortener-nodejs-redis
```

2️⃣ Install Dependencies
```
npm install
```

3️⃣ Environment Variables
Create `.env` file in the project root path
```
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/url_shortener
REDIS_URL=redis://localhost:6379
```

4️⃣ Run Server
```
npm start
```

## ⭐ If you find this useful
Give the repo a ⭐ if it helps you. Feel free to fork or improve it. 

Cheers 🥂!
