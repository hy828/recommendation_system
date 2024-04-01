import * as React from 'react';
import { Box, CssBaseline, Paper, Typography, Grid, Table, TableBody, TableCell, TableHead, TableRow, TableContainer } from '@mui/material';
import NavigationBar from './NavigationBar';
import { useLocation } from 'react-router-dom';

function Details({ customerDetails }) {
  return (
    <Grid container spacing={1}>
      {customerDetails.map(([key, value]) => (
        <Grid key={key} item xs={3}>
          <Typography variant="body1">
            <strong>{key}: </strong>{value}
          </Typography>
        </Grid>
      ))}
    </Grid>
  )
  
}

export default function CustomerDetail() {
  const location = useLocation();
  const id = location.state.id;
  const [customerDetails, setCustomerDetails] = React.useState({});
  const [recommendationResult, setRecommendationResult] = React.useState({});
  const [serviceRecords, setServiceRecords] = React.useState([]);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    console.log(id)
    try {
      const query = id;
      const response = await fetch('http://127.0.0.1:5000/customerDetail/queryDetails?query=' + encodeURIComponent(query))
      if (!response.ok) {
        throw new Error('无法获取用户数据');
      }
      const data = await response.json();
      const serviceRecords = data.serviceRecords
      // const recommendations = data.recommendations
      const details = data.details
      setServiceRecords(serviceRecords); 
      // setRecommendationResult(recommendations);
      setCustomerDetails(details);
    } catch (error) {
      console.error('用户数据获取失败:', error);
    }
  };

  return (
    <Box>
      <CssBaseline />
      <NavigationBar />
      <Box sx={{ mx: 10, pt: 12 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7} lg={8}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 270,
              }}
            >
              <Details customerDetails={Object.entries(customerDetails)}/>
            </Paper>
          </Grid>
          <Grid item xs={12} md={5} lg={4}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 270,
              }}
            >
              {/* <Deposits /> */}
            </Paper>
          </Grid>
          <Grid item xs={12}>
            {/* <Paper 
              sx={{ 
                p: 2, 
                display: 'flex', 
                flexDirection: 'column',
                height: 330,
              }}
            >
              
            </Paper> */}
            <TableContainer 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                height: 300, 
              }} 
              component={Paper}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>日期</TableCell>
                    <TableCell>负责人</TableCell>
                    <TableCell>产品功能</TableCell>
                    <TableCell>内容</TableCell>
                    <TableCell>结果</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {serviceRecords.map((row) => (
                    <TableRow key={row.sid}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.product}</TableCell>
                      <TableCell>{row.content}</TableCell>
                      <TableCell>{row.result}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}