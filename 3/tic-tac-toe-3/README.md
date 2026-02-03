# Tic-Tac-Toe Frontend

Frontend implementation for the Tic-Tac-Toe game.
The application is built with **Vue 3** and **TypeScript** and communicates with a provided backend via **REST APIs** and **WebSockets**.

---

## Requirements
- Node.js (v18+ recommended)
- npm
- Running Tic-Tac-Toe backend server

---

## Setup

### 1. Install dependencies
```bash
npm install
```

---

### 2. Environment configuration
In case of running the backend locally create a `.env` file in the project root with the following content:
```env
VITE_API_BASE_URL=http://localhost:8080
```
Alternatively, you can use the provided remote server:
```env
VITE_API_BASE_URL=http://193.197.231.20:8080
```

Both options work:
- `localhost:8080` → when running the backend locally
- `193.197.231.20:8080` → when using the provided server instance

---

### 3. Run the application
```bash
npm run dev
```
The frontend will be available at:
```
http://localhost:5173
```

---

## Build
To create a production build:
```bash
npm run build
```

---

## Stack
- Vue.js 3
- TypeScript
- Vite
- REST API & WebSocket communication