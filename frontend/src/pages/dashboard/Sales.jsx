import React, { useEffect, useState } from 'react';
import { Checkbox, Row, Col, Card, Statistic } from 'antd';
import axios from '../../axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import CountUp from 'react-countup';

export default function MonthlySales() {
  const [salesData, setSalesData] = useState([]);
  const [checkedValues, setCheckedValues] = useState(['revenue']);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSalesData = async () => {
      
      setLoading(true);

      try {
        const response = await axios.get(`/sales`);


        const data = response?.data.data;
        if (Array.isArray(data)) {
          console.log('📊 Setting sales data:', data);
          setSalesData(data);
        } else {
          console.warn('Unexpected API response format:', response.data);
          setSalesData([]);
        }
      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  const onChange = (values) => {
    console.log('Checkboxxxxx', values);
    setCheckedValues(values);
  };

  const formatter = (value) => <CountUp end={value} separator="," />;
  
  const revenueData = salesData.map(item => item?.totalRevenue || 0);
  const ordersData = salesData.map(item => item?.totalOrders || 0);

  const chartData = salesData.map(item => ({
    date: item.date,
    revenue: item.totalRevenue,
    orders: item.totalOrders,
  }));
  console.log("chart", chartData);

  const totalRevenue = revenueData.reduce((acc, curr) => acc + curr, 0);
  const totalOrders = ordersData.reduce((acc, curr) => acc + curr, 0);

 

  return (
    <Card title="Monthly Sales" loading={loading}>
      <Checkbox.Group
        options={[
          { label: 'Revenue', value: 'revenue' },
          { label: 'Total Orders', value: 'orders' },
        ]}
        value={checkedValues}
        onChange={onChange}
      />

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        {checkedValues.includes('revenue') && (
          <Col span={12}>
            <Statistic title="Total Revenue" value={totalRevenue} precision={2} formatter={formatter} />
          </Col>
        )}
        {checkedValues.includes('orders') && (
          <Col span={12}>
            <Statistic title="Total Orders" value={totalOrders} formatter={formatter} />
          </Col>
        )}
      </Row>
      <ResponsiveContainer width="100%" height={500}>
  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    
   
    <YAxis 
      yAxisId="left"
      stroke="#1890ff" 
      tick={{ fill: '#1890ff' }} 
    />
    
    
    <YAxis 
      yAxisId="right"
      orientation="right"
      stroke="#82ca9d" 
      tick={{ fill: '#82ca9d' }} 
    />
    
    <Tooltip />
    <Legend />
    
    {checkedValues.includes('revenue') && (
      <Line
        yAxisId="left"
        type="monotone"
        dataKey="revenue"
        stroke="#1890ff" // Blue line
        activeDot={{ r: 8 }}
      />
    )}
    
    {checkedValues.includes('orders') && (
      <Line
        yAxisId="right"
        type="monotone"
        dataKey="orders"
        stroke="#82ca9d" // Green line
      />
    )}
  </LineChart>
</ResponsiveContainer>
    </Card>
  );
}
