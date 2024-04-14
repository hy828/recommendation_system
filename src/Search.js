import * as React from 'react';
import { Box, CssBaseline, Paper, Grid, Select, MenuItem, TextField, Button, TableCell, TableRow, TableHead, TableBody, Table, TableContainer, TableSortLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import { visuallyHidden } from '@mui/utils';

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

function CustomerManagement({ rows }) {
  const navigate = useNavigate();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('id');

  const headCells = [
    {
      id: 'id',
      label: 'ID',
    },
    {
      id: 'name',
      label: '名称',
    },
    {
      id: 'khlx',
      label: '客户类型',
    },
    {
      id: 'qygmmc',
      label: '企业规模名称',
    },
    {
      id: 'scale',
      label: '企业规模',
    },
    {
      id: 'industry_top',
      label: '行业门类',
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

  return (
    <Box sx={{ mt: 3 }}>
      <CssBaseline />
      <TableContainer sx={{ maxHeight: 400 }} component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ "& th": { color: "white", backgroundColor: "secondary.main" } }}>
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
            // {rows.map((row) => (
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
      <Box sx={{ ml: 30, my: 3, mr: 5 }}>
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