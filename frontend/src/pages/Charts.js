// src/pages/Charts.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const Charts = () => {
  const [users, setUsers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    prepareChartData();
  }, [users, selectedStatus]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const prepareChartData = () => {
    const dataMap = {};

    users.forEach((user) => {
      // Filter based on selected status
      if (selectedStatus !== 'All' && user.Status !== selectedStatus) return;

      const [day, month, year] = user.Date_of_Application.split('/');
      const monthYear = `${month}/${year}`;

      if (dataMap[monthYear]) {
        dataMap[monthYear] += 1;
      } else {
        dataMap[monthYear] = 1;
      }
    });

    const dataArray = Object.keys(dataMap).map((key) => ({
      month: key,
      requests: dataMap[key],
    }));

    // Sort by month and year
    dataArray.sort((a, b) => {
      const [monthA, yearA] = a.month.split('/');
      const [monthB, yearB] = b.month.split('/');
      return new Date(`20${yearA}-${monthA}-01`) - new Date(`20${yearB}-${monthB}-01`);
    });

    setChartData(dataArray);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const statusOptions = ['All', 'Pending', 'Approved', 'Rejected'];

  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    preparePieData();
  }, [users]);

  const preparePieData = () => {
    const categoryMap = {};

    users.forEach((user) => {
      const category = user.Category;
      if (categoryMap[category]) {
        categoryMap[category] += 1;
      } else {
        categoryMap[category] = 1;
      }
    });

    const dataArray = Object.keys(categoryMap).map((key) => ({
      name: key,
      value: categoryMap[key],
    }));

    setPieData(dataArray);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div style={{padding: '20px', backgroundColor: '#f5f5f5' }}>
      <h2>Connection Requests Chart</h2>
      <FormControl variant="outlined" style={{ minWidth: 200, marginBottom: '20px' }}>
        <InputLabel>Status</InputLabel>
        <Select value={selectedStatus} onChange={handleStatusChange} label="Status">
          {statusOptions.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="requests" fill="#8884d8" name="Number of Requests" />
        </BarChart>
      </ResponsiveContainer>

      <h2>Connection Categories Distribution</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
    
  );
};

export default Charts;
