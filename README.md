# Lockey - Location-Locked File Access System

Lockey is a secure, full-stack web application that allows users to protect files using geographical boundaries. Files uploaded to Lockey are locked to a specific set of GPS coordinates and a radius (in meters). Users can only download the locked files if their physical location falls within the designated boundary.

---

## 🚀 Features

- **Geofenced Locking**: Set specific latitude, longitude, and access radius (in meters) when uploading files.
- **GPS Integration**: One-click coordinate retrieval using the browser's Geolocation API.
- **Spherical Geometry Calculations**: The backend uses the **Haversine Formula** to precisely determine the distance between the downloader's location and the target locked location.
- **High Security with Verification Timeout**: Verification is valid for a short duration (60 seconds) to ensure files cannot be intercepted or accessed later from outside the zone.
- **Modern Responsive Design**: Clean user interface built with Next.js, Tailwind CSS, TypeScript, and shadcn/ui components.

---

## 🛠️ Architecture & Tech Stack

### Frontend (Client)
- **Framework**: Next.js 13 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & CSS variables (with shadcn/ui custom theme)
- **Icons**: Lucide React
- **Location Source**: HTML5 Geolocation API (`navigator.geolocation`)

### Backend (Server)
- **Runtime**: Node.js & Express
- **File Handling**: Multer (saves uploads locally to `server/uploads/`)
- **Data Model (Ready to scale)**: Mongoose (MongoDB ODM) model defined in `server/models/FileMetadata.js`
- **Verification Logic**: Custom Haversine distance calculator in `server/utils/haversine.js`

---

## 📂 Project Structure

```text
lockey/
├── client/                 # Next.js Frontend
│   ├── app/                # App router pages (upload, access)
│   ├── components/         # Reusable UI components (buttons, cards, etc.)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Client-side utility functions
│   ├── package.json        # Frontend dependencies & scripts
│   └── tsconfig.json       # TypeScript configuration
│
└── server/                 # Express Backend
    ├── controllers/        # Route handler functions
    ├── models/             # Database schemas (Mongoose)
    ├── routes/             # API routes definition
    ├── uploads/            # Temporary disk storage for uploaded files
    ├── utils/              # Calculation helpers (Haversine formula)
    ├── package.json        # Backend dependencies & scripts
    └── server.js           # Server entry point
```

---

## 🔧 Installation & Setup

Follow these steps to run both the frontend and backend local development servers.

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 2. Set Up the Backend
1. Open a terminal and navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   The backend server will run on `http://localhost:8080`.

### 3. Set Up the Frontend
1. Open a new terminal and navigate to the `client/` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The Next.js app will run on `http://localhost:3000`.

---

## 📡 API Reference

### 1. Upload File
Uploads a file and stores its target geolocation and access radius.
- **Endpoint**: `POST /api/upload`
- **Content-Type**: `multipart/form-data`
- **Request Body**:
  - `file`: The file binary to lock.
  - `latitude`: Target latitude (decimal).
  - `longitude`: Target longitude (decimal).
  - `radius`: Target access radius in meters (default: `100`).
- **Response**:
  ```json
  {
    "accessId": "8f8e8cd1-7a6c-48c0-8fe6-b3713589b252"
  }
  ```

### 2. Verify Location
Checks if the downloader is inside the allowed location radius.
- **Endpoint**: `POST /api/verify`
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "accessId": "8f8e8cd1-7a6c-48c0-8fe6-b3713589b252",
    "lat": "37.7749",
    "lng": "-122.4194"
  }
  ```
- **Response (Allowed)**:
  ```json
  {
    "allowed": true
  }
  ```
- **Response (Denied)**:
  ```json
  {
    "allowed": false,
    "distance": 320.5
  }
  ```

### 3. Download File
Initiates download of the file. Access is allowed only if the location was successfully verified within the last 60 seconds.
- **Endpoint**: `GET /api/download/:accessId`
- **Response**: Binary file download or `403 Forbidden`.

---

## 🔒 Extension: Connecting MongoDB

The server currently stores active locks in-memory (`fileStorage` array) for instant plug-and-play local development. To transition to a persistent MongoDB database:

1. Import Mongoose in `server/server.js` and connect to your MongoDB database instance:
   ```javascript
   const mongoose = require('mongoose');
   mongoose.connect('mongodb://localhost:27017/lockey')
     .then(() => console.log('MongoDB connected'))
     .catch(err => console.error(err));
   ```
2. Replace references to `fileStorage` array inside:
   - `server/controllers/uploadController.js`
   - `server/controllers/verifyController.js`
   - `server/controllers/downloadController.js`
   with Mongoose queries on the `FileMetadata` model defined in `server/models/FileMetadata.js`.
