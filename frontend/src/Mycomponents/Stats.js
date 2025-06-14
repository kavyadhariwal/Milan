import React, { useEffect, useState } from 'react';
import { Legend } from 'recharts';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import './Stats.css';

const COLORS = ['#0088FE', '#00C49F'];

export default function Stats() {
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/stats/')
      .then(response => response.json())
      .then(data => {
        setPieData([
          { name: 'Missing', value: data.missing },
          { name: 'Reunited', value: data.reunited }
        ]);

        const ageData = [];
        for (const group in data.age_groups) {
          ageData.push({ ageGroup: group, count: data.age_groups[group] });
        }
        setBarData(ageData);
      })
      .catch(error => {
        console.error('Error fetching stats:', error);
      });
  }, []);

  return (
    <div className="stats-container">
      <div className="chart-box">
        <h4>Reports</h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-box">
        <h4>Missing by Age Group</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ageGroup" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
