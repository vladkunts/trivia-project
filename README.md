# Trivia Quiz App

A Laravel + React-based trivia quiz application that fetches questions from the Open Trivia Database API.

---

## Quick Start

### 1. Clone & install dependencies

```bash
git clone https://github.com/vladkunts/trivia-project.git
cd trivia-project

# Install PHP dependencies
./vendor/bin/sail up -d
./vendor/bin/sail composer install

# Copy environment and generate app key
cp .env.example .env
./vendor/bin/sail artisan key:generate
```

### 2. Install frontend dependencies (Node.js 18+)

```bash
npm install
```

### 3. Run frontend and backend

```bash
# In one terminal (frontend)
npm run dev

# In another terminal (backend)
./vendor/bin/sail up
```

> The app should now be accessible at [http://localhost](http://localhost)

---

## Running Tests

```bash
./vendor/bin/sail artisan test
```

---

## Tech Stack

- Laravel 12
- React 19 + React Router
- Bootstrap 5
- Vite (with JSX support)
- Laravel Sail (Docker)

---

## Project Structure

```
├── app/
├── resources/
│   ├── views/app.blade.php     # Main entry point
│   └── js/                     # React codebase
│       ├── main.jsx
│       ├── AppRouter.jsx
│       └── pages/
├── routes/web.php
└── tests/
```

---

## Notes

- Make sure Docker is running before using Sail.
- If you encounter `vite manifest not found`, ensure `npm run dev` is running.
- All quiz data is stored in the session, nothing is persisted beyond search history.

