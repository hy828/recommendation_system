import * as React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Stack, Button, Box, CssBaseline, Table, TableBody, TableCell, TableHead, TableRow, Paper, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, MenuItem, Typography, TableContainer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import NavigationBar from './NavigationBar';

function AddDialog({ open, handleClose }) {
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ component: 'form' }}>
      <DialogTitle>添加记录</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="date"
              name="date"
              label="日期"
              type="date"
              fullWidth
              variant="standard"
              defaultValue={formattedDate}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="customerName"
              name="customerName"
              label="客户名称"
              type="text"
              fullWidth
              variant="standard"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="username"
              name="username"
              label="负责人"
              type="text"
              fullWidth
              variant="standard"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="item"
              name="item"
              label="事项"
              type="text"
              fullWidth
              variant="standard"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="content"
              name="content"
              label="内容"
              type="text"
              fullWidth
              variant="standard"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="result"
              name="result"
              label="结果"
              type="text"
              fullWidth
              variant="standard"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>取消</Button>
        <Button type="submit">完成</Button>
      </DialogActions>
    </Dialog>
  );
}

function CustomerDialog({ open, onClose, tableData, selectedCustomer }) {

  const handleClose = () => {
    onClose(selectedCustomer);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="xs" fullWidth>
      <DialogTitle>客户</DialogTitle>
      <List sx={{ pt: 0 }}>
        {tableData.map((row) => (
          <ListItem disableGutters key={row.id}>
            <ListItemButton onClick={() => handleListItemClick(row)}>
              <ListItemText primary={row.id} />
              <ListItemText primary={row.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

function EditDialog({ open, handleClose, row, fetchData, products }) {

  const [openDialog, setOpenDialog] = React.useState(false);
  const [customerData, setCustomerData] = React.useState([]);
  const [selectedCustomer, setSelectedCustomer] = React.useState({});


  const resultOptions = [
    {
      value: 0,
      label: '无意向',
    },
    {
      value: 2,
      label: '有意向',
    },
    {
      value: 1,
      label: '已购买',
    },
  ];

  const findResultByLabel = (label) => {
    const result = resultOptions.find(option => option.label === label);
    return result ? result.value : null; // 如果找到匹配的选项，则返回其对应的 value 值，否则返回 null
  };

  // 向后端发送请求，修改用户权限
  const handleSubmit = async (event) => {
    event.preventDefault(); // 阻止表单默认提交行为
    const formData = new FormData(event.currentTarget); // 获取表单数据
    const date = formData.get('date');
    const cid = formData.get('customerName');
    const pid = formData.get('product');
    const content = formData.get('content');
    const result = formData.get('result');

    console.log(date, cid, pid, content, result);
    // try {
    //   const response = await fetch('http://127.0.0.1:5000/customerService/updateRecord', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': localStorage.getItem("token")
    //     },
    //     body: JSON.stringify({
    //       'sid': row.sid,
    //       'date': date,
    //       'cid': cid,
    //       'pid': pid,
    //       'content': content,
    //       'result': result,
    //     }),
    //   });
    //   if (!response.ok) {
    //     throw new Error('更新权限失败');
    //   }
    //   // 更新权限后关闭对话框并触发更新表格的操作
    //   fetchData();
      handleClose();
    // } catch (error) {
    //   console.error('更新权限失败:', error);
    // }
  };

  const handleSearchClick = async () => {
    // 发送请求到后端，获取数据并设置到表格中
    try {
      const response = await fetch('http://127.0.0.1:5000/customerService/queryCustomers');
      if (!response.ok) {
        throw new Error('无法获取用户数据');
      }
      const data = await response.json();
      const customers = data.customers
      setCustomerData(customers);
      console.log(customerData);
      setOpenDialog(true); // 显示 Dialog
    } catch (error) {
      console.error('用户数据获取失败:', error);
    }
  };

  const handleCloseDialog = (row) => {
    setOpenDialog(false);
    setSelectedCustomer(row);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{
        component: 'form', onSubmit: handleSubmit }}>
      <DialogTitle>修改记录</DialogTitle>
      <DialogContent>
        <Grid container columnSpacing={3} rowSpacing={1}>
          <Grid item xs={12}>
            <TextField 
              required 
              fullWidth 
              margin="dense" 
              id="date" 
              name="date" 
              label="日期" 
              type="date" 
              variant="standard" 
              defaultValue={row.date}
            />
          </Grid>
          <Grid item xs={8}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <TextField 
                autoFocus 
                required 
                fullWidth 
                margin="dense" 
                id="customerName" 
                name="customerName" 
                label="客户名称" 
                type="text" 
                variant="standard" 
                defaultValue={row.customerName}
              >
                {selectedCustomer.name}
              </TextField>
              <IconButton onClick={handleSearchClick} sx={{ mr: 1, my: 0.5 }}>
                <SearchIcon />
              </IconButton>
              <CustomerDialog open={openDialog} onClose={handleCloseDialog} tableData={customerData} selectedCustomer={selectedCustomer}/>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <TextField 
              required 
              fullWidth 
              margin="dense" 
              id="username" 
              name="username" 
              label="负责人" 
              type="text" 
              variant="standard" 
              InputProps={{ readOnly: true, }} 
              defaultValue={row.username} 
            />
          </Grid>
          <Grid item xs={8}>
            <TextField 
              required 
              select 
              fullWidth 
              margin="dense"
              id="product" 
              name="product" 
              label="产品" 
              variant="standard" 
              defaultValue={row.pid}
            >
              {(products.map((product) => (
                <MenuItem key={product.id} value={product.id}>{product.name}</MenuItem>
              )))}
            </TextField>
          </Grid>
          <Grid item xs={4}>
            <TextField 
              required 
              select 
              fullWidth 
              margin="dense"
              id="result" 
              name="result" 
              label="结果" 
              variant="standard" 
              defaultValue={findResultByLabel(row.result)}
            >
              {resultOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField 
              fullWidth 
              multiline 
              rows={2} 
              margin="dense" 
              id="content" 
              name="content" 
              label="内容" 
              type="text" 
              variant="standard" 
              defaultValue={row.content} 
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>取消</Button>
        <Button type="submit">完成</Button>
      </DialogActions>
    </Dialog>
  );
}

function ConfirmDialog({ open, handleClose, row }) {
  const sid = row.sid;

  const handleConfirm = async () => {
    const response = await fetch('http://127.0.0.1:5000/customerService/deleteRecord', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sid }),
    });
    const responseData = await response.json();

    if (response.ok) {
      console.log(sid,'记录删除成功');
      handleClose();
      window.alert(responseData.message);
    } else {
      console.log(sid,'记录删除失败');
      window.alert(responseData.message);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>确认删除？</DialogTitle>
        <DialogContent>确定删除该条记录？</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">取消</Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>确定</Button>
        </DialogActions>
      </Dialog>
  );
}

export default function CustomerService() {
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState([]);
  const [productOptions, setProductOptions] = React.useState([]);
  const [futureRecords, setFutureRecords] = React.useState([]);
  const [historyRecords, setHistoryRecords] = React.useState([]);

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleOpenEditDialog = (row) => {
    setSelectedRecord(row);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleOpenConfirmDialog = (row) => {
    setSelectedRecord(row);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/customerService/queryAllRecords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem("token")
      }})
      if (!response.ok) {
        throw new Error('无法获取用户数据');
      }
      const data = await response.json();
      const history = data.history
      const future = data.future
      setHistoryRecords(history); 
      setFutureRecords(future);

      const response2 = await fetch('http://127.0.0.1:5000/dataVisualization/getProductOptions');
      if (!response.ok) {
        throw new Error('无法获取用户数据');
      }
      const data2 = await response2.json();
      const products = data2.products;
      setProductOptions(products);
    } catch (error) {
      console.error('用户数据获取失败:', error);
    }
  };

  return (
    <Box>
      <CssBaseline />
      <NavigationBar />
      <Box sx={{ mx: 10, pt: 12 }}>
        <Stack direction="row" sx={{ mb: 2, flexGrow: 1 }}>
          <Typography variant='h6' sx={{ flexGrow: 1 }}>待办事项</Typography>
          <Button variant="contained" onClick={handleOpenAddDialog}>添加记录</Button>
          <AddDialog open={openAddDialog} handleClose={handleCloseAddDialog} />
        </Stack>
        <TableContainer sx={{ maxHeight: 250 }} component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>日期</TableCell>
                <TableCell>客户名称</TableCell>
                <TableCell>产品功能</TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {futureRecords.map((row) => (
                <TableRow key={row.sid}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.customerName}</TableCell>
                  <TableCell>{row.product}</TableCell>
                  <TableCell align="right">
                      <Box>
                        <Button variant="text" onClick={() => handleOpenConfirmDialog(row)}>删除</Button>
                        <ConfirmDialog open={openConfirmDialog} handleClose={handleCloseConfirmDialog} row={selectedRecord}/>
                      </Box>
                  </TableCell>
                  <TableCell align="right">
                      <Box>
                        <Button variant="text" onClick={() => handleOpenEditDialog(row)}>修改</Button>
                        <EditDialog open={openEditDialog} handleClose={handleCloseEditDialog} row={selectedRecord} fetchData={fetchData} products={productOptions} />
                      </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant='h6' sx={{ my: 2 }}>历史记录</Typography>
        <TableContainer sx={{ maxHeight: 250 }} component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>日期</TableCell>
                <TableCell>客户名称</TableCell>
                <TableCell>产品功能</TableCell>
                <TableCell>内容</TableCell>
                <TableCell>结果</TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historyRecords.map((row) => (
                <TableRow key={row.sid}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.customerName}</TableCell>
                  <TableCell>{row.product}</TableCell>
                  <TableCell>{row.content}</TableCell>
                  <TableCell>{row.result}</TableCell>
                  <TableCell align="right">
                      <Box>
                        <Button variant="text" onClick={() => handleOpenConfirmDialog(row)}>删除</Button>
                        <ConfirmDialog open={openConfirmDialog} handleClose={handleCloseConfirmDialog} row={selectedRecord}/>
                      </Box>
                  </TableCell>
                  <TableCell align="right">
                      <Box>
                        <Button variant="text" onClick={() => handleOpenEditDialog(row)}>修改</Button>
                        <EditDialog open={openEditDialog} handleClose={handleCloseEditDialog} row={selectedRecord} fetchData={fetchData} products={productOptions} />
                      </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}