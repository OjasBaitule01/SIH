# IP-SAKTI Sahayak

Multilingual, Source-Cited, RAG-Based Ayurvedic IP & Regulatory Navigator.
Built for the Smart India Hackathon (SIH).

## Project Structure

This project is separated into two folders as per best practices:
- `/frontend`: React application built with Vite and pure CSS (Premium Dark Mode).
- `/backend`: Node.js & Express server for API handling.

## Running Locally

### 1. Start the Backend
Open a terminal and run:
```bash
cd backend
node index.js
```
The backend will run on `http://localhost:5000`.

### 2. Start the Frontend
Open a new terminal and run:
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`.

## Deployment to Vercel

To deploy the **Frontend** to Vercel:
1. Push this repository to GitHub.
2. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. In the **Framework Preset**, Vercel will automatically detect **Vite**.
5. **IMPORTANT:** Set the **Root Directory** to `frontend`.
6. Click **Deploy**.

To deploy the **Backend**:
Since Vercel is primarily for static sites and serverless functions, a standard Express backend (like the one in the `backend` folder) is best deployed to platforms like **Render.com**, **Railway**, or **Heroku**. 
- Simply create a new Web Service on Render, connect the repo, set the root directory to `backend`, build command to `npm install`, and start command to `node index.js`.
- Once the backend is deployed, update the API URL in your frontend code to point to the new deployed backend URL instead of `localhost:5000`.
