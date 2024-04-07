import * as React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Stack, Button, Box, CssBaseline, Table, TableBody, TableCell, TableHead, TableRow, Paper, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, MenuItem, Typography, TableContainer, List, ListItem, ListItemButton, ListItemText, Autocomplete } from '@mui/material';
import NavigationBar from './NavigationBar';

function AddDialog({ open, handleClose, products, customers, fetchData }) {
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  const name = localStorage.getItem("name");

  const [cid, setCid] = React.useState(null);
  const [pid, setPid] = React.useState(null);
  const [result, setResult] = React.useState(null);

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

  // React.useEffect(() => {console.log(result)}, []);

  const handleSubmit = async (event) => {
    event.preventDefault(); // 阻止表单默认提交行为
    const formData = new FormData(event.currentTarget); // 获取表单数据
    const date = formData.get('date');
    const content = formData.get('content');

    console.log(date, cid, pid, content, result);
      const response = await fetch('http://127.0.0.1:5000/customerService/addRecord', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem("token")
        },
        body: JSON.stringify({
          'date': date,
          'cid': cid,
          'pid': pid,
          'content': content,
          'result': result,
        }),
      });
      const responseData = await response.json();
      if (response.ok) {
        console.log('记录添加成功');
        fetchData();
        handleClose();
        window.alert(responseData.message);
      } else {
        console.log('记录添加失败');
        window.alert(responseData.message);
      }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ component: 'form', onSubmit: handleSubmit }}>
      <DialogTitle>添加记录</DialogTitle>
      <DialogContent>
        <Grid container columnSpacing={3} rowSpacing={1}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              margin="dense"
              name="date"
              label="日期"
              type="date"
              variant="standard"
              defaultValue={formattedDate}
            />
          </Grid>
          <Grid item xs={8}>
            <Autocomplete
              disablePortal
              fullWidth
              ListboxProps={{ style: { maxHeight: 150 } }}
              options={customers}
              onChange={(event, option) => option ? setCid(option.id) : null}
              renderInput={(params) => 
              <TextField {...params} 
                required
                name="customerName"
                margin="dense"
                label="客户名称"
                variant="standard"/>}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField 
              required 
              fullWidth 
              margin="dense"
              name="username"
              label="负责人" 
              type="text" 
              variant="standard" 
              InputProps={{ readOnly: true }} 
              defaultValue={name} 
            />
          </Grid>
          <Grid item xs={8}>
            <Autocomplete
              disablePortal
              fullWidth
              ListboxProps={{ style: { maxHeight: 150 } }}
              options={products}
              onChange={(event, option) => option ? setPid(option.id) : null}
              getOptionKey={(option) => option.id}
              renderInput={(params) => 
              <TextField {...params} 
                required
                name="product"
                margin="dense"
                label="产品"
                variant="standard"/>}
            />
          </Grid>
          <Grid item xs={4}>
            <Autocomplete
              disablePortal
              fullWidth
              ListboxProps={{ style: { maxHeight: 150 } }}
              options={resultOptions}
              onChange={(event, option) => option ? setResult(option.value) : null}
              renderInput={(params) => 
              <TextField {...params}
                name="result"
                margin="dense"
                label="结果"
                variant="standard"/>}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              margin="dense"
              name="content"
              label="内容"
              type="text"
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

function EditDialog({ open, handleClose, row, fetchData, products, customers, isRequired }) {

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

  const [cid, setCid] = React.useState(row.cid);
  const [pid, setPid] = React.useState(row.pid);
  const [result, setResult] = React.useState(row.result ? (resultOptions.find(option => option.label === row.result)).value : null);
  const name = localStorage.getItem("name");

  // React.useEffect(() => {
  //   console.log(cid);
  // }, []);

  // 向后端发送请求，修改用户权限
  const handleSubmit = async (event) => {
    event.preventDefault(); // 阻止表单默认提交行为
    const formData = new FormData(event.currentTarget); // 获取表单数据
    const date = formData.get('date');
    const content = formData.get('content');

    console.log('date:', date, 'cid:', cid, 'pid:', pid, 'content:', content, 'result:', result);
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
              name="date" 
              label="日期" 
              type="date" 
              variant="standard" 
              defaultValue={row.date}
            />
          </Grid>
          <Grid item xs={8}>
            <Autocomplete
              disablePortal
              fullWidth
              ListboxProps={{ style: { maxHeight: 150 } }}
              options={customers}
              value={row.customerName}
              onChange={(event, option) => option ? setCid(option.id) : null}
              renderInput={(params) => 
              <TextField {...params}
                required
                name="customerName"
                margin="dense"
                label="客户名称"
                variant="standard"/>}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField 
              required 
              fullWidth 
              margin="dense"
              name="username" 
              label="负责人" 
              type="text" 
              variant="standard" 
              InputProps={{ readOnly: true }} 
              defaultValue={name} 
            />
          </Grid>
          <Grid item xs={8}>
            <Autocomplete
              disablePortal
              fullWidth
              ListboxProps={{ style: { maxHeight: 150 } }}
              options={products}
              defaultValue={row.product}
              onChange={(event, option) => option ? setPid(option.id) : null}
              renderInput={(params) => 
              <TextField {...params} 
                required
                name="product"
                margin="dense"
                label="产品"
                variant="standard"/>}
            />
          </Grid>
          <Grid item xs={4}>
            <Autocomplete
              disablePortal
              fullWidth
              ListboxProps={{ style: { maxHeight: 150 } }}
              options={resultOptions}
              onChange={(event, option) => option ? setResult(option.value) : null}
              defaultValue={row.result}
              renderInput={(params) => 
              <TextField {...params} 
                required={isRequired}
                name="result"
                margin="dense"
                label="结果"
                variant="standard"/>}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField 
              fullWidth 
              multiline 
              rows={2} 
              margin="dense"
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

function ConfirmDialog({ open, handleClose, row, fetchData }) {
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
      fetchData();
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
  const [customerData, setCustomerData] = React.useState([]);

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

      const response3 = await fetch('http://127.0.0.1:5000/customerService/queryCustomers');
      if (!response.ok) {
        throw new Error('无法获取用户数据');
      }
      const data3 = await response3.json();
      const customers = data3.customers
      setCustomerData(customers);
      // console.log(customerData);
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
          <AddDialog open={openAddDialog} handleClose={handleCloseAddDialog} fetchData={fetchData} products={productOptions} customers={customerData}/>
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
                        <ConfirmDialog open={openConfirmDialog} handleClose={handleCloseConfirmDialog} row={selectedRecord} fetchData={fetchData}/>
                      </Box>
                  </TableCell>
                  <TableCell align="right">
                      <Box>
                        <Button variant="text" onClick={() => handleOpenEditDialog(row)}>修改</Button>
                        <EditDialog open={openEditDialog} handleClose={handleCloseEditDialog} row={selectedRecord} fetchData={fetchData} products={productOptions} customers={customerData} isRequired={false}/>
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
                        <ConfirmDialog open={openConfirmDialog} handleClose={handleCloseConfirmDialog} row={selectedRecord} fetchData={fetchData}/>
                      </Box>
                  </TableCell>
                  <TableCell align="right">
                      <Box>
                        <Button variant="text" onClick={() => handleOpenEditDialog(row)}>修改</Button>
                        <EditDialog open={openEditDialog} handleClose={handleCloseEditDialog} row={selectedRecord} fetchData={fetchData} products={productOptions} customers={customerData} isRequired={true} />
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