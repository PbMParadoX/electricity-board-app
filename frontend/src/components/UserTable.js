// src/components/UserTable.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { Button, TextField, Grid, Box, Grid2 } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parse, isWithinInterval } from 'date-fns';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // Customize your primary color
    },
    secondary: {
      main: '#f50057', // Customize your secondary color
    },
  },
});

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [searchID, setSearchID] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [searchID, startDate, endDate, users]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      const fetchedUsers = response.data.map((user) => {
        let parsedDate;
        try {
          parsedDate = parse(user.Date_of_Application, 'dd/MM/yy', new Date());
          if (isNaN(parsedDate)) throw new Error('Invalid Date');
        } catch (error) {
          console.error(`Error parsing Date_of_Application for user ID ${user.ID}:`, error);
          parsedDate = new Date(); // Fallback to current date
        }

        return {
          ...user,
          parsedDate,
          Date_of_Application_Display: parsedDate.toLocaleDateString('en-GB'),
        };
      });
      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users. Please try again later.');
    }
  };

  const handleFilter = () => {
    let tempUsers = [...users];

    // Filter by Applicant ID
    if (searchID) {
      tempUsers = tempUsers.filter((user) =>
        user.ID.toString().includes(searchID)
      );
    }

    // Filter by Date of Application
    if (startDate && endDate) {
      tempUsers = tempUsers.filter((user) =>
        isWithinInterval(user.parsedDate, { start: startDate, end: endDate })
      );
    } else if (startDate) {
      tempUsers = tempUsers.filter((user) => user.parsedDate >= startDate);
    } else if (endDate) {
      tempUsers = tempUsers.filter((user) => user.parsedDate <= endDate);
    }

    setFilteredUsers(tempUsers);
  };

  const columns = [
    { field: 'ID', headerName: 'ID', width: 70 },
    { field: 'Applicant_Name', headerName: 'Applicant Name', width: 120 },
    { field: 'Gender', headerName: 'Gender', width: 100 },
    { field: 'District', headerName: 'District', width: 80 },
    { field: 'State', headerName: 'State', width: 80 },
    { field: 'Pincode', headerName: 'Pincode', width: 100 },
    { field: 'Ownership', headerName: 'Ownership', width: 100 },
    { field: 'GovtID_Type', headerName: 'Govt ID Type', width: 100 },
    { field: 'Category', headerName: 'Category', width: 120 },
    { field: 'Load_Applied', headerName: 'Load (KV)', width: 90 },
    {
      field: 'Date_of_Application_Display',
      headerName: 'Date of Application',
      width: 150,
    },
    { field: 'Status', headerName: 'Status', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <Link to={`/edit/${params.row.ID}`} style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{ marginRight: 8 }}
            >
              Edit
            </Button>
          </Link>
          {params.row.Status.toLowerCase() === 'rejected' && (
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => handleDelete(params.row.ID)}
            >
              Delete
            </Button>
          )}
        </>
      ),
    },
  ];

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        fetchUsers(); // Refresh the user list after deletion
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete the user. Please try again.');
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ height: 600, width: '97.4%', padding: '20px', height: '380px'}}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Connection Requests</h2>

        {/* Search Bar Section */}
        <Grid2 container spacing={3} style={{ marginBottom: '20px' }}>
          <Grid2 item xs={12}>
            <TextField
              label="Search by Applicant ID"
              variant="outlined"
              value={searchID}
              onChange={(e) => setSearchID(e.target.value)}
              fullWidth
            />
          </Grid2>
        </Grid2>

        {/* Date Filter Section */}
        <Grid2 container spacing={3} style={{ marginBottom: '20px' }}>
          <Grid2 item xs={6} md={3}>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Start Date"
              dateFormat="dd/MM/yyyy"
              isClearable
              customInput={<TextField variant="outlined" label="Start Date" fullWidth />}
            />
          </Grid2>
          <Grid2 item xs={6} md={3}>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="End Date"
              dateFormat="dd/MM/yyyy"
              isClearable
              customInput={<TextField variant="outlined" label="End Date" fullWidth />}
            />
          </Grid2>
        </Grid2>

        {/* Add New User Button Centered */}
        <Box display="flex" justifyContent="center" mb={2}>
          <Link to="/add" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary">
              Add New User
            </Button>
          </Link>
        </Box>

        {/* Data Grid */}
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          getRowId={(row) => row.ID}
          disableSelectionOnClick
        />
      </div>
    </ThemeProvider>
  );
};

export default UserTable;
