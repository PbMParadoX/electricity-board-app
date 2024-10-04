// backend/server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Path to the user.json file
const dataFilePath = path.join(__dirname, 'user.json');

// Helper function to read data
const readData = () => {
  const jsonData = fs.readFileSync(dataFilePath);
  return JSON.parse(jsonData);
};

// Helper function to write data
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// GET all users
app.get('/api/users', (req, res) => {
  const users = readData();
  res.json(users);
});

// GET user by ID
app.get('/api/users/:id', (req, res) => {
  const users = readData();
  const user = users.find((u) => u.ID === parseInt(req.params.id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// POST add a new user
app.post('/api/users', (req, res) => {
  const users = readData();
  const newUser = req.body;

  // Assign a new ID
  newUser.ID = users.length > 0 ? users[users.length - 1].ID + 1 : 1;

  users.push(newUser);
  writeData(users);
  res.status(201).json(newUser);
});

// PUT update an existing user
app.put('/api/users/:id', (req, res) => {
  const users = readData();
  const userIndex = users.findIndex((u) => u.ID === parseInt(req.params.id));

  if (userIndex !== -1) {
    // Prevent changing Date_of_Application, GovtID_Type, ID_Number
    const { Date_of_Application, GovtID_Type, ID_Number } = users[userIndex];
    const updatedUser = {
      ...req.body,
      Date_of_Application,
      GovtID_Type,
      ID_Number,
    };

    // Load_Applied should not exceed 200 KV
    if (updatedUser.Load_Applied > 200) {
      return res.status(400).json({ message: 'Load_Applied cannot exceed 200 KV' });
    }

    users[userIndex] = updatedUser;
    writeData(users);
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// DELETE a user (only if status is 'Rejected')
app.delete('/api/users/:id', (req, res) => {
  const users = readData();
  const userIndex = users.findIndex((u) => u.ID === parseInt(req.params.id));

  if (userIndex !== -1) {
    const user = users[userIndex];
    if (user.Status.toLowerCase() === 'rejected') {
      users.splice(userIndex, 1);
      writeData(users);
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(400).json({ message: 'Only users with rejected status can be deleted' });
    }
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
