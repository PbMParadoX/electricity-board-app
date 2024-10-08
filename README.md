# Electricity Board Management Application

## Overview

A web application for managing electricity connection applications, built with React.js and Node.js.

## Features

### Part A

1. **Display Records**: View all connection requests in a tabular format.
2. **Search**: Search connection details by Applicant ID.
3. **Add User**: Add new connection requests.
4. **Delete User**: Delete existing users with "Rejected" status.
5. **Date Filter**: Filter connection requests by date range.
6. **View/Edit**: View and edit connection requests.
7. **Data Validation**: Ensures data integrity.

### Part B

1. **Visualization Graphs**: Bar charts showing monthly connection requests based on status.
2. **Pie Charts**: Distribution of connection categories.

## Technologies Used

- **Frontend**: React.js, Material-UI, Recharts
- **Backend**: Node.js, Express.js
- **Database**: JSON file (`user.json`)
- **Others**: Axios, React Router

## Installation

### Prerequisites

- Node.js & npm
- Git

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   node server.js
   ```
   #### The server will run on **https://localhost:5000**
   #### The JSON file can be accessed on **https://localhost:5000/api/users**

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm start
   ```
   #### The app will run on **http://localhost:3000**

### Demo Video

To see a demo of the project, check out the video below:

[Demo Video
![image](https://github.com/user-attachments/assets/9b4233d9-dd65-4fdf-879c-2bdb1ece2664)](https://drive.google.com/file/d/1FBtQ2MB7mgkwbkSzWSLHf9DVGtA_hKH9/view?usp=sharing
)

## Contribution

Contributions are welcome! Please open an issue or submit a pull request.

## Licence

This project is licensed under the MIT License
