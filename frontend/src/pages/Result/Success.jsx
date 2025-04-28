import React from 'react';
import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

const Success= () => (
  <Result
  style={{marginTop:205}}
    status="success"
    title="Purchase Successful!"
    subTitle=""
    extra={[
      <Link to="/" key="home">
        <Button type="primary">Go To Home</Button>
      </Link>,
      <Link to="/dashboard/orders" key="orders">
        <Button>Go To Orders</Button>
      </Link>
    ]}
  />
);

export default Success;
