import React from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { CssBaseline, Box, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Autocomplete } from '@mui/material';
import NavigationBar from './NavigationBar';

function AddDialog({ open, handleClose, products, customers, fetchData, date }) {
  const name = localStorage.getItem("name");

  const [cid, setCid] = React.useState(null);
  const [pid, setPid] = React.useState(null);
  const [result, setResult] = React.useState(null);

  const resultOptions = [
    {
      value: 0,
      label: '无意向',
    },
    {
      value: 2,
      label: '有意向',
    },
    {
      value: 1,
      label: '已购买',
    },
  ];

  // React.useEffect(() => {console.log(result)}, []);

  const handleSubmit = async (event) => {
    event.preventDefault(); // 阻止表单默认提交行为
    const formData = new FormData(event.currentTarget); // 获取表单数据
    const date = formData.get('date');
    const content = formData.get('content');

    // console.log(date, cid, pid, content, result);
      const response = await fetch('http://127.0.0.1:5000/customerService/addRecord', {
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
        console.log('记录添加成功');
        fetchData();
        handleClose();
        window.alert(responseData.message);
      } else {
        console.log('记录添加失败');
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

function EditDialog({ open, handleClose, row, fetchData, products, customers, isRequired }) {

  const resultOptions = [
    {
      id: 0,
      label: '无意向',
    },
    {
      id: 2,
      label: '有意向',
    },
    {
      id: 1,
      label: '已购买',
    },
  ];

  const [state, setState] = React.useState({
    cid: null,
    pid: null,
    result: null,
    openConfirmDialog: false
  });
  const name = localStorage.getItem("name");

  React.useEffect(() => {
    setState(prevState => ({
      ...prevState,
      cid: row.cid,
      pid: row.pid,
      result: row.result
    }));
  }, [row]);

  const handleDelete = () => {
    setState({ ...state, openConfirmDialog: true})
  }

  const handleCloseAll = () => {
    setState({ ...state, openConfirmDialog: false });
    handleClose(); // This should close the EditDialog
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // 阻止表单默认提交行为
    const formData = new FormData(event.currentTarget); // 获取表单数据
    const date = formData.get('date');
    const content = formData.get('content');

    console.log('date:', date, 'cid:', state.cid, 'pid:', state.pid, 'content:', content, 'result:', state.result);
    const response = await fetch('http://127.0.0.1:5000/customerService/updateRecord', {
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
      console.log(row.sid,'记录更新成功');
      fetchData();
      handleClose();
      window.alert(responseData.message);
    } else {
      console.log(row.sid,'记录更新失败');
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
                setState({ ...state, cid: newValue.id });
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
                setState({ ...state, pid: newValue.id });
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
                setState({ ...state, result: newValue.id });
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
        handleClose={() => {setState({ ...state, openConfirmDialog: false})}}  // Pass the new handler that closes both dialogs
        handleFinalize={handleCloseAll}  // Handling after confirmation
        row={row}
        fetchData={fetchData}
      />
    </Dialog>
  );
}

function ConfirmDialog({ open, handleClose, handleFinalize, row, fetchData }) {
  const sid = row.sid;

  const handleConfirm = async () => {
    const response = await fetch('http://127.0.0.1:5000/customerService/deleteRecord', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sid }),
    });
    const responseData = await response.json();

    if (response.ok) {
      console.log(sid,'记录删除成功');
      fetchData();
      handleFinalize();
      window.alert(responseData.message);
    } else {
      console.log(sid,'记录删除失败');
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

export default function Notification() {
  const [state, setState] = React.useState({
    openAddDialog: false,
    openEditDialog: false,
    openConfirmDialog: false,
    selectedDate: null,
    selectedRecord: {},
    productOptions: [],
    customerData: [],
    titleKey: 'customerName',
    events: [],
    records: [],
  });

  const resultColorMapping = {
    '无意向': 'gray',
    '有意向': 'red',
    '已购买': 'green',
    '待补充': 'orange',
    '无': 'blue'
  };

  const handleDialogToggle = React.useCallback((date, row, dialogName, isOpen) => {
    setState((prevState) => ({
      ...prevState,
      selectedDate: date,
      selectedRecord: row,
      [dialogName]: isOpen,
    }));
  }, []);

  const handleEventClick = async (info) => {
    const sid = info.event.extendedProps.sid
    const response = await fetch('http://127.0.0.1:5000/customerService/queryRecord?query=' + encodeURIComponent(sid));
    if (!response.ok) {
      throw new Error('无法获取用户数据');
    }
    const data = await response.json();
    const row = data.record
    handleDialogToggle(null, row, 'openEditDialog', true);
  }

  const handleDateClick = (info) => {
    const date = info.dateStr;
    handleDialogToggle(date, {}, 'openAddDialog', true);
  }

  const convertToCalendarEvents = (data, titleKey) => {
    return data.map(record => ({
      id: record.sid,
      title: record[titleKey],  // Dynamically set the title based on user's choice
      date: record.date,
      color: resultColorMapping[record.result],
      extendedProps: {
        sid: record.sid,
      }
    }));
  };

  const toggleTitleKey = () => {
    setState(prevState => ({
      ...prevState,
      titleKey: prevState.titleKey === 'customerName' ? 'product' : 'customerName',
      events: convertToCalendarEvents(state.records, prevState.titleKey === 'customerName' ? 'product' : 'customerName')
    }));
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/customerService/queryAllRecords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem("token")
      }})
      if (!response.ok) {
        throw new Error('无法获取用户数据');
      }
      const data = await response.json();
      const records = data.records
      const events = convertToCalendarEvents(records, state.titleKey);

      const response2 = await fetch('http://127.0.0.1:5000/dataVisualization/getProductOptions');
      if (!response.ok) {
        throw new Error('无法获取用户数据');
      }
      const data2 = await response2.json();
      const products = data2.products;

      const response3 = await fetch('http://127.0.0.1:5000/customerService/queryCustomers');
      if (!response.ok) {
        throw new Error('无法获取用户数据');
      }
      const data3 = await response3.json();
      const customers = data3.customers

      setState(prevState => ({
        ...prevState,
        events: events,
        records: records,
        productOptions: products,
        customerData: customers,
      }));
    } catch (error) {
      console.error('用户数据获取失败:', error);
    }
  };

  return (
    <Box>
      <CssBaseline />
      <NavigationBar />
      <Box sx={{ m: 10 }}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 630,
          }}>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
            initialView="dayGridMonth"
            locale={'zh-cn'}
            headerToolbar={{
              start: 'prev,next today', // Buttons on the left
              center: 'title',   // Title in the center
              end: 'dayGridMonth,listMonth changeTitleKey'     // Custom element on the right
            }}
            buttonText={{today: '今天', dayGridMonth: '网格', listMonth: '列表'}}
            customButtons={{
              changeTitleKey: {
                text: state.titleKey === 'customerName' ? '产品' : '客户',
                click: toggleTitleKey
              }
            }}
            weekends={true}
            events={state.events}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            height="100%"
          />
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
            customers={state.customerData} 
            isRequired={true}/>
        </Paper>
      </Box>
    </Box>
  )
}