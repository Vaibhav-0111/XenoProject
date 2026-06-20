# XenoReach Step-by-Step Deployment Guide

This document provides comprehensive, step-by-step instructions to deploy the entire XenoReach project. The deployment architecture consists of:
- **Database:** Neon (Serverless PostgreSQL)
- **Backend:** Railway (Spring Boot Services)
- **Frontend:** Vercel (React + Vite)

---

## 1. Database Deployment (Neon)
Neon provides a serverless PostgreSQL database which easily integrates with Java Spring Boot.

1. Navigate to [Neon.tech](https://neon.tech) and create a free account or log in.
2. Click **New Project** and set the database name to `xenoreach`. Select your preferred region.
3. Once the database is created, navigate to your **Dashboard**.
4. Under the **Connection Details**, select "Java" as the language to see the JDBC connection string.
5. Copy the connection string. It will look like this:
   `jdbc:postgresql://ep-example-endpoint.neon.tech/xenoreach?sslmode=require`
6. Note down your database username and password provided by Neon.

> **Note:** You will use this JDBC connection string as the `DATABASE_URL` in the Railway backend setup.

---

## 2. Backend Deployment (Railway)
The backend is divided into two Spring Boot services: `crm-core` and `channel-simulator`. We will deploy both on Railway.

### 2.1 Deploying the Channel Simulator
We deploy the Simulator first so we can obtain its URL to pass to the CRM Core.

1. Navigate to [Railway.app](https://railway.app) and create an account.
2. Click **New Project** > **Deploy from GitHub repo**. Choose your `xenoreach-ai` repository.
3. Once added, click on the newly created service block, go to **Settings**, and configure the following:
   - **Root Directory:** `/backend/channel-simulator`
   - **Build Command:** `mvn clean package -DskipTests`
   - **Start Command:** `java -jar target/channel-simulator-0.0.1-SNAPSHOT.jar`
4. Go to the **Networking** tab in the service settings and click **Generate Domain**. Copy this URL (e.g., `https://channel-simulator-production.up.railway.app`).
5. Go to the **Variables** tab and add the following Environment Variables:
   - `PORT` = `8081`
   - `SIM_MIN_DELAY_SECONDS` = `1`
   - `SIM_MAX_DELAY_SECONDS` = `10`
   - `SIM_FAILURE_RATE` = `0.05`

### 2.2 Deploying the CRM Core
1. In the same Railway project workspace, click **New** > **GitHub Repo** and select the `xenoreach-ai` repository again. This creates a second service.
2. Click on this new service block, go to **Settings**, and configure:
   - **Root Directory:** `/backend/crm-core`
   - **Build Command:** `mvn clean package -DskipTests`
   - **Start Command:** `java -jar target/crm-core-1.0.0.jar`
3. Go to the **Networking** tab and click **Generate Domain**. Copy this URL as well (e.g., `https://crm-core-production.up.railway.app`).
4. Go to the **Variables** tab and add the following Environment Variables:
   - `DATABASE_URL` = *[Your Neon JDBC Connection String]*
   - `DATABASE_USERNAME` = *[Your Neon Database User]*
   - `DATABASE_PASSWORD` = *[Your Neon Database Password]*
   - `JWT_SECRET` = `your-super-secret-jwt-key-min-32-chars`
   - `CHANNEL_SIMULATOR_URL` = *[The Channel Simulator URL generated in Step 2.1]*
   - `ALLOWED_ORIGINS` = *[Leave empty for now, we will update this after frontend deployment]*
   - `AI_PROVIDER` = `mock`
   - `FIREBASE_ENABLED` = `false`
   - `PORT` = `8080`

> **Note:** We will come back to update `ALLOWED_ORIGINS` and `CRM_CORE_URL` (on the simulator service) once everything has a public URL.

---

## 3. Frontend Deployment (Vercel)
The frontend is built using React and Vite, making Vercel the optimal hosting platform.

1. Navigate to [Vercel.com](https://vercel.com) and log in.
2. Click **Add New...** > **Project**.
3. Import the `xenoreach-ai` GitHub repository.
4. In the project configuration screen, apply these settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend` (click "Edit" next to root directory and select the frontend folder)
   - **Build Command:** `npm run build` or `bun run build`
   - **Output Directory:** *[Leave this blank/default! Do not set it to `dist`]*
5. Expand the **Environment Variables** section and add:
   - `VITE_API_BASE_URL` = *[The CRM Core URL generated in Step 2.2, e.g. https://crm-core-production.up.railway.app]*
   - (Optional) Add your Firebase variables if you use Google Auth: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, etc.
6. Click **Deploy**. Wait for Vercel to build and assign a domain (e.g., `https://xenoreach-frontend.vercel.app`).

---

## 4. Final Networking Hookup
Now that all components are live, we need to cross-link their URLs to ensure they can communicate securely.

1. **Update CRM Core CORS:** Go back to Railway > `crm-core` service > Variables. Set `ALLOWED_ORIGINS` to your Vercel Frontend URL (e.g., `https://xenoreach-frontend.vercel.app`). This prevents CORS errors.
2. **Update Simulator Pointer:** Go to Railway > `channel-simulator` service > Variables. Add a new variable `CRM_CORE_URL` and set it to your CRM Core URL (e.g., `https://crm-core-production.up.railway.app`). This tells the simulator where to send event webhooks.

---

### Congratulations!
Your XenoReach application is now fully deployed. The Vercel frontend is communicating securely with the Railway CRM backend, backed by the Neon PostgreSQL database, while the Channel Simulator processes background queue actions.
