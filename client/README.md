## Frontend Setup

The frontend of **GrubQuest** is built with **React.js, Vite, Tailwind CSS, ShadCN UI, and Aceternity UI**.  
It handles the user interface, including browsing restaurants, managing cart, placing orders, and viewing live updates.

### Installation Steps

```bash
# Navigate to the client folder
cd client

# Install dependencies
npm install
```

```env
# Create a .env file in client/ with:
VITE_API_URL=http://localhost:5000
```

```bash
# Start the frontend development server
npm run dev
```

##Notes

- Ensure the backend server is running at http://localhost:5000 (or your API URL).

- The .env file must have the correct API URL to connect to the backend.

- You can open the app in the browser at the URL shown by npm run dev (usually http://localhost:5173).