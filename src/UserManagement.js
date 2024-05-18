import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { Box, CssBaseline, InputBase, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Stack, Radio, FormControlLabel, RadioGroup, Paper, TableContainer, TableSortLabel, Chip, Typography } from '@mui/material';
import { LooksOne, LooksTwo, Looks3, Looks4, Looks5, Stars } from '@mui/icons-material';
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
      width: '60ch',
      '&:focus': {
          width: '60ch',
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
    const response = await fetch('http://127.0.0.1:5000/user_management/update_permission', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 'username': username }),
    });
    const responseData = await response.json(); // 解析返回的 JSON 数据

    if (response.ok) {
      console.log(username, responseData.message);
      // 更新权限后关闭对话框并触发更新表格的操作
      fetchData();
      handleClose(); // 关闭对话框
      window.alert(responseData.message);
    } else {
      console.log(username, responseData.message);
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
    const gender = formData.get('gender');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const wechatid = formData.get('wechatid');
    const permission = formData.get('permission');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    const mailregex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+$/i;
    const telregex = /^1[3-9]\d{9}$/;

    // 校验数据
    if (password !== confirmPassword) {
      alert('密码和确认密码不一致');
      return;
    }
    if (!mailregex.test(email)) {
      window.alert('请输入正确的邮箱格式');
      return;
    }
    if (!telregex.test(phone)) {
      window.alert('请输入正确的电话号码格式');
      return;
    }

    const response = await fetch('http://127.0.0.1:5000/user_management/add_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'id': id,
        'name': name,
        'gender': gender,
        'phone': phone,
        'email': email,
        'wechatid': wechatid,
        'permission': permission,
        'password': password,
      }),
    });

    const responseData = await response.json(); // 解析返回的 JSON 数据
    if (response.ok) {
      // 处理提交成功的逻辑
      console.log(responseData.message);
      fetchData();
      handleClose(); // 关闭对话框
      window.alert(responseData.message);
    } else {
      // 处理提交失败的逻辑
      console.log(responseData.message);
      // 显示错误信息或者其他处理
      window.alert(responseData.message);
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
            name="name"
            label="名字"
            type="text"
            fullWidth
            variant="standard"
          />
          <RadioGroup row defaultValue="1" name="gender">
            <FormControlLabel value="1" control={<Radio />} label="男" />
            <FormControlLabel value="0" control={<Radio />} label="女" />
          </RadioGroup>
          <TextField
            autoFocus
            required
            margin="dense"
            name="phone"
            label="电话号码"
            type="tel"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            required
            margin="dense"
            name="email"
            label="电子邮件"
            type="email"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            required
            margin="dense"
            name="wechatid"
            label="微信号"
            type="text"
            fullWidth
            variant="standard"
          />
          <RadioGroup row defaultValue="0" name="permission">
            <FormControlLabel value="0" control={<Radio />} label="客户经理" />
            <FormControlLabel value="1" control={<Radio />} label="管理员" />
          </RadioGroup>
          <TextField
            autoFocus
            required
            margin="dense"
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
  const [rankMonth, setRankMonth] = React.useState([]);
  const [rankSeason, setRankSeason] = React.useState([]);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [selectedUserPermission, setSelectedUserPermission] = React.useState(null);
  const [selectedUsername, setSelectedUsername] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const userPermission = localStorage.getItem("userPermission");
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('id');
  const h = userPermission === '1' ? 590 : 450;

  const headCells = [
    { id: 'username', label: 'ID' },
    { id: 'name', label: '名字' },
    { id: 'gender', label: '性别' },
    { id: 'phone', label: '联系方式' },
    { id: 'email', label: '电子邮件' },
    { id: 'wechatid', label: '微信号' },
    { id: 'permission', label: '权限级别' },
  ];

  const styles = [
    { fontSize: '24px', fontWeight: 'bold', color: 'gold' },
    { fontSize: '20px', fontWeight: 'bold', color: 'gold' },
    { fontSize: '20px', fontWeight: 'bold', color: 'gold' },
    { fontSize: '16px', fontWeight: 'normal' },
    { fontSize: '16px', fontWeight: 'normal' },
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
      const response = await fetch('http://127.0.0.1:5000/user_management/query_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem("token")
        },
        body: JSON.stringify({ 'query': query }),
      });
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
      const response = await fetch('http://127.0.0.1:5000/user_management/query_all_users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem("token")
      }})
      if (!response.ok) {
        throw new Error('无法获取用户数据');
      }
      const data = await response.json();
      const users = data.users
      const rankMonth = data.rank_month
      const rankSeason = data.rank_season
      setRows(users); // 设置数据到state中
      setRankMonth(rankMonth);
      setRankSeason(rankSeason);
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
      <Box  sx={{ ml: 30, my: 3, mr: 5 }}>
        {
          userPermission === '0' && 
          <Paper sx={{ height: 120, mb: 3, display: 'flex', flexDirection: 'column', p: 2 }}>
            <Typography sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 2 }}>
              <Typography color='red' variant='h6' fontWeight={700} marginRight={5} ><Stars sx={{ verticalAlign: 'middle' }}/>季度销售排行榜<Stars sx={{ verticalAlign: 'middle' }}/></Typography>
              {rankMonth.map((user, index) => (
                <Typography key={user.id} sx={styles[index]} marginRight={3}>
                  {index === 0 && <LooksOne sx={{ verticalAlign: 'middle' }}/>}
                  {index === 1 && <LooksTwo sx={{ verticalAlign: 'middle' }}/>}
                  {index === 2 && <Looks3 sx={{ verticalAlign: 'middle' }}/>}
                  {index === 3 && <Looks4 sx={{ verticalAlign: 'middle' }}/>}
                  {index === 4 && <Looks5 sx={{ verticalAlign: 'middle' }}/>}
                  {`${user.name} ${user.sales}元`}
                </Typography>
              ))}
            </Typography>
            <Typography sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Typography color='red' variant='h6' fontWeight={700} marginRight={5} ><Stars sx={{ verticalAlign: 'middle' }}/>月度销售排行榜<Stars sx={{ verticalAlign: 'middle' }}/></Typography>
              {rankSeason.map((user, index) => (
                <Typography key={user.id} sx={styles[index]} marginRight={3}>
                  {index === 0 && <LooksOne sx={{ verticalAlign: 'middle' }}/>}
                  {index === 1 && <LooksTwo sx={{ verticalAlign: 'middle' }}/>}
                  {index === 2 && <Looks3 sx={{ verticalAlign: 'middle' }}/>}
                  {index === 3 && <Looks4 sx={{ verticalAlign: 'middle' }}/>}
                  {index === 4 && <Looks5 sx={{ verticalAlign: 'middle' }}/>}
                  {`${user.name} ${user.sales}元`}
                </Typography>
              ))}
            </Typography>
          </Paper>
        }
        <Stack direction="row" sx={{ flexGrow: 1, mb: 1 }}>
          <Paper sx={{ flexGrow: 1, px: 5, py: 0.5 }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon onClick={handleInputChange} />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="搜索ID、名字、电话号码、电子邮件或微信号"
                inputProps={{ 'aria-label': 'search' }}
                value={searchQuery}
                onChange={handleInputChange}
              />
            </Search>
          </Paper>
          { userPermission === '1' && <Button variant="contained" onClick={handleOpenAddDialog} sx={{ ml: 5 }}>添加用户</Button> }
          <AddDialog open={openAddDialog} handleClose={handleCloseAddDialog} fetchData={fetchData} />
        </Stack>
        <Typography variant='body1' sx={{ fontWeight: 700, mb: 0.5, ml: 1 }}>共显示{visibleRows.length}条记录</Typography>
        <TableContainer sx={{ height: h, maxHeight: h }} component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => {
                  if (headCell.id === 'permission' && userPermission === '0') {
                    return null;
                  }
                  return (
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
                  )
                })}
                {
                  userPermission === '1' && (<TableCell align="right"></TableCell>)
                }
                
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((row) => (
                <TableRow key={row.username}>
                  <TableCell>{row.username}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.gender ? '男' : '女' }</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.wechatid}</TableCell>
                  { userPermission === '1' && (
                    <TableCell>{
                      row.permission === 0 ? 
                      <Chip label='客户经理' color='info' variant='outlined'/> : 
                      <Chip label='管理员' color='success' variant='outlined'/>
                    }</TableCell>)}
                  { userPermission === '1' && (
                    <TableCell align="right">
                      { row.permission === 0 && <Button variant="text" onClick={() => handleOpenEditDialog(row.permission, row.username)}>修改权限</Button>}
                      
                    </TableCell>
                  )}
                  
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