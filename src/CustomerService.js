import * as React from 'react';
import { createTheme, ThemeProvider, styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { Stack, Button, Box, CssBaseline, InputBase, Table, TableBody, TableCell, TableHead, TableRow, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, MenuItem } from '@mui/material';

const defaultTheme = createTheme();

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  // padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
          width: '20ch',
      },
    },
  },
}));

const today = new Date();
const formattedDate = today.toISOString().split('T')[0];

function RecordDialog({ open, handleClose }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries(formData.entries());
          const email = formJson.email;
          console.log(email);
          handleClose();
        },
      }}
    >
      <DialogTitle>添加跟进记录</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid xs={4}>
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
          <Grid xs={4}>
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
          <Grid xs={4}>
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
          <Grid xs={12}>
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
          <Grid xs={12}>
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
          <Grid xs={12}>
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

function ReminderDialog({ open, handleClose }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries(formData.entries());
          const email = formJson.email;
          console.log(email);
          handleClose();
        },
      }}
    >
      <DialogTitle>添加待办事项</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid xs={4}>
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
          <Grid xs={4}>
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
          <Grid xs={4}>
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
          <Grid xs={12}>
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
          <Grid xs={12}>
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
          <Grid xs={12}>
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

function CustomerDialog({ open, onClose, tableData }) {
  const [selectedRow, setSelectedRow] = React.useState(null);

  const handleRowClick = (row) => {
    setSelectedRow(row);
  };

  const handleClose = () => {
    onClose(selectedRow); // 将选中的行数据传递给 onClose 回调函数
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>客户</DialogTitle>
      <DialogContent>
        <Table stickyHeader >
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>名称</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row) => (
              <TableRow hover key={row.id} onClick={() => handleRowClick(row)} sx={{ cursor: 'pointer' }}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>确定</Button>
        <Button onClick={onClose}>取消</Button>
      </DialogActions>
    </Dialog>
  );
}

function EditDialog({ open, handleClose, row, fetchData }) {

  const [openDialog, setOpenDialog] = React.useState(false);
  const [customerData, setCustomerData] = React.useState([]);
  const [selectedCustomer, setSelectedCustomer] = React.useState(null);

  const resultOptions = [
    {
      value: '无意向',
      label: '无意向',
    },
    {
      value: '有意向',
      label: '有意向',
    },
    {
      value: '已购买',
      label: '已购买',
    },
  ];

  // 向后端发送请求，修改用户权限
  const handleSubmit = async (event) => {
    event.preventDefault(); // 阻止表单默认提交行为
    const formData = new FormData(event.currentTarget); // 获取表单数据
    const date = formData.get('date');
    const cid = formData.get('customername');
    const uid = formData.get('name');
    const pid = formData.get('product');
    const content = formData.get('content');
    const result = formData.get('result');

    try {
      const response = await fetch('http://127.0.0.1:5000/customerService/updateRecord', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'sid': row.sid,
          'date': date,
          'cid': cid,
          'uid': uid,
          'pid': pid,
          'content': content,
          'result': result,
        }),
      });
      if (!response.ok) {
        throw new Error('更新权限失败');
      }
      // 更新权限后关闭对话框并触发更新表格的操作
      fetchData();
      handleClose();
    } catch (error) {
      console.error('更新权限失败:', error);
    }
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
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth PaperProps={{
        component: 'form', onSubmit: handleSubmit }}>
      <DialogTitle>修改记录</DialogTitle>
      <DialogContent>
        <Grid container columnSpacing={8} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Grid item xs={10}>
            <TextField required fullWidth margin="dense" id="date" type="date" variant="standard" />
          </Grid>
          <Grid item xs={5}>
            <Stack direction="row">
              <TextField autoFocus required fullWidth margin="dense" id="customerName" label="客户名称" type="text" variant="standard" defaultValue={row.customername} />
              <IconButton onClick={handleSearchClick}>
                <SearchIcon />
              </IconButton>
              <CustomerDialog open={openDialog} onClose={handleCloseDialog} tableData={customerData} />
            </Stack>
          </Grid>
          <Grid item xs={5}>
            <Stack direction="row">
              <TextField required fullWidth margin="dense" id="username" label="负责人" type="text" variant="standard" defaultValue={row.name} />
              <IconButton>
                <SearchIcon />
              </IconButton>
            </Stack>
          </Grid>
          <Grid item xs={5}>
            <Stack direction="row">
              <TextField required fullWidth margin="dense" id="item" label="产品功能" type="text" variant="standard" defaultValue={row.product} />
              <IconButton>
                <SearchIcon />
              </IconButton>
            </Stack>
          </Grid>
          <Grid item xs={5}>
            <TextField required select fullWidth margin="dense"
              id="result" label="结果" variant="standard" defaultValue={row.result}>
              {resultOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
          </TextField>
          </Grid>
          <Grid item xs={10}>
            <TextField fullWidth margin="dense" id="content" label="内容" type="text" variant="standard" defaultValue={row.content} />
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

export default function CustomerService(props) {
  const [openRecordDialog, setOpenRecordDialog] = React.useState(false);
  const [openReminderDialog, setOpenReminderDialog] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const userId = props.userId;

  const handleOpenRecordDialog = () => {
    setOpenRecordDialog(true);
  };

  const handleCloseRecordDialog = () => {
    setOpenRecordDialog(false);
  };

  const handleOpenReminderDialog = () => {
    setOpenReminderDialog(true);
  };

  const handleCloseReminderDialog = () => {
    setOpenReminderDialog(false);
  };

  const handleOpenEditDialog = (row) => {
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  React.useEffect(() => {
    // 在组件加载时发送请求获取数据
    fetchData();
  }, []); // 空数组表示只在组件加载时执行一次

  // 获取用户数据
  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/customerService/queryAllRecords');
      if (!response.ok) {
        throw new Error('无法获取用户数据');
      }
      const data = await response.json();
      const records = data.records
      // console.log(users)
      console.log(userId);
      setRows(records); // 设置数据到state中
    } catch (error) {
      console.error('用户数据获取失败:', error);
    }
  };


  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ mt: 2, padding: 1 }}>
        <CssBaseline />
        <Typography component="h2" variant="h5" sx={{ mb: 4 }}>
          客户服务
        </Typography>
        <Stack direction="row" sx={{ flexGrow: 1, mb: 5 }}>
          <Search sx={{ flexGrow: 1 }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Box>
            <Button variant="contained" sx={{ mr: 3 }} onClick={handleOpenRecordDialog}>添加记录</Button>
            <Button variant="contained" onClick={handleOpenReminderDialog}>添加待办事项</Button>
            <RecordDialog open={openRecordDialog} handleClose={handleCloseRecordDialog} />
            <ReminderDialog open={openReminderDialog} handleClose={handleCloseReminderDialog} />
          </Box>
        </Stack>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>日期</TableCell>
              <TableCell>客户名称</TableCell>
              <TableCell>负责人</TableCell>
              <TableCell>产品功能</TableCell>
              <TableCell>内容</TableCell>
              <TableCell>结果</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.sid}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.customername}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.product}</TableCell>
                <TableCell>{row.content}</TableCell>
                <TableCell>{row.result}</TableCell>
                <TableCell align="right">
                  {
                    row.uid === userId &&
                    <Box>
                      <Button variant="text" onClick={() => handleOpenEditDialog()}>修改</Button>
                      <EditDialog open={openEditDialog} handleClose={handleCloseEditDialog} row={row} fetchData={fetchData} />
                    </Box>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </ThemeProvider>
  );
}