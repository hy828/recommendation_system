import * as React from 'react';
import { createTheme, ThemeProvider, styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { Box, CssBaseline, InputBase, Table, TableBody, TableCell, TableHead, TableRow, Typography, Button } from '@mui/material';

import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

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

export default function CustomerManagement() {
  const [rows, setRows] = React.useState([]);
  const [detail, setDetail] = React.useState(null); 

  React.useEffect(() => {
    // 在组件加载时发送请求获取数据
    fetchData();
  }, []); // 空数组表示只在组件加载时执行一次

  // 获取用户数据
  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/customerManagement/queryAllCustomers');
      if (!response.ok) {
        throw new Error('无法获取用户数据');
      }
      const data = await response.json();
      const customers = data.customers
      // console.log(users)
      setRows(customers); // 设置数据到state中
    } catch (error) {
      console.error('用户数据获取失败:', error);
    }
  };

  // 获取用户数据
  const fetchDetail = async (id) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/customerManagement/queryDetail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error('无法获取用户数据');
      }
      const data = await response.json();
      const detail = data.detail
      // console.log(users)
      setDetail(detail);
    } catch (error) {
      console.error('用户数据获取失败:', error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ mt: 2, padding: 1 }}>
        <CssBaseline />
        <Typography component="h2" variant="h5" sx={{ mb: 4 }}>
          客户管理
        </Typography>
        <Search sx={{ mb: 5 }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell sx={{ flexGrow: 1 }}>名称</TableCell>
              <TableCell>客户类型</TableCell>
              <TableCell>企业规模名称</TableCell>
              <TableCell>企业规模</TableCell>
              <TableCell>行业门类</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell sx={{ flexGrow: 1 }}>{row.name}</TableCell>
                <TableCell>{row.khlx}</TableCell>
                <TableCell>{row.qygmmc}</TableCell>
                <TableCell>{row.scale}</TableCell>
                <TableCell>{row.industry_top}</TableCell>
                <TableCell align="right">
                  <Button variant="text">查看</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </ThemeProvider>
  );
}