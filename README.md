# MERN Calculator

A simple calculator application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features
- Perform basic arithmetic operations: addition, subtraction, multiplication, division
- Calculation history stored in MongoDB
- Clean and minimal React UI

## Getting Started

### Prerequisites
- Node.js and npm
- MongoDB (running locally on default port)

### Backend Setup
1. Open a terminal in the `server` directory:
   ```sh
   cd server
   npm install
   npm run dev
   ```
   The backend will run on [http://localhost:5000](http://localhost:5000).

### Frontend Setup
1. Open a terminal in the `client` directory:
   ```sh
   cd client
   npm install
   npm start
   ```
   The frontend will run on [http://localhost:3000](http://localhost:3000).

## Usage
- Enter an arithmetic expression (e.g., `2+2*3`) and click Calculate.
- The result will be displayed, and the last 10 calculations will appear in the history.

## Notes
- This app is for demonstration purposes. The backend uses `eval` for simplicity; do not use this in production.
