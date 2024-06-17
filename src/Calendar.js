import React from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { CssBaseline, Box, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Autocomplete } from '@mui/material';
import NavigationBar from './NavigationBar';

function AddDialog({ open, handleClose, products, customers, fetchData, date }) {
  /*
  * 添加记录框
  * @param {boolean} open - 控制对话框的打开和关闭
  * @param {function} handleClose - 关闭对话框的回调函数
  * @param {array} products - 产品列表
  * @param {array} customers - 客户列表
  * @param {function} fetchData - 重新获取数据的回调函数
  * @param {string} date - 日期
  * @returns {JSX.Element}
  */
  const name = localStorage.getItem("name"); // 获取目前登录用户的用户名

  const today = new Date(); // 获取今天的日期
  const formattedDate = today.toISOString().split('T')[0];
  const isRequired = date < formattedDate ? true : false; // 如果选择的日期早于今天，则为必填项

  const [cid, setCid] = React.useState(null);
  const [pid, setPid] = React.useState(null);
  const [result, setResult] = React.useState(null);

  const resultOptions = [ // 结果选项
    { value: 0, label: '无意向' },
    { value: 2, label: '有意向' },
    { value: 1, label: '已购买' },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault(); // 阻止表单默认提交行为
    const formData = new FormData(event.currentTarget); // 获取表单数据
    const date = formData.get('date');
    const content = formData.get('content');

    // 向后端发送请求，添加记录
    const response = await fetch('http://127.0.0.1:5000/follow_up_management/add_record', {
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
      // console.log(responseData.message);
      fetchData();
      handleClose();
      window.alert(responseData.message);
    } else {
      // console.log(responseData.message);
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
              defaultValue={date}
            />
          </Grid>
          <Grid item xs={8}>
            <Autocomplete
              disablePortal
              fullWidth
              ListboxProps={{ style: { maxHeight: 150 } }}
              options={customers}
              getOptionLabel={(option) => option.label}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  {option.id} - {option.label}
                </Box>
              )}
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

function EditDialog({ open, handleClose, row, fetchData, products, customers }) {
  /*
  * 编辑记录框
  * @param {boolean} open - 控制对话框的打开和关闭
  * @param {function} handleClose - 关闭对话框的回调函数
  * @param {object} row - 当前记录
  * @param {function} fetchData - 重新获取数据的回调函数
  * @param {array} products - 产品列表
  * @param {array} customers - 客户列表
  * @returns {JSX.Element}
  */

  const resultOptions = [ // 结果选项
    { id: 0, label: '无意向' },
    { id: 2, label: '有意向' },
    { id: 1, label: '已购买' },
  ];

  const today = new Date(); // 获取今天的日期
  const formattedDate = today.toISOString().split('T')[0];
  const isRequired = row.date < formattedDate ? true : false; // 如果选择的日期早于今天，则为必填项

  const [state, setState] = React.useState({ 
    cid: null,
    pid: null,
    result: null,
    openConfirmDialog: false
  });
  const name = localStorage.getItem("name"); // 获取目前登录用户的用户名

  React.useEffect(() => {
    setState(prevState => ({
      ...prevState,
      cid: row.cid,
      pid: row.pid,
      result: row.result
    }));
  }, [row]);

  const handleDelete = () => { // 打开确认删除对话框
    setState({ ...state, openConfirmDialog: true})
  }

  const handleCloseAll = () => { // 关闭确认删除对话框和编辑对话框
    setState({ ...state, openConfirmDialog: false });
    handleClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // 阻止表单默认提交行为
    const formData = new FormData(event.currentTarget); // 获取表单数据
    const date = formData.get('date');
    const content = formData.get('content');

    // 向后端发送请求，更新记录
    const response = await fetch('http://127.0.0.1:5000/follow_up_management/update_record', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'sid': row.sid,
        'date': date,
        'cid': state.cid,
        'pid': state.pid,
        'content': content,
        'result': state.result,
      }),
    });
    const responseData = await response.json();

    if (response.ok) {
      // console.log(row.sid, responseData.message);
      fetchData();
      handleClose();
      window.alert(responseData.message);
    } else {
      // console.log(row.sid, responseData.message);
      window.alert(responseData.message);
    }
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
              getOptionLabel={(option) => option.label}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  {option.id} - {option.label}
                </Box>
              )}
              value={customers.find(c => c.id === state.cid) || null}
              onChange={(event, newValue) => {
                var res = null;
                if (newValue) {
                  res = newValue.id;
                }
                setState({ ...state, cid: res });
              }}
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
              getOptionLabel={(option) => option.label}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  {option.id} - {option.label}
                </Box>
              )}
              value={products.find(p => p.id === state.pid) || null}
              onChange={(event, newValue) => {
                var res = null;
                if (newValue) {
                  res = newValue.id;
                }
                setState({ ...state, pid: res });
              }}
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
              getOptionLabel={(option) => option.label}
              value={resultOptions.find(r => r.id === state.result) || null}
              onChange={(event, newValue) => {
                var res = null;
                if (newValue) {
                  res = newValue.id;
                }
                setState({ ...state, result: res });
              }}
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
        <Button onClick={handleDelete}>删除</Button>
        <Button onClick={handleClose}>取消</Button>
        <Button type="submit">完成</Button>
      </DialogActions>
      <ConfirmDialog
        open={state.openConfirmDialog}
        handleClose={() => {setState({ ...state, openConfirmDialog: false})}}
        handleFinalize={handleCloseAll}
        row={row}
        fetchData={fetchData}
      />
    </Dialog>
  );
}

