# Interactive CV – Vue 3 & Jobsuche API

This project is an **interactive curriculum vitae (CV)** built with **Vue 3**, **TypeScript**, and **Vite**.  

---

## External API

- **Jobsuche API – Bundesagentur für Arbeit**
- Provides real job offers from the German job market
- Relevant for a CV, as it shows internships and job opportunities related to the user profile

---

## Features

- Live job search using an external API
- Filters by keyword, city, and search radius
- Pagination of results
- Loading and error handling
- Reactive UI using Vue Composition API

---

## Technical Overview

- Data fetched with the **Fetch API**
- API calls executed inside Vue lifecycle hooks
- Reactive state managed with `ref`, `computed`, and `watch`
- API key stored in environment variables

---

## Project Setup

### Install dependencies
```bash
npm install
```

## Run development server
```bash
npm run dev
```

## Environment variables
Create a .env file in the project root:
```bash
VITE_JOBBOERSE_BASE_URL="/api/jobboerse/jobsuche-service"
VITE_JOBBOERSE_API_KEY="jobboerse-jobsuche"
```
