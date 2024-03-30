import * as React from 'react';
import { createTheme, ThemeProvider, styled, alpha } from '@mui/material/styles';
import { Box, CssBaseline, InputBase, Paper, Typography, Grid, FormControl, Select, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NavigationBar from './NavigationBar';
import { useLocation } from 'react-router-dom';

const defaultTheme = createTheme();

const SearchField = styled('div')(({ theme }) => ({
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

export default function Search() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [rows, setRows] = React.useState([]);

  const handleInputChange = async (event) => {
    const query = event.target.value; // 得到搜索框的内容
    try {
      const response = await fetch('http://127.0.0.1:5000/permission/queryUser?query=' + encodeURIComponent(query), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('无法获取搜索内容');
      }
      const data = await response.json();
      const users = data.users
      setRows(users);
    } catch (error) {
      console.error('搜索失败:', error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <NavigationBar />
      <Box sx={{ margin: 5, paddingTop: 10 }}>
        <Paper sx={{ padding: 5 }}>
          <Grid container spacing={5}>
            <Grid item xs={1}>
              <FormControl fullWidth size="small">
                <Select
                  id="demo-simple-select"
                  label="搜索字段"
                >
                  <MenuItem>ID</MenuItem>
                  <MenuItem>名称</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* <Grid item xs={4}>
              
            </Grid> */}
            <Grid item xs={6}>
              <SearchField sx={{ flexGrow: 1 }}>
                <StyledInputBase
                  placeholder="搜索客户ID..."
                  inputProps={{ 'aria-label': 'search' }}
                  value={searchQuery}
                />
              </SearchField>
            </Grid>
            <Grid item xs={1}>
              
            </Grid>

            <Grid item xs={1}>

            </Grid>
            <Grid item xs={4}>
              
            </Grid>
            <Grid item xs={6}>
              <SearchField sx={{ flexGrow: 1 }}>
                <StyledInputBase
                  placeholder="搜索客户ID..."
                  inputProps={{ 'aria-label': 'search' }}
                  value={searchQuery}
                />
              </SearchField>
            </Grid>
            <Grid item xs={1}>
              
            </Grid>
          </Grid>
          
        </Paper>
      </Box>
    </ThemeProvider>
  )
}