function ConfirmDialog({ open, handleClose, handleFinalize, row, fetchData }) {
  const sid = row.sid;

  const handleConfirm = async () => {
    // 向后端发送请求，删除记录
    const response = await fetch('http://127.0.0.1:5000/follow_up_management/delete_record', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 'sid': sid }),
    });
    const responseData = await response.json();

    if (response.ok) {
      // console.log(sid, responseData.message);
      fetchData();
      handleFinalize();
      window.alert(responseData.message);
    } else {
      // console.log(sid, responseData.message);
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

export default function Calendar() {
  const [state, setState] = React.useState({
    openAddDialog: false, // 控制添加记录对话框的打开和关闭
    openEditDialog: false, // 控制编辑记录对话框的打开和关闭
    openConfirmDialog: false, // 控制确认删除对话框的打开和关闭
    selectedDate: null, // 选中的日期
    selectedRecord: {}, // 选中的记录
    productOptions: [], // 产品列表
    customerData: [], // 客户列表
    events: [], // 日历事件
    records: [], // 所有记录
  });

  const resultColorMapping = { // 记录的结果与日历中颜色的映射
    '无意向': 'gray',
    '有意向': 'red',
    '已购买': 'green',
    '待补充': 'orange',
    '无': 'blue'
  };

  const handleDialogToggle = React.useCallback((date, row, dialogName, isOpen) => { // 控制对话框的打开和关闭
    setState((prevState) => ({
      ...prevState,
      selectedDate: date,
      selectedRecord: row,
      [dialogName]: isOpen,
    }));
  }, []);

  const handleEventClick = async (info) => {
    const sid = info.event.extendedProps.sid
    // 向后端发送请求，获取选中记录的详细信息
    const response = await fetch('http://127.0.0.1:5000/follow_up_management/query_record?query=' + encodeURIComponent(sid));
    if (!response.ok) {
      window.alert("获取数据失败");
      return;
    }
    const data = await response.json();
    const row = data.record
    handleDialogToggle(null, row, 'openEditDialog', true);
  }

  const handleDateClick = (info) => { // 点击日期格子
    const date = info.dateStr;
    handleDialogToggle(date, {}, 'openAddDialog', true); // 打开添加记录对话框
  }

  const convertToCalendarEvents = (data) => { // 将记录转换为日历事件
    return data.map(record => ({
      id: record.sid,
      title: record.title,
      date: record.date,
      color: resultColorMapping[record.result], // 根据结果映射颜色
      extendedProps: {
        sid: record.sid,
      }
    }));
  };

  React.useEffect(() => {
    fetchData();
    fetchData2();
  }, []);

  const fetchData = async () => {
    // 向后端发送请求，获取所有记录
    const response = await fetch('http://127.0.0.1:5000/follow_up_management/query_all_records', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem("token")
    }})
    if (!response.ok) {
      window.alert("获取数据失败");
      return;
    }
    const data = await response.json();
    const records = data.records
    const events = convertToCalendarEvents(records);

    setState(prevState => ({
      ...prevState,
      events: events,
      records: records,
    }));
  };

  const fetchData2 = async () => {
    // 向后端发送请求，获取产品列表
    const response = await fetch('http://127.0.0.1:5000/follow_up_management/get_product_options');
    if (!response.ok) {
      window.alert("获取产品列表失败");
      return;
    }
    const data = await response.json();
    const products = data.products;

    // 向后端发送请求，获取客户列表
    const response2 = await fetch('http://127.0.0.1:5000/follow_up_management/query_customers');
    if (!response2.ok) {
      window.alert("获取客户列表失败");
      return;
    }
    const data2 = await response2.json();
    const customers = data2.customers

    setState(prevState => ({
      ...prevState,
      productOptions: products,
      customerData: customers,
    }));
  };

  const Legend = ({ colorMapping }) => ( // 日历事件颜色的图例
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {Object.entries(colorMapping).map(([status, color]) => (
        <div key={status} style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
          <div style={{ width: '15px', height: '15px', backgroundColor: color, marginRight: '5px' }}></div>
          <span>{status}</span>
        </div>
      ))}
    </div>
  );
  
  return (
    <Box>
      <CssBaseline />
      <NavigationBar />
      <Box sx={{ ml: 30, my: 2, mr: 5 }}>
        <Paper
          sx={{
            p: 1,
            display: 'flex',
            flexDirection: 'column',
            height: 690,
          }}>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
            initialView="dayGridMonth"
            locale={'zh-cn'}
            headerToolbar={{
              start: 'prev,next today', // 左侧按钮
              center: 'title',   // 中间标题
              end: 'dayGridMonth,listMonth' // 右侧按钮
            }}
            buttonText={{today: '今天', dayGridMonth: '网格', listMonth: '列表', prev: '上一月', next: '下一月'}} // 自定义按钮文本
            weekends={true}
            events={state.events}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            height="100%"
            dayMaxEventRows={true} // 显示 “更多” 链接来限制显示的事件数
            dayMaxEvents={3} // 每个日期格子中最多显示的事件数
          />
          <Legend colorMapping={resultColorMapping} />
          <AddDialog
            open={state.openAddDialog}
            handleClose={
              React.useCallback(() => {
                handleDialogToggle('', {}, 'openAddDialog', false);
              }, [handleDialogToggle])}
            fetchData={fetchData}
            products={state.productOptions}
            customers={state.customerData}
            date={state.selectedDate}/>
          <EditDialog 
            open={state.openEditDialog} 
            handleClose={
              React.useCallback(() => {
                handleDialogToggle('', {}, 'openEditDialog', false);
              }, [handleDialogToggle])} 
            row={state.selectedRecord} 
            fetchData={fetchData} 
            products={state.productOptions} 
            customers={state.customerData}/>
        </Paper>
      </Box>
    </Box>
  )
}