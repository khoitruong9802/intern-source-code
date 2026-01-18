# FIDS (Flight Information Display System)

FIDS is a Flight Information Display System built with Vite and React.js for the frontend, and Node.js with PostgreSQL for the backend. This system provides real-time flight information and a user-friendly interface for displaying flight data.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)

## Features

- Real-time flight information display
- Responsive and user-friendly interface
- RESTful API for data management
- Supports PostgreSQL as the database

## Technologies

- **Frontend**: Vite, React.js
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS

## Installation

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

### Clone the Repository

```bash
git clone http://gitlab.nec.vn/intern/airport-announcement.git
cd airport-announcement
```

### Set Up the Backend

Navigate to the backend directory:

```
cd backend
```

Install dependencies:

```
npm install
```

Create a .env file in the backend directory and add your PostgreSQL connection details:

```
DB_HOST=
DB_USER=
DB_PASS=
DB_NAME=
DB_PORT=
ACCESS_TOKEN_SECRET_KEY=
REFRESH_TOKEN_SECRET_KEY=
GOOGLE_CREDENTIALS=
```

Start the backend server:

```
npm start
```

The backend server will typically run on http://localhost:5000 by default.

### Set Up the Frontend

Navigate to the frontend directory:

```
cd ../frontend
```

Install dependencies:

```
npm install
```

Create a .env.local file in the frontend directory

```
VITE_API_URL=
VITE_SOCKET_URL=
```

Start the development server:

```
npm run dev
```

The frontend server will typically run on http://localhost:5173.

### Usage

- Use the frontend to view real-time flight information.
- The backend provides a RESTful API for managing flight data.
- Ensure your PostgreSQL database is running and accessible.
