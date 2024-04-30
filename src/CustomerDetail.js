import * as React from 'react';
import { Box, CssBaseline, Paper, Typography, Grid, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, TableSortLabel, Chip, Stack, List, ListItem, ListItemText } from '@mui/material';
import NavigationBar from './NavigationBar';
import { useLocation } from 'react-router-dom';
import { visuallyHidden } from '@mui/utils';

function Details({ customerDetails }) {
  const basicInfo = ['注册资本', '成立天数', '行业门类', '从业人数', '企业规模', '企业规模名称', '客户类型', '客户数量', '供应商数量', '信用等级', '纳税人状态代码', '增值纳税人类型'];
  const otherInfo = ['企税风险', '最近个税实际申报人数', '月均进项票量', '月均销项票量', '进项发票风险', '销项发票风险'];
  return ( // 
    <Box>
      <Grid container rowSpacing={3} sx={{ mb: 1.5 }}>
        {customerDetails.map(([key, value]) => {
          if (basicInfo.includes(key)) {
            return (
              <Grid key={key} item xs={2} sx={{ flexDirection: 'row' }}>
                <Typography variant="subtitle2" color='secondary.main' fontWeight='700'>{key}</Typography>
                <Typography variant="body1">{value}</Typography>
              </Grid>
            );
          }
          return null; // Render nothing if the key is not in basicInfo
        })}
      </Grid>
      <Grid container rowSpacing={2}>
        {customerDetails.map(([key, value]) => {
          if (otherInfo.includes(key)) {
            return (
              <Grid key={key} item xs={4} sx={{ flexDirection: 'row' }}>
                <Typography variant="subtitle2" color='secondary.main' fontWeight='700'>{key}</Typography>
                <Typography variant="body1">{value}</Typography>
              </Grid>
            );
          }
          return null; // Render nothing if the key is not in basicInfo
        })}
      </Grid>
    </Box>
  )
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default function CustomerDetail() {
  const location = useLocation();
  const id = location.state.id;
  const [customerDetails, setCustomerDetails] = React.useState({});
  const [recommendationResult, setRecommendationResult] = React.useState({});
  const [serviceRecords, setServiceRecords] = React.useState([]);
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('date');

  const headCells = [
    {
      id: 'date',
      label: '日期',
    },
    {
      id: 'name',
      label: '负责人',
    },
    {
      id: 'product',
      label: '产品功能',
    },
    {
      id: 'content',
      label: '内容',
    },
    {
      id: 'result',
      label: '结果',
    }
  ]

  const onRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const visibleRows = React.useMemo(
    () =>
      stableSort(serviceRecords, getComparator(order, orderBy)),
    [order, orderBy, serviceRecords],
  );

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    console.log(id)
    try {
      const query = id;
      const response = await fetch('http://127.0.0.1:5000/customer_detail/query_details?query=' + encodeURIComponent(query))
      if (!response.ok) {
        throw new Error('无法获取用户数据');
      }
      const data = await response.json();
      const serviceRecords = data.serviceRecords
      const recommendations = data.recommend
      const details = data.details
      setServiceRecords(serviceRecords); 
      setRecommendationResult(recommendations);
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
        <Grid container spacing={2}>
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
              <Stack direction='row'>
                <Typography variant='h6' color='primary.main' sx={{ fontWeight: 600, mr: 14, mb: 1 }}>功能推荐</Typography>
                <Typography variant='subtitle2' sx={{ pt: 0.5, mb: 1 }}>最近一次更新：{recommendationResult.date}</Typography>
              </Stack>
              <List>
                {/* Render five fixed items */}
                {Object.entries(recommendationResult).map(([key, value]) => (
                  key != 'date' && (
                  <ListItem key={key}>
                    <ListItemText primary={`${key.slice(3)}. ${value}`} />
                  </ListItem>
                )))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Grid container component={Paper} sx={{ height: 40, py: 1, pl: 3 }}>
              <Grid item xs={2}>
              <Typography color='primary.main' sx={{ fontWeight: 600, mr: 1 }}>客户累计付费金额</Typography>
              </Grid>
              <Grid item xs={2}>
              <Typography sx={{ mr: 10 }}>{customerDetails['累计付费金额']}元</Typography>
              </Grid>
              <Grid item xs={2}>
              <Typography color='primary.main' sx={{ fontWeight: 600, mr: 1 }}>现任客户经理</Typography>
              </Grid>
              <Grid item xs={2}>
              <Typography sx={{ mr: 10 }}>{customerDetails['当前客户经理']}</Typography>
              </Grid>
              <Grid item xs={2}>
              <Typography color='primary.main' sx={{ fontWeight: 600, mr: 1 }}>现任客户经理持续天数</Typography>
              </Grid>
              <Grid item xs={2}>
              <Typography sx={{ mr: 10 }}>{customerDetails['当前客户经理持续天数']}天</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TableContainer 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                height: 270, 
              }} 
              component={Paper}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {headCells.map((headCell) => (
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === headCell.id}
                          direction={orderBy === headCell.id ? order : 'asc'}
                          onClick={createSortHandler(headCell.id)}
                        >
                          {headCell.label}
                          {orderBy === headCell.id ? (
                            <Box component="span" sx={visuallyHidden}>
                              {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </Box>
                          ) : null}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleRows.map((row) => (
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