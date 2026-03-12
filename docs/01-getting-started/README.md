# 🚀 Getting Started

Welcome to Psychology Assistant! This section covers everything you need to get the project up and running.

## 📖 Table of Contents

1. [Installation](./INSTALLATION.md) - How to install & setup
2. [Requirements](./REQUIREMENTS.md) - System requirements
3. [Quick Start](#quick-start) - First run in 5 minutes

---

## Quick Start

### Prerequisites
- Node.js 18+ or 20+
- MongoDB 6.0+
- Docker & Docker Compose (optional)
- pnpm 8+ (package manager)

### 1️⃣ Clone & Install

```bash
git clone https://github.com/ipproyectosysoluciones/psychology-assistant.git
cd psychology-assistant

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials
```

### 2️⃣ Start Services

**Option A: With Docker** (Recommended)
```bash
docker-compose up -d
npm run dev
```

**Option B: Local Development**
```bash
# Start MongoDB (must be running)
# In another terminal:
npm run dev
```

### 3️⃣ Verify Installation

```bash
# Check backend (should return 200 OK)
curl http://localhost:3000/api/health

# Check frontend (should return HTML)
curl http://localhost:3000
```

### ✅ You're Ready!

- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:3000/api-docs

---

## 📚 Next Steps

1. **Learn the Architecture** → [Architecture Guide](../02-architecture/README.md)
2. **Explore the API** → [API Reference](../03-api/README.md)
3. **Start Developing** → [Development Guide](../04-guides/DEVELOPMENT.md)

---

## 🆘 Troubleshooting

**MongoDB Connection Failed?**
→ See [Troubleshooting Guide](../04-guides/TROUBLESHOOTING.md#mongodb)

**Port Already in Use?**
→ See [Troubleshooting Guide](../04-guides/TROUBLESHOOTING.md#ports)

**Node version mismatch?**
→ See [Requirements](./REQUIREMENTS.md)

---

*For detailed setup instructions, see [INSTALLATION.md](./INSTALLATION.md)*
