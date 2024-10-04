// src/pages/AddUser.js

import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddUser = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    Applicant_Name: '',
    Gender: '',
    District: '',
    State: '',
    Pincode: '',
    Ownership: '',
    GovtID_Type: '',
    ID_Number: '',
    Category: '',
    Load_Applied: '',
    Date_of_Application: new Date(),
    Status: '',
    Reviewer_ID: '',
    Reviewer_Name: '',
    Reviewer_Comments: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleDateChange = (date) => {
    setUser({ ...user, Date_of_Application: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Data Validation
    if (user.Load_Applied > 200) {
      alert('Load_Applied cannot exceed 200 KV');
      return;
    }

    // Convert Date_of_Application to DD/MM/YY format
    const formattedDate = `${user.Date_of_Application.getDate().toString().padStart(2, '0')}/${
      (user.Date_of_Application.getMonth() + 1).toString().padStart(2, '0')
    }/${user.Date_of_Application.getFullYear().toString().slice(-2)}`;
    user.Date_of_Application = formattedDate;

    try {
      await axios.post('http://localhost:5000/api/users', user);
      navigate('/');
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const genderOptions = ['Male', 'Female', 'Other'];
  const ownershipOptions = ['Single', 'Joint'];
  const govtIDOptions = ['AADHAR', 'PAN', 'VOTER ID', 'DRIVING LICENSE'];
  const categoryOptions = ['Residential', 'Commercial', 'Industrial'];
  const statusOptions = ['Pending', 'Approved', 'Rejected'];

  return (
    <div style={{padding: '20px', backgroundColor: '#f5f5f5'}}>
      <h2>Add New User</h2>
      <form onSubmit={handleSubmit}>
        {/* Applicant Name */}
        <TextField
          label="Applicant Name"
          name="Applicant_Name"
          value={user.Applicant_Name}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        {/* Gender */}
        <TextField
          select
          label="Gender"
          name="Gender"
          value={user.Gender}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        >
          {genderOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        {/* District */}
        <TextField
          label="District"
          name="District"
          value={user.District}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        {/* State */}
        <TextField
          label="State"
          name="State"
          value={user.State}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        {/* Pincode */}
        <TextField
          label="Pincode"
          name="Pincode"
          type="number"
          value={user.Pincode}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        {/* Ownership */}
        <TextField
          select
          label="Ownership"
          name="Ownership"
          value={user.Ownership}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        >
          {ownershipOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        {/* Govt ID Type */}
        <TextField
          select
          label="Govt ID Type"
          name="GovtID_Type"
          value={user.GovtID_Type}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        >
          {govtIDOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        {/* ID Number */}
        <TextField
          label="ID Number"
          name="ID_Number"
          type="number"
          value={user.ID_Number}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        {/* Category */}
        <TextField
          select
          label="Category"
          name="Category"
          value={user.Category}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        >
          {categoryOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        {/* Load Applied */}
        <TextField
          label="Load Applied (KV)"
          name="Load_Applied"
          type="number"
          value={user.Load_Applied}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        {/* Date of Application */}
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <DatePicker
              selected={user.Date_of_Application}
              onChange={handleDateChange}
              placeholderText="Date of Applicant"
              dateFormat="dd/MM/yyyy"
              required
              fullWidth
              isClearable
              customInput={<TextField variant="outlined" label="Date of Applicant" fullWidth />}
          />
        </div>
        
        {/* Status */}
        <TextField
          select
          label="Status"
          name="Status"
          value={user.Status}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        >
          {statusOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        {/* Reviewer ID */}
        <TextField
          label="Reviewer ID"
          name="Reviewer_ID"
          type="number"
          value={user.Reviewer_ID}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        {/* Reviewer Name */}
        <TextField
          label="Reviewer Name"
          name="Reviewer_Name"
          value={user.Reviewer_Name}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        {/* Reviewer Comments */}
        <TextField
          label="Reviewer Comments"
          name="Reviewer_Comments"
          value={user.Reviewer_Comments}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        {/* Submit Button */}
        <Button variant="contained" color="primary" type="submit" style={{ marginTop: '20px' }}>
          Add User
        </Button>
      </form>
    </div>
  );
};

export default AddUser;
