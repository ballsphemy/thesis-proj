import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card } from 'react-bootstrap';
import { useGetSalesAnalyticsMutation, useGetUserAnalyticsMutation, useGetHighestReviewedProductMutation, useGetOrderStatsMutation, useGetProductStatsMutation } from '../../slices/analyticsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AnalyticsDashboard = () => {
  const [salesData, setSalesData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [highestReviewedProducts, setHighestReviewedProducts] = useState(null);
  const [orderStats, setOrderStats] = useState(null);
  const [productStats, setProductStats] = useState(null);

  const [getSalesAnalytics, { isLoading: isLoadingSales, error: errorSales }] = useGetSalesAnalyticsMutation();
  const [getUserAnalytics, { isLoading: isLoadingUsers, error: errorUsers }] = useGetUserAnalyticsMutation();
  const [getHighestReviewedProduct, { isLoading: isLoadingProducts, error: errorProducts }] = useGetHighestReviewedProductMutation();
  const [getOrderStats, { isLoading: isLoadingOrders, error: errorOrders }] = useGetOrderStatsMutation();
  const [getProductStats, { isLoading: isLoadingProductStats, error: errorProductStats }] = useGetProductStatsMutation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salesRes = await getSalesAnalytics().unwrap();
        setSalesData(salesRes);

        const userRes = await getUserAnalytics().unwrap();
        setUserData(userRes);

        const productsRes = await getHighestReviewedProduct().unwrap();
        setHighestReviewedProducts(Array.isArray(productsRes) ? productsRes : [productsRes]);

        const orderRes = await getOrderStats().unwrap();
        setOrderStats(orderRes);

        const productStatsRes = await getProductStats().unwrap();
        setProductStats(productStatsRes);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (isLoadingSales || isLoadingUsers || isLoadingProducts || isLoadingOrders || isLoadingProductStats) {
    return <Loader />;
  }

  if (errorSales || errorUsers || errorProducts || errorOrders || errorProductStats) {
    return <Message variant='danger'>Error loading dashboard data</Message>;
  }

  const dailySalesChart = (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={salesData?.dailySales}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="_id" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="total" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );

  const orderStatusPieChart = (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={[
            { name: 'Paid', value: orderStats?.totalPaidOrders },
            { name: 'Unpaid', value: orderStats?.totalOrders - orderStats?.totalPaidOrders },
          ]}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {
            [0, 1].map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
          }
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  const productCategoryPieChart = (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={productStats?.categoryCounts}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="count"
        >
          {
            productStats?.categoryCounts.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
          }
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <div className="dashboard">
      <h1 className="my-3">Dashboard</h1>
      <Row>
        <Col md={3}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Total Sales</Card.Title>
              <Card.Text>${salesData?.totalSales[0]?.total.toFixed(2)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <Card.Text>{userData?.totalUsers}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Total Orders</Card.Title>
              <Card.Text>{orderStats?.totalOrders}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Total Products</Card.Title>
              <Card.Text>{productStats?.totalProducts}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Daily Sales</Card.Title>
              {dailySalesChart}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Status</Card.Title>
              {orderStatusPieChart}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Product Categories</Card.Title>
              {productCategoryPieChart}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Highest Rated Products</Card.Title>
              {highestReviewedProducts?.map((product, index) => (
                <div key={index}>
                  <Link to={`/product/${product._id}`}>
                    {product.name} - {product.rating} stars ({product.numReviews} reviews)
                  </Link>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AnalyticsDashboard;
