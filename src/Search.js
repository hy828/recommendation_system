import * as React from 'react';
import { Box, CssBaseline, Paper, Grid, Select, MenuItem, TextField, Button, TableCell, TableRow, TableHead, TableBody, Table, TableContainer } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavigationBar from './NavigationBar';

function SearchInputRow({ num, searchTypes, bindTypes, searchTypeValue, searchValue, bindTypeValue, onSearchTypeChange, onSearchValueChange, onBindTypeChange }) {
  const searchTypeName = `searchType${num}`;
  const searchValueName = `searchValue${num}`;
  const bindTypeName = `bindType${num}`;

  return (
    <Grid container columnSpacing={5}>
      <Grid item xs={3}>
        <Select
          fullWidth
          name={searchTypeName}
          hiddenLabel
          size='small'
          value={searchTypeValue}
          onChange={(event) => onSearchTypeChange(event.target.value)}
        >
          {searchTypes.map((type) => (
            <MenuItem key={type.key} value={type.key}>{type.value}</MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          name={searchValueName}
          hiddenLabel
          size="small"
          variant="outlined"
          inputProps={{
            autoComplete: 'off',
          }}
          value={searchValue}
          onChange={(event) => onSearchValueChange(event.target.value)}
        />
      </Grid>
      { num === 1 ? <Grid item xs={3} /> : (
        <Grid item xs={3}>
          <Select
            fullWidth
            name={bindTypeName}
            hiddenLabel
            size='small'
            value={bindTypeValue}
            onChange={(event) => onBindTypeChange(event.target.value)}
          >
            {bindTypes.map((type) => (
              <MenuItem key={type.key} value={type.key}>{type.value}</MenuItem>
            ))}
          </Select>
        </Grid>
      )}
    </Grid>
  );
}

function CustomerManagement({ rows }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ mt: 3 }}>
      <CssBaseline />
      <TableContainer sx={{ maxHeight: 350 }} component={Paper}>
        <Table stickyHeader>
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
                  <Button variant="text" onClick={() => navigate('/detail', { state: { id: row.id }})}>查看</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default function Search() {
  const [rows, setRows] = React.useState([]);
  const [searchInputs, setSearchInputs] = React.useState([
    { searchTypeValue: 'id', searchValue: '', bindTypeValue: '|' },
    { searchTypeValue: 'id', searchValue: '', bindTypeValue: '|' },
    { searchTypeValue: 'id', searchValue: '', bindTypeValue: '|' },
  ]);
  
  const searchTypes = [
    {
      key: 'id',
      value: '客户ID'
    },
    {
      key: 'name',
      value: '客户名称'
    },
    {
      key: 'khlx',
      value: '客户类型'
    },
    {
      key: 'qygmmc',
      value: '企业规模名称'
    },
    {
      key: 'hyml',
      value: '行业门类'
    }
  ]

  const bindTypes = [
    {
      key: '&',
      value: '与'
    },
    {
      key: '|',
      value: '或'
    },
    {
      key: '!',
      value: '非'
    }
  ]

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/customerManagement/queryAllCustomers');
      if (!response.ok) {
        throw new Error('无法获取用户数据');
      }
      const data = await response.json();
      const customers = data.customers
      setRows(customers);
    } catch (error) {
      console.error('用户数据获取失败:', error);
    }
  };

  const handleSearch = async (event) => {
    try {
      event.preventDefault();
      const formData = new FormData(event.currentTarget); // 获取表单数据
      const v1 = formData.get('searchValue1');
      const v2 = formData.get('searchValue2');
      const v3 = formData.get('searchValue3');
      const t1 = formData.get('searchType1');
      const t2 = formData.get('searchType2');
      const t3 = formData.get('searchType3');
      const b2 = formData.get('bindType2');
      const b3 = formData.get('bindType3');
      // console.log(t1)
      // console.log(v2)
      // console.log(b3)
      // 构造搜索查询
      const searchQuery = [];
      if (t1 && v1) {
        searchQuery.push(`${t1}='${v1}'`);
      }
      
      if (t2 && v2) {
        if (b2 && searchQuery.length > 0) {
          if (b2 === '!') {
            searchQuery.push(`&${t2}!='${v2}'`)
          } else {
            searchQuery.push(`${b2}${t2}='${v2}'`)
          }
        } else {
          searchQuery.push(`${t2}='${v2}'`);
        }
      }

      if (t3 && v3) {
        if (b3 && searchQuery.length > 0) {
          if (b3 === '!') {
            searchQuery.push(`&${t3}!='${v3}'`)
          } else {
            searchQuery.push(`${b3}${t3}='${v3}'`)
          }
        } else {
          searchQuery.push(`${t3}='${v3}'`);
        }
      }
  
      const query = searchQuery.join('');
      console.log(query)
  
      // 发送搜索请求
      const response = await fetch('http://127.0.0.1:5000/customerManagement/advancedSearch?query=' + encodeURIComponent(query));
      if (!response.ok) {
        throw new Error('无法获取搜索内容');
      }
      const data = await response.json();
      const customers = data.customers;
      setRows(customers);
    } catch (error) {
      console.error('搜索失败:', error);
    }
  };

  const handleSearchInputChange = (num, field, value) => {
    setSearchInputs(inputs =>
      inputs.map((input, index) =>
        index === num - 1 ? { ...input, [field]: value } : input
      )
    );
  };

  const handleClearSearch = () => {
    setSearchInputs(inputs =>
      inputs.map(() => ({
        searchTypeValue: 'id',
        searchValue: '',
        bindTypeValue: '|',
      }))
    );
    fetchData();
  };

  return (
    <Box>
      <CssBaseline />
      <NavigationBar />
      <Box sx={{ mx: 10, pt: 12 }}>
        <Paper sx={{ px:5, pt:1, height: 250 }} component='form' onSubmit={handleSearch}>
          {searchInputs.map((input, index) => (
            <Box key={index} sx={{ my: 2 }}>
              <SearchInputRow
                num={index + 1}
                searchTypes={searchTypes}
                bindTypes={bindTypes}
                searchTypeValue={input.searchTypeValue}
                searchValue={input.searchValue}
                bindTypeValue={input.bindTypeValue}
                onSearchTypeChange={(value) => handleSearchInputChange(index + 1, 'searchTypeValue', value)}
                onSearchValueChange={(value) => handleSearchInputChange(index + 1, 'searchValue', value)}
                onBindTypeChange={(value) => handleSearchInputChange(index + 1, 'bindTypeValue', value)}
              />
            </Box>
          ))}
            <Box fullWidth sx={{ display: "flex", justifyContent: 'flex-end' }}>
              <Button variant="contained" onClick={handleClearSearch} sx={{ mr: 3 }}>重置</Button>
              <Button variant="contained" type="submit">搜索</Button>
            </Box>
        </Paper>
        <CustomerManagement rows={rows}/>
      </Box>
    </Box>
  )
}