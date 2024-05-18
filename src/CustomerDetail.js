import * as React from 'react';
import { Box, CssBaseline, Paper, Typography, Grid, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, TableSortLabel, Chip, Stack, List, ListItem, ListItemText, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField, Link, Collapse } from '@mui/material';
import NavigationBar from './NavigationBar';
import { useLocation } from 'react-router-dom';
import { visuallyHidden } from '@mui/utils';

function ViewDialog({ open, onClose, data }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>客户经理信息</DialogTitle>
      <DialogContent>
        <DialogContentText>姓名：{data.name}</DialogContentText>
        <DialogContentText>性别：{data.gender ? '男' : '女'}</DialogContentText>
        <DialogContentText>电话：{data.phone}</DialogContentText>
        <DialogContentText>邮箱：{data.email}</DialogContentText>
        <DialogContentText>微信号：{data.wechatid}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>关闭</Button>
      </DialogActions>
    </Dialog>
  );
}

function EditDialog({ open, onClose, data, fetchData, id }) {

  const handleSubmit = async (event) => {
    event.preventDefault(); // 阻止表单默认提交行为
    const formData = new FormData(event.currentTarget); // 获取表单数据
    const vip_type = formData.get('vip_type');
    const cyrs = formData.get('cyrs');
    const scale = formData.get('scale');
    const invoice_suppliers = formData.get('invoice_suppliers');
    const credit_rating = formData.get('credit_rating');
    const vat_taxpayer_type = formData.get('vat_taxpayer_type');
    const invoice_customers = formData.get('invoice_customers');
    const khlx = formData.get('khlx');
    const established_days = formData.get('established_days');
    const zczb = formData.get('zczb');
    const nsrzt_dm = formData.get('nsrzt_dm');
    const industry_top = formData.get('industry_top');
    
    const response = await fetch('http://127.0.0.1:5000/customer_management/update_record', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'id': id,
        'data': {
          'vip_type': vip_type,
          'cyrs': cyrs,
          'scale': scale,
          'invoice_suppliers': invoice_suppliers,
          'credit_rating': credit_rating,
          'vat_taxpayer_type': vat_taxpayer_type,
          'invoice_customers': invoice_customers,
          'khlx': khlx,
          'established_days': established_days,
          'zczb': zczb,
          'nsrzt_dm': nsrzt_dm,
          'industry_top': industry_top,
        }
        
      }),
    });
    const responseData = await response.json();
    if (response.ok) {
      console.log(responseData.message);
      fetchData();
      onClose();
      window.alert(responseData.message);
    } else {
      console.log(responseData.message);
      window.alert(responseData.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{
      component: 'form', onSubmit: handleSubmit }}>
      <DialogTitle>编辑客户信息</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <TextField
              fullWidth
              required
              margin="dense"
              name="vip_type"
              label="会员类型"
              select
              variant="standard"
              defaultValue={data['会员类型']}
            >
              {['未知', 'VIP', '过期VIP', '非VIP'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              required
              margin="dense"
              name="cyrs"
              label="从业人数"
              type="number"
              variant="standard"  
              defaultValue={data['从业人数']}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              required
              margin="dense"
              name="scale"
              label="企业规模"
              type="number"
              variant="standard"  
              defaultValue={data['企业规模']}
            />
          </Grid>
          {/* <Grid item xs={3}>
            <TextField
              fullWidth
              required
              margin="dense"
              name="qygmmc"
              label="企业规模名称"
              select
              variant="standard"  
            />
          </Grid> */}
          <Grid item xs={3}>
            <TextField
              fullWidth
              required
              margin="dense"
              name="invoice_suppliers"
              label="供应商数量"
              type="number"
              variant="standard"  
              defaultValue={data['供应商数量']}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              required
              margin="dense"
              name="credit_rating"
              label="信用等级"
              select
              variant="standard"  
              defaultValue={data['信用等级']}
            >
              {['未知', 'A', 'B', 'C', 'D', 'M'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              required
              margin="dense"
              name="vat_taxpayer_type"
              label="增值纳税人类型"
              select
              variant="standard"  
              defaultValue={data['增值纳税人类型']}
            >
              {['未知', '一般纳税人', '小规模纳税人'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              required
              margin="dense"
              name="invoice_customers"
              label="客户数量"
              type="number"
              variant="standard"  
              defaultValue={data['客户数量']}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              required
              margin="dense"
              name="khlx"
              label="客户类型"
              select
              variant="standard"
              defaultValue={data['客户类型']}
            >
              {['单位用户', '个人代理'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              required
              margin="dense"
              name="established_days"
              label="成立天数"
              type="number"
              variant="standard" 
              defaultValue={data['成立天数']} 
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              required
              margin="dense"
              name="zczb"
              label="注册资本"
              type="number"
              variant="standard"  
              defaultValue={data['注册资本']}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              required
              margin="dense"
              name="nsrzt_dm"
              label="纳税人状态代码"
              select
              variant="standard"  
              defaultValue={data['纳税人状态代码']}
            >
              {['未知', '03', '07', '99'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              required
              margin="dense"
              name="industry_top"
              label="行业门类"
              type="text"
              variant="standard"  
              defaultValue={data['行业门类']}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button type="submit">确定</Button>
      </DialogActions>
    </Dialog>
  );
}

function Details({ customerDetails, fetchData, id }) {
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
          return null;
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
  const [expanded, setExpanded] = React.useState(null);
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('date');
  const [viewDialog, setViewDialog] = React.useState({
    open: false,
    data: {},
  });
  const [editDialog, setEditDialog] = React.useState({
    open: false,
    data: {},
  });
  const userPermission = localStorage.getItem("userPermission");

  const headCells = [
    { id: 'date', label: '日期' },
    { id: 'name', label: '负责人' },
    { id: 'product', label: '产品功能' },
    { id: 'content', label: '内容' },
    { id: 'result', label: '结果' }
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
    // console.log(id)
    try {
      const query = id;
      const response = await fetch('http://127.0.0.1:5000/customer_management/query_details?query=' + encodeURIComponent(query))
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

  const handleOpenDialog = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/customer_management/query_user?query=' + encodeURIComponent(customerDetails['当前客户经理']));
      if (!response.ok) {
        throw new Error('无法获取客户经理信息');
      }
      const data = await response.json();
      console.log(data);
      const detail = data.detail;
      console.log(detail);
      setViewDialog({ open: true, data: detail });
    } catch (error) {
      console.error('无法获取客户经理信息:', error);
    }
  }

  const handleEditClick = (key, value) => {
    console.log('Clicked item:', { key, value });
    setEditDialog({ open: true, data: customerDetails })
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
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, display: 'flex' }}>
                {customerDetails['客户名称']}
                <Chip label={customerDetails['会员类型']} variant="outlined" size='small' color={getChipColor(customerDetails['会员类型'])} sx={{ ml: 2, verticalAlign: 'middle' }}/>
                <Box sx={{ flexGrow: 1 }}/>
                {userPermission === '1' && <Button variant='contained' onClick={handleEditClick}>编辑</Button>}
              </Typography>
              <Details customerDetails={Object.entries(customerDetails)} fetchData={fetchData} id={id}/>
            </Paper>
          </Grid>
          <Grid item xs={12} md={5} lg={4}>
            <Paper
              sx={{
                py: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 330
              }}
            >
              <Stack direction='row' sx={{ px: 2 }}>
                <Typography variant='h6' color='primary.main' sx={{ fontWeight: 600, mr: 14, mb: 1 }}>产品推荐</Typography>
                <Typography variant='subtitle2' sx={{ pt: 0.5, mb: 1 }}>最近一次更新：{recommendationResult.date}</Typography>
              </Stack>
              <List sx={{ overflowY: 'auto' }}>
                {Object.entries(recommendationResult).map(([key, value]) => (
                  key != 'date' && (
                  <React.Fragment key={key}>
                    <ListItem button onClick={() => setExpanded(expanded === key ? null : key)}>
                      <ListItemText primary={`${key.slice(3)}. ${value.name}`} />
                    </ListItem>
                    <Collapse in={expanded === key} timeout="auto" unmountOnExit sx={{ px: 2 }}>
                      <Typography color='green' fontWeight='700' variant='body2' component='div'>{value.similarity}企业已使用此产品，其中有{value.similarity2}企业规模相同</Typography>
                      <Typography variant='body2' component='div'>{value.description}</Typography>
                    </Collapse>
                  </React.Fragment>
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
              <Link component='button' underline='none' variant='body1' sx={{ mr: 10, p: 0, color: 'black' }} onClick={handleOpenDialog}>{customerDetails['当前客户经理']}</Link>
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
                      <TableCell>
                        <Link component='button' underline='none' variant='body2' sx={{ m: 0, p: 0, color: 'black' }} onClick={handleOpenDialog}>{row.name}</Link>
                      </TableCell>
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
        <ViewDialog open={viewDialog.open} onClose={() => setViewDialog({ open: false, data: {} })} data={viewDialog.data}/>
        <EditDialog open={editDialog.open} onClose={() => setEditDialog({ open: false, data: {} })} data={editDialog.data} fetchData={fetchData} id={id}/>
      </Box>
    </Box>
  )
}