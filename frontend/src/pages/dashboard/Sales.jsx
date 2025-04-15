import React, { useEffect, useState } from 'react';
import { Checkbox, Row, Col, Card, Statistic, DatePicker } from 'antd';
import dayjs from 'dayjs';
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
  const [selectedMonth, setSelectedMonth] = useState(null); 

  const fetchSalesData = async (month = null) => {
    setLoading(true);
    try {
      const params = {};
      if (month) {
        params.month = month.format("MM");
        params.year = month.format("YYYY");
      }

      const response = await axios.get(`/sales`, { params });

      const data = response?.data.data;
      if (Array.isArray(data)) {
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

  useEffect(() => {
    fetchSalesData(selectedMonth);
  }, [selectedMonth]);

  const handleMonthChange = (date) => {
    setSelectedMonth(date); 
  };

  const onChange = (values) => {
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

  const totalRevenue = revenueData.reduce((acc, curr) => acc + curr, 0);
  const totalOrders = ordersData.reduce((acc, curr) => acc + curr, 0);

  return (
    <Card title="Monthly Sales" loading={loading}>
      <DatePicker
        picker="month"
        allowClear={true}
        value={selectedMonth}
        onChange={handleMonthChange}
        format="YYYY/MM"
        style={{ marginBottom: 20 }}
        placeholder="Select month (optional)"
      />

      <Checkbox.Group style={{marginLeft: 20}}
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

      <ResponsiveContainer width="100%" height={600}>
  <LineChart 
    data={chartData} 
    margin={{ top: 20, right: 20, left: 20, bottom: 50 }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis 
      dataKey="date"
      angle={-45}
      textAnchor="end"
      height={60}
      tick={{ fontSize: 12 }}
      tickFormatter={(value) => dayjs(value).format('D MMM')}
    />
    <YAxis yAxisId="left" stroke="#1890ff" />
    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
    <Tooltip 
      formatter={(value, name) => [
        name === 'revenue' ? `$${value}` : value,
        name === 'revenue' ? 'Revenue' : 'Orders'
      ]}
      labelFormatter={(label) => dayjs(label).format('DD MMM YYYY')}
    />
    <Legend />
    {checkedValues.includes('revenue') && (
      <Line 
        yAxisId="left" 
        name="Revenue"
        type="monotone" 
        dataKey="revenue" 
        stroke="#1890ff" 
        activeDot={{ r: 8 }} 
      />
    )}
    {checkedValues.includes('orders') && (
      <Line 
        yAxisId="right" 
        name="Orders"
        type="monotone" 
        dataKey="orders" 
        stroke="#82ca9d" 
      />
    )}
  </LineChart>
</ResponsiveContainer>
    </Card>
  );
}
