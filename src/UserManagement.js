import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { Box, CssBaseline, InputBase, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Stack, Radio, FormControlLabel, RadioGroup, Paper, TableContainer, TableSortLabel, Chip, Typography, Link, DialogContentText } from '@mui/material';
import { LooksOne, LooksTwo, Looks3, Looks4, Looks5, Stars } from '@mui/icons-material';
import NavigationBar from './NavigationBar';
import { visuallyHidden } from '@mui/utils';

const Search = styled('div')(({ theme }) => ({ // 搜索框样式
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

const SearchIconWrapper = styled('div')(({ theme }) => ({ // 搜索图标样式
  // padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({ // 输入框样式
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

function stableSort(array, comparator) { // 排序函数
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

function ViewDialog({ open, onClose, data }) {
  /*
  * 查看客户经理信息对话框
  * @param {boolean} open - 对话框是否打开
  * @param {function} onClose - 关闭对话框的回调函数
  * @param {object} data - 客户经理信息
  * @return {JSX.Element}
  */
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

function EditDialog({ open, handleClose, username, fetchData }) {
  /*
  * 修改权限对话框
  * @param {boolean} open - 对话框是否打开
  * @param {function} handleClose - 关闭对话框的回调函数
  * @param {number} permission - 用户权限
  * @param {string} username - 用户名
  * @param {function} fetchData - 更新表格数据的回调函数
  * @return {JSX.Element}
  */
  const handleConfirm = async () => {
    // 向后端发送请求修改权限
    const response = await fetch('http://127.0.0.1:5000/user_management/update_permission', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 'username': username }),
    });
    const responseData = await response.json(); // 解析返回的 JSON 数据

    if (response.ok) {
      // console.log(username, responseData.message);
      // 更新权限后关闭对话框并触发更新表格的操作
      fetchData();
      handleClose(); // 关闭对话框
      window.alert(responseData.message);
    } else {
      // console.log(username, responseData.message);
      // 显示错误信息
      window.alert(responseData.message);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>确认修改权限</DialogTitle>
        <DialogContent>是否确定修改此用户的权限为管理员？修改后此用户将拥有权限管理、修改客户信息等权限。</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">取消</Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>确定</Button>
        </DialogActions>
      </Dialog>
  );
}

function AddDialog({ open, handleClose, fetchData }) {
  /*
  * 添加用户对话框
  * @param {boolean} open - 对话框是否打开
  * @param {function} handleClose - 关闭对话框的回调函数
  * @param {function} fetchData - 更新表格数据的回调函数
  * @return {JSX.Element}
  */
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

    const mailregex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+$/i; // 邮箱正则表达式
    const telregex = /^1[3-9]\d{9}$/; // 电话号码正则表达式

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

    // 向后端发送请求添加用户
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
      // console.log(responseData.message);
      fetchData();
      handleClose(); // 关闭对话框
      window.alert(responseData.message);
    } else {
      // 处理提交失败的逻辑
      // console.log(responseData.message);
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
  const [rows, setRows] = React.useState([]); // 用户数据
  const [rankMonth, setRankMonth] = React.useState([]); // 月度销售排行榜
  const [rankSeason, setRankSeason] = React.useState([]); // 季度销售排行榜
  const [openEditDialog, setOpenEditDialog] = React.useState(false); // 修改权限对话框
  const [openAddDialog, setOpenAddDialog] = React.useState(false); // 添加用户对话框 
  const [selectedUsername, setSelectedUsername] = React.useState(null); // 选中的用户名
  const [searchQuery, setSearchQuery] = React.useState(''); // 搜索框内容
  const userPermission = localStorage.getItem("userPermission"); // 用户权限
  const [order, setOrder] = React.useState('asc'); // 排序方式
  const [orderBy, setOrderBy] = React.useState('id'); // 排序字段
  const h = userPermission === '1' ? 590 : 450; // 表格高度
  const [viewDialog, setViewDialog] = React.useState({ // 查看客户经理信息对话框
    open: false,
    data: {},
  });

  const headCells = [ // 表头
    { id: 'username', label: 'ID' },
    { id: 'name', label: '名字' },
    { id: 'gender', label: '性别' },
    { id: 'phone', label: '联系方式' },
    { id: 'email', label: '电子邮件' },
    { id: 'wechatid', label: '微信号' },
    { id: 'permission', label: '权限级别' },
  ];

  const styles = [ // 排行榜样式
    { fontSize: '24px', fontWeight: 'bold', color: 'gold' },
    { fontSize: '20px', fontWeight: 'bold', color: 'gold' },
    { fontSize: '20px', fontWeight: 'bold', color: 'gold' },
    { fontSize: '16px', fontWeight: 'normal' },
    { fontSize: '16px', fontWeight: 'normal' },
];

  const onRequestSort = (event, property) => { // 排序函数
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const createSortHandler = (property) => (event) => { // 创建排序处理函数
    onRequestSort(event, property);
  };

  function descendingComparator(a, b, orderBy) { // 降序比较器
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) { // 获取比较器
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const visibleRows = React.useMemo( // 搜索结果
    () =>
      stableSort(rows, getComparator(order, orderBy)),
    [order, orderBy, rows],
  );

  const handleInputChange = async (event) => {
    const query = event.target.value; // 得到搜索框的内容
    setSearchQuery(query);
    // 向后端发送请求获取搜索结果
    const response = await fetch('http://127.0.0.1:5000/user_management/query_users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem("token")
      },
      body: JSON.stringify({ 'query': query }),
    });
    if (!response.ok) {
      window.alert('无法获取搜索结果');
      return;
    }
    const data = await response.json();
    const users = data.users
    setRows(users);
  };

  const handleOpenDialog = async (id) => {
    // 打开查看客户经理信息对话框
    const response = await fetch('http://127.0.0.1:5000/user_management/query_user?query=' + encodeURIComponent(id));
    if (!response.ok) {
      window.alert('无法获取客户经理信息');
      return;
    }
    const data = await response.json();
    // console.log(data);
    const detail = data.detail;
    // console.log(detail);
    setViewDialog({ open: true, data: detail });
  }

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // 向后端发送请求获取所有客户经理数据
    const response = await fetch('http://127.0.0.1:5000/user_management/query_all_users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem("token")
    }})
    if (!response.ok) {
      window.alert('无法获取所有客户经理的数据');
      return;
    }
    const data = await response.json();
    const users = data.users
    const rankMonth = data.rank_month
    const rankSeason = data.rank_season
    setRows(users);
    setRankMonth(rankMonth);
    setRankSeason(rankSeason);
  };

  const handleOpenEditDialog = (username) => { // 打开修改权限对话框
    setOpenEditDialog(true);
    setSelectedUsername(username);
  };

  return (
    <Box>
      <CssBaseline />
      <NavigationBar />
      <Box  sx={{ ml: 30, my: 3, mr: 5 }}>
        {/* 月度和季度销售排行榜 */}
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
                  <Link component='button' underline='none' color='inherit' onClick={() => handleOpenDialog(user.id)}>{`${user.name} ${user.sales}元`}</Link>
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
          {/* 搜索框 */}
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
          {/* 添加用户按钮 */}
          { userPermission === '1' && <Button variant="contained" onClick={() => setOpenAddDialog(true)} sx={{ ml: 5 }}>添加用户</Button> }
        </Stack>
        <Typography variant='body1' sx={{ fontWeight: 700, mb: 0.5, ml: 1 }}>共显示{visibleRows.length}条记录</Typography>
        {/* 搜索结果表格 */}
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
                { userPermission === '1' && (<TableCell align="right"></TableCell>) }
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
                      { row.permission === 0 && <Button variant="text" onClick={() => handleOpenEditDialog(row.username)}>修改权限</Button>}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <ViewDialog open={viewDialog.open} onClose={() => setViewDialog({ open: false, data: {} })} data={viewDialog.data}/>
        <EditDialog open={openEditDialog} handleClose={() => setOpenEditDialog(false)} username={selectedUsername} fetchData={fetchData} />
        <AddDialog open={openAddDialog} handleClose={() => setOpenAddDialog(false)} fetchData={fetchData} />
      </Box>
    </Box>
  )
}