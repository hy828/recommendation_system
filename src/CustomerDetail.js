import * as React from 'react';
import { Box, CssBaseline, Paper, Typography, Grid, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Chip, Stack } from '@mui/material';
import NavigationBar from './NavigationBar';
import { useLocation } from 'react-router-dom';

function Details({ customerDetails }) {
  const basicInfo = ['注册资本', '成立天数', '行业门类', '从业人数', '企业规模', '企业规模名称', '客户类型', '客户数量', '供应商数量', '信用等级', '纳税人状态代码', '增值纳税人类型'];
  return (
    <Grid container rowSpacing={3}>
      {customerDetails.map(([key, value]) => {
        if (basicInfo.includes(key)) {
          return (
            <Grid key={key} item xs={2} sx={{ flexDirection: 'row' }}>
              <Typography variant="subtitle2" color='primary.main' fontWeight='700'>{key}</Typography>
              <Typography variant="body1">{value}</Typography>
            </Grid>
          );
        }
        return null; // Render nothing if the key is not in basicInfo
      })}
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

  const getChipColor = (membershipType) => {
    switch (membershipType) {
      case 'VIP':
        return 'success';
      case '非VIP':
        return 'default';
      case '过期VIP':
        return 'error';
    }
  };

  return (
    <Box>
      <CssBaseline />
      <NavigationBar />
      <Box sx={{ ml: 30, my: 3, mr: 5 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7} lg={8}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: 330,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                {customerDetails['客户名称']}
                <Chip label={customerDetails['会员类型']} variant="outlined" size='small' color={getChipColor(customerDetails['会员类型'])} sx={{ ml: 2 }}/>
              </Typography>
              <Details customerDetails={Object.entries(customerDetails)}/>
              {/* <Typography>客户类型：{customerDetails['客户类型']}</Typography>
              <Typography>企业规模名称：{customerDetails['企业规模名称']}</Typography>
              <Typography>企业规模：{customerDetails['企业规模']}</Typography>
              <Typography>注册资本：{customerDetails['注册资本']}</Typography>
              <Typography>从业人数：{customerDetails['从业人数']}</Typography>
              <Typography>成立天数：{customerDetails['成立天数']}</Typography>
              <Typography>行业门类：{customerDetails['行业门类']}</Typography> */}
            </Paper>
          </Grid>
          <Grid item xs={12} md={5} lg={4}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 330,
              }}
            >
              <Typography>功能推荐</Typography>
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
                height: 320, 
              }} 
              component={Paper}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ "& th": { color: "white", backgroundColor: "secondary.main" } }}>
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