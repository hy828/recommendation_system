import * as React from 'react';
import { Stack, Button, Box, CssBaseline, Table, TableBody, TableCell, TableHead, TableRow, Paper, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography, TableContainer, Autocomplete, TableSortLabel, Chip } from '@mui/material';
import NavigationBar from './NavigationBar';
import { visuallyHidden } from '@mui/utils';

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

    // console.log(date, cid, pid, content, result);
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
  const [state, setState] = React.useState({
    openAddDialog: false,
    openEditDialog: false,
    openConfirmDialog: false,
    selectedRecord: [],
    productOptions: [],
    futureRecords: [],
    historyRecords: [],
    customerData: [],
    table1: { order: 'asc', orderBy: 'id' },
    table2: { order: 'asc', orderBy: 'id' },
  });

  const headCells = {
    table1: [
      { id: 'date', label: '日期' },
      { id: 'customerName', label: '客户名称' },
      { id: 'product', label: '产品功能' },
    ],
    table2: [
      { id: 'date', label: '日期' },
      { id: 'customerName', label: '客户名称' },
      { id: 'product', label: '产品功能' },
      { id: 'result', label: '结果' },
      { id: 'content', label: '内容' },
    ],
  };

  const onRequestSort = (tableKey, property) => {
    const isAsc = state[tableKey].orderBy === property && state[tableKey].order === 'asc';
    setState({ ...state, [tableKey]: { ...state[tableKey], order: isAsc ? 'desc' : 'asc', orderBy: property } });
  };

  const createSortHandler = (tableKey, property) => () => {
    onRequestSort(tableKey, property);
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

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const sortedRows = React.useMemo(() => ({
    futureRecords: stableSort(state.futureRecords, getComparator(state.table1.order, state.table1.orderBy)),
    historyRecords: stableSort(state.historyRecords, getComparator(state.table2.order, state.table2.orderBy)),
  }), [state.futureRecords, state.historyRecords, state.table1, state.table2]);
  
  const handleDialogToggle = (row, dialogName, isOpen) => () => {
    setState(prevState => ({
      ...prevState,
      selectedRecord: row,
      [dialogName]: isOpen,
    }));
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

      const response2 = await fetch('http://127.0.0.1:5000/dataVisualization/getProductOptions');
      if (!response.ok) {
        throw new Error('无法获取用户数据');
      }
      const data2 = await response2.json();
      const products = data2.products;

      const response3 = await fetch('http://127.0.0.1:5000/customerService/queryCustomers');
      if (!response.ok) {
        throw new Error('无法获取用户数据');
      }
      const data3 = await response3.json();
      const customers = data3.customers

      setState(prevState => ({
        ...prevState,
        historyRecords: history,
        futureRecords: future,
        productOptions: products,
        customerData: customers,
      }));
    } catch (error) {
      console.error('用户数据获取失败:', error);
    }
  };

  const renderResultChip = (result) => {
    let chipColor = 'error';
    let label = '待补充';

    switch (result) {
      case '无意向':
        chipColor = 'info';
        label = '无意向';
        break;
      case '有意向':
        chipColor = 'error';
        label = '有意向';
        break;
      case '已购买':
        chipColor = 'success';
        label = '已购买';
        break;
      default:
        chipColor = 'warning';
        label = '待补充';
        break;
    }

    return <Chip label={label} color={chipColor} />;
  };

  return (
    <Box>
      <CssBaseline />
      <NavigationBar />
      <Box sx={{ mx: 10, pt: 12 }}>
        <Stack direction="row" sx={{ mb: 2, flexGrow: 1 }}>
          <Typography variant='h6' sx={{ flexGrow: 1 }}>待办事项</Typography>
          <Button variant="contained" onClick={handleDialogToggle([], 'openAddDialog', true)}>添加记录</Button>
          <AddDialog open={state.openAddDialog} handleClose={handleDialogToggle([], 'openAddDialog', false)} fetchData={fetchData} products={state.productOptions} customers={state.customerData}/>
        </Stack>
        <TableContainer sx={{ maxHeight: 250 }} component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {headCells.table1.map((headCell) => (
                  <TableCell key={headCell.id}>
                    <TableSortLabel
                      active={state.table1.orderBy === headCell.id}
                      direction={state.table1.orderBy === headCell.id ? state.table1.order : 'asc'}
                      onClick={createSortHandler('table1', headCell.id)}
                    >
                      {headCell.label}
                      {state.table1.orderBy === headCell.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {state.table1.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRows.futureRecords.map((row) => (
                <TableRow key={row.sid}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.customerName}</TableCell>
                  <TableCell>{row.product}</TableCell>
                  <TableCell align="right">
                        <Button variant="text" onClick={() => { handleDialogToggle(row, 'openConfirmDialog', true)(); }}>删除</Button>
                  </TableCell>
                  <TableCell align="right">
                        <Button variant="text" onClick={() => { handleDialogToggle(row, 'openEditDialog', true)(); }}>修改</Button>
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
                {headCells.table2.map((headCell) => (
                  <TableCell key={headCell.id}>
                    <TableSortLabel
                      active={state.table2.orderBy === headCell.id}
                      direction={state.table2.orderBy === headCell.id ? state.table2.order : 'asc'}
                      onClick={createSortHandler('table2', headCell.id)}
                    >
                      {headCell.label}
                      {state.table2.orderBy === headCell.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {state.table2.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRows.historyRecords.map((row) => (
                <TableRow key={row.sid}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.customerName}</TableCell>
                  <TableCell>{row.product}</TableCell>
                  <TableCell>
                    {row.result ? (
                      renderResultChip(row.result)
                    ) : (
                      renderResultChip('待补充')
                    )}
                  </TableCell>
                  <TableCell>{row.content}</TableCell>
                  <TableCell align="right">
                        <Button variant="text" onClick={() => { handleDialogToggle(row, 'openConfirmDialog', true)(); }}>删除</Button>
                  </TableCell>
                  <TableCell align="right">
                        <Button variant="text" onClick={() => { handleDialogToggle(row, 'openEditDialog', true)(); }}>修改</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <ConfirmDialog
          open={state.openConfirmDialog}
          handleClose={handleDialogToggle([], 'openConfirmDialog', false)}
          row={state.selectedRecord}
          fetchData={fetchData}
        />
        <EditDialog 
          open={state.openEditDialog} 
          handleClose={handleDialogToggle([], 'openEditDialog', false)} 
          row={state.selectedRecord} 
          fetchData={fetchData} 
          products={state.productOptions} 
          customers={state.customerData} 
          isRequired={true}/>
      </Box>
    </Box>
  );
}