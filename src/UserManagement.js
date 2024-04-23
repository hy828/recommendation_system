import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { Box, CssBaseline, InputBase, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Stack, Radio, FormControlLabel, RadioGroup, Paper, TableContainer, TableSortLabel, Chip } from '@mui/material';
import NavigationBar from './NavigationBar';
import { visuallyHidden } from '@mui/utils';

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

function EditDialog({ open, handleClose, permission, username, fetchData }) {
  let dialogContent;
  if (permission === 0) {
    dialogContent = "是否确定修改此用户的权限为高级？修改后此用户将拥有权限管理、修改客户信息等权限。";
  } else {
    dialogContent = "是否确定修改此用户的权限为普通？修改后此用户将失去权限管理、修改客户信息等权限。";
  }

  // 向后端发送请求，修改用户权限
  const handleConfirm = async () => {
    const response = await fetch('http://127.0.0.1:5000/permission/updatePermission', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });
    const responseData = await response.json(); // 解析返回的 JSON 数据

    if (response.ok) {
      console.log(username,'权限更新成功');
      // 更新权限后关闭对话框并触发更新表格的操作
      fetchData();
      handleClose(); // 关闭对话框
      window.alert(responseData.message);
    } else {
      console.log(username,'权限更新失败');
      // 显示错误信息
      window.alert(responseData.message);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>确认修改权限</DialogTitle>
        <DialogContent>{dialogContent}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">取消</Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>确定</Button>
        </DialogActions>
      </Dialog>
  );
}

function AddDialog({ open, handleClose, fetchData }) {
  const handleSubmit = async (event) => {
    event.preventDefault(); // 阻止表单默认提交行为
    const formData = new FormData(event.currentTarget); // 获取表单数据
    const id = formData.get('id');
    const name = formData.get('name');
    const permission = formData.get('permission');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    // 校验数据
    if (password !== confirmPassword) {
      alert('密码和确认密码不一致');
      return;
    }

    const response = await fetch('http://127.0.0.1:5000/permission/addUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'id': id,
        'name': name,
        'permission': permission,
        'password': password,
      }),
    });

    if (response.ok) {
      // 处理提交成功的逻辑
      console.log('用户添加成功');
      fetchData();
      handleClose(); // 关闭对话框
    } else {
      // 处理提交失败的逻辑
      console.log('用户添加失败');
      // 显示错误信息或者其他处理
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ component: 'form', onSubmit: handleSubmit }}>
      <DialogTitle>添加用户</DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <TextField
            autoFocus
            required
            margin="dense"
            id="id"
            name="id"
            label="用户名"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="名字"
            type="text"
            fullWidth
            variant="standard"
          />
          <RadioGroup row defaultValue="0" name="permission">
            <FormControlLabel value="0" control={<Radio />} label="普通用户" />
            <FormControlLabel value="1" control={<Radio />} label="高级用户" />
          </RadioGroup>
          <TextField
            autoFocus
            required
            margin="dense"
            id="password"
            name="password"
            label="密码"
            type="password"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="confirmPassword"
            name="confirmPassword"
            label="确认密码"
            type="password"
            fullWidth
            variant="standard"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>取消</Button>
        <Button type="submit">完成</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function UserManagement() {
  const [rows, setRows] = React.useState([]);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [selectedUserPermission, setSelectedUserPermission] = React.useState(null);
  const [selectedUsername, setSelectedUsername] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const userPermission = localStorage.getItem("userPermission");
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('id');

  const headCells = [
    {
      id: 'username',
      label: 'ID',
    },
    {
      id: 'name',
      label: '名字',
    },
    {
      id: 'phone_number',
      label: '联系方式',
    },
    {
      id: 'email',
      label: '电子邮件',
    },
    {
      id: 'permission',
      label: '权限级别',
    },
  ];

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
      stableSort(rows, getComparator(order, orderBy)),
    [order, orderBy, rows],
  );

  // 根据搜索框改变的内容实时更新表格
  const handleInputChange = async (event) => {
    const query = event.target.value; // 得到搜索框的内容
    setSearchQuery(query);
    try {
      const response = await fetch('http://127.0.0.1:5000/permission/queryUser?query=' + encodeURIComponent(query));
      const data = await response.json();
      const users = data.users
      setRows(users);
    } catch (error) {
      console.error('搜索失败:', error);
    }
  };

  React.useEffect(() => {
    // 在组件加载时发送请求获取数据
    fetchData();
  }, []); // 空数组表示只在组件加载时执行一次

  // 获取用户数据
  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/permission/queryAllUsers');
      if (!response.ok) {
        throw new Error('无法获取用户数据');
      }
      const data = await response.json();
      const users = data.users
      // console.log(users)
      setRows(users); // 设置数据到state中
    } catch (error) {
      console.error('用户数据获取失败:', error);
    }
  };

  const handleOpenEditDialog = (permission, username) => {
    setOpenEditDialog(true);
    setSelectedUserPermission(permission);
    setSelectedUsername(username);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };
  
  return (
    <Box>
      <CssBaseline />
      <NavigationBar />
      <Box  sx={{ ml: 30, my: 5, mr: 5 }}>
        <Stack direction="row" sx={{ flexGrow: 1, mb: 5 }}>
          <Paper sx={{ flexGrow: 1, px: 5, py: 0.5, mr: 5 }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon onClick={handleInputChange} />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="搜索..."
                inputProps={{ 'aria-label': 'search' }}
                value={searchQuery}
                onChange={handleInputChange}
              />
            </Search>
          </Paper>
          <Button variant="contained" onClick={handleOpenAddDialog}>添加用户</Button>
          <AddDialog open={openAddDialog} handleClose={handleCloseAddDialog} fetchData={fetchData} />
        </Stack>
        <TableContainer sx={{ maxHeight: 560 }} component={Paper}>
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
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((row) => (
                <TableRow key={row.username}>
                  <TableCell>{row.username}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.phone_number}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{
                    row.permission === 0 ? 
                    <Chip label='普通用户' color='info' variant='outlined'/> : 
                    <Chip label='高级用户' color='success' variant='outlined'/>
                  }</TableCell>
                  <TableCell align="right">{ 
                    userPermission === '1' &&
                      <Button variant="text" onClick={() => handleOpenEditDialog(row.permission, row.username)}>修改权限</Button>
                  }</TableCell>
                </TableRow>
              ))}
              <EditDialog open={openEditDialog} handleClose={handleCloseEditDialog} permission={selectedUserPermission} username={selectedUsername} fetchData={fetchData} />
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}