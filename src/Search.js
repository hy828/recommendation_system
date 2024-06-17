import * as React from 'react';
import { Box, CssBaseline, Paper, Grid, Select, MenuItem, TextField, Button, TableCell, TableRow, TableHead, TableBody, Table, TableContainer, TableSortLabel, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import { visuallyHidden } from '@mui/utils';

function SearchInputRow({ num, searchTypeValue, searchValue, bindTypeValue, onSearchTypeChange, onSearchValueChange, onBindTypeChange }) {
  /*
  * 搜索框组件
  * @param {number} num - 搜索框序号
  * @param {string} searchTypeValue - 搜索字段值
  * @param {string} searchValue - 搜索值
  * @param {string} bindTypeValue - 绑定类型值
  * @param {function} onSearchTypeChange - 搜索字段改变事件处理函数
  * @param {function} onSearchValueChange - 搜索值改变事件处理函数
  * @param {function} onBindTypeChange - 绑定类型改变事件处理函数
  * @returns {JSX.Element}
  */
  const searchTypeName = `searchType${num}`;
  const searchValueName = `searchValue${num}`;
  const bindTypeName = `bindType${num}`;

  const searchTypes = [ // 搜索字段选项
    { key: 'id', value: '客户ID' },
    { key: 'name', value: '客户名称' },
    { key: 'khlx', value: '客户类型' },
    { key: 'qygmmc', value: '企业规模名称' },
    { key: 'industry_top', value: '行业门类' }
  ]

  const bindTypes = [ // 绑定类型选项
    { key: '&', value: '与' },
    { key: '|', value: '或' },
    { key: '!', value: '非' }
  ]

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
      <Grid item xs={7}>
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
      { num === 1 ? <Grid item xs={2} /> : (
        <Grid item xs={2}>
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
  /*
  * 对数组进行稳定排序
  * @param {Array} array - 待排序数组
  * @param {function} comparator - 比较函数
  * @returns {Array} 排序后的数组
  */
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
  /*
  * 搜索结果组件
  * @param {Array} rows - 客户数据
  * @returns {JSX.Element}
  */
  const navigate = useNavigate(); // 导航函数
  const [order, setOrder] = React.useState('asc'); // 排序方式 - 升序/降序
  const [orderBy, setOrderBy] = React.useState('id'); // 排序字段

  const headCells = [ // 表头字段
    { id: 'id', label: 'ID' },
    { id: 'name', label: '名称' },
    { id: 'khlx', label: '客户类型' },
    { id: 'qygmmc', label: '企业规模名称' },
    { id: 'scale', label: '企业规模' },
    { id: 'industry_top', label: '行业门类' },
  ];

  const onRequestSort = (event, property) => { // 设置排序方式及字段
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const createSortHandler = (property) => (event) => { // 创建排序事件处理函数
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

  const visibleRows = React.useMemo( // 得到排序后的数据
    () =>
      stableSort(rows, getComparator(order, orderBy)),
    [order, orderBy, rows],
  );

  return (
    <Box sx={{ mt: 2 }}>
      <CssBaseline />
      <Typography variant='body1' sx={{ fontWeight: 700, mb: 1, ml: 1 }}>共显示{visibleRows.length}条记录</Typography>
      <TableContainer sx={{ maxHeight: 460 }} component={Paper}>
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
  const [rows, setRows] = React.useState([]); // 表格数据
  const [searchInputs, setSearchInputs] = React.useState([ // 搜索框数据
    { searchTypeValue: 'id', searchValue: '', bindTypeValue: '|' },
    { searchTypeValue: 'id', searchValue: '', bindTypeValue: '|' },
    { searchTypeValue: 'id', searchValue: '', bindTypeValue: '|' },
  ]);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch('http://127.0.0.1:5000/customer_management/query_all_customers');
    if (!response.ok) {
      window.alert('无法获取客户数据');
      return;
    }
    const data = await response.json();
    const customers = data.customers
    setRows(customers);
  };

  const handleSearch = async (event) => { // 搜索事件处理函数
    event.preventDefault(); // 阻止表单默认提交行为
    const formData = new FormData(event.currentTarget); // 获取表单数据
    const v1 = formData.get('searchValue1');
    const v2 = formData.get('searchValue2');
    const v3 = formData.get('searchValue3');
    const t1 = formData.get('searchType1');
    const t2 = formData.get('searchType2');
    const t3 = formData.get('searchType3');
    const b2 = formData.get('bindType2');
    const b3 = formData.get('bindType3');
    
    const searchQuery = [];
    if (t1 && v1) { // 第一个搜索框有值
      searchQuery.push(`${t1}='${v1}'`);
    }
    
    if (t2 && v2) { // 第二个搜索框有值
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

    if (t3 && v3) { // 第三个搜索框有值
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

    const query = searchQuery.join(''); // 拼接搜索条件
    console.log(query)

    // 发送搜索请求
    const response = await fetch('http://127.0.0.1:5000/customer_management/advanced_search?query=' + encodeURIComponent(query));
    if (!response.ok) {
      window.alert('搜索失败');
      return;
    }
    const data = await response.json();
    const customers = data.customers;
    setRows(customers);
  };

  const handleSearchInputChange = (num, field, value) => { // 搜索框输入改变事件处理函数
    setSearchInputs(inputs =>
      inputs.map((input, index) =>
        index === num - 1 ? { ...input, [field]: value } : input
      )
    );
  };

  const handleClearSearch = () => { // 清空搜索框事件处理函数
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
        <Paper sx={{ px:5, pt:1, height: 170 }} component='form' onSubmit={handleSearch}>
          <Grid container columnSpacing={3}>
            <Grid item xs={11}>
            {searchInputs.map((input, index) => (
              <Box key={index} sx={{ my: 1 }}>
                <SearchInputRow
                  num={index + 1}
                  searchTypeValue={input.searchTypeValue}
                  searchValue={input.searchValue}
                  bindTypeValue={input.bindTypeValue}
                  onSearchTypeChange={(value) => handleSearchInputChange(index + 1, 'searchTypeValue', value)}
                  onSearchValueChange={(value) => handleSearchInputChange(index + 1, 'searchValue', value)}
                  onBindTypeChange={(value) => handleSearchInputChange(index + 1, 'bindTypeValue', value)}
                />
              </Box>
            ))}
            </Grid>
            <Grid item xs={1}>
              <Stack spacing={1} direction="column" sx={{ mt: 7 }}>
                <Button variant="contained" onClick={handleClearSearch}>重置</Button>
                <Button variant="contained" type="submit">搜索</Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
        <CustomerManagement rows={rows}/>
      </Box>
    </Box>
  )
}