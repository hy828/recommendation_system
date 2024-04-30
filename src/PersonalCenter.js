import * as React from 'react';
import { CssBaseline, Box, Paper, Typography, Dialog, DialogTitle, DialogContent, Stack, TextField, DialogActions, Button, List, ListItemButton, ListItemIcon, ListItemText, Divider, Tabs, Tab, Grid, Chip, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import NavigationBar from './NavigationBar';
import { LocalPhone, Email, Forum, Badge, Person, Wc } from '@mui/icons-material';

export default function PersonalCenter() {
  const [activeSetting, setActiveSetting] = React.useState('basic');
  const [info, setInfo] = React.useState({});
  const [isEdit, setIsEdit] = React.useState(0);
  const [formData, setFormData] = React.useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    openConfirmDialog: false,
  });

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch('http://127.0.0.1:5000/personal_center/query_personal_info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem("token")
    }})
    if (response.ok) {
      const data = await response.json();
      const record = data.record
      setInfo(record);
    } else {
      console.log('获取数据失败')
      // window.alert()
    }
    
  }

  const handleOpenSettings = (event, newValue) => {
    setActiveSetting(newValue);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleConfirm = async () => {
    const oldp = formData.oldPassword;
    const newp = formData.newPassword;
    const response = await fetch('http://127.0.0.1:5000/personal_center/change_password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem("token")
      },
      body: JSON.stringify({
        'oldPassword': oldp,
        'newPassword': newp,
      }),
    });
    const responseData = await response.json(); // 解析返回的 JSON 数据

    if (response.ok) {
      console.log('修改密码成功');
    } else {
      console.log('修改密码失败');
    }
    setFormData({
      oldPassword: '', 
      newPassword: '', 
      confirmPassword: '',
      openConfirmDialog: false });
    window.alert(responseData.message);
  };

  const handleChangePassword = async (event) => {
    event.preventDefault(); // 阻止表单默认提交行为
    const formData = new FormData(event.currentTarget); // 获取表单数据
    const oldPassword = formData.get('oldPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');
    console.log('修改密码界面-旧密码和新密码：', {oldPassword, newPassword});
    
    // 校验数据
    if (!newPassword || !confirmPassword || !oldPassword) {
      window.alert('请填写完整所有字段');
      return;
    } else if (newPassword !== confirmPassword) {
      window.alert('密码和确认密码不一致');
      return;
    } else {
      setFormData({ 
        oldPassword: oldPassword, 
        newPassword: newPassword, 
        confirmPassword: confirmPassword,
        openConfirmDialog: true })
    }
  };

  const handleUpdateInfo = async (event) => {
    event.preventDefault(); // 阻止表单默认提交行为
    const formData = new FormData(event.currentTarget); // 获取表单数据
    const name = formData.get('name');
    const phone_no = formData.get('phone_no');
    const email = formData.get('email');
    const wechatid = formData.get('wechatid');
    console.log({name, phone_no, email, wechatid});
    
    // 校验数据
    if (!name || !phone_no || !email || !wechatid) {
      window.alert('请填写完整所有字段');
      return;
    } else {
      const response = await fetch('http://127.0.0.1:5000/personal_center/update_info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem("token")
        },
        body: JSON.stringify({
          'name': name,
          'phone_no': phone_no,
          'email': email,
          'wechatid': wechatid,
        }),
      });
      const responseData = await response.json(); // 解析返回的 JSON 数据

      if (response.ok) {
        console.log('个人信息更新成功');
        fetchData();
        setIsEdit(0);
      } else {
        console.log('个人信息更新失败');
      }
    }
  };

  return (
    <Box>
      <CssBaseline />
      <NavigationBar />
      <Box sx={{ ml: 33, my: 8, mr: 8}}>
        <Paper
          sx={{
            // p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 600,
          }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs centered variant="fullWidth" value={activeSetting} onChange={handleOpenSettings}>
                <Tab label="基本设置" value='basic'/>
                <Tab label="安全设置" value='security' />
              </Tabs>
            </Box>
            <Box sx={{ py: 5, px: 10, flex: 1, display: 'flex', flexDirection: 'column' }}>
              {activeSetting === 'basic' && (
                <Box component='form' onSubmit={handleUpdateInfo} >
                  <Typography variant="h6" sx={{ mb: 4 }}>个人信息</Typography>
                  <Grid container rowSpacing={3} columnSpacing={0} sx={{ '& > *': { height: 60 } }}>
                    <Grid item xs={1}>
                      <Badge />
                    </Grid>
                    <Grid item xs={2}>
                      <Typography>ID</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography>
                        {info.id}
                        <Chip label={info.permission ? '高级用户' : '普通用户'} variant="outlined" size='small' sx={{ ml: 2 }}/>
                      </Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Person />
                    </Grid>
                    <Grid item xs={2}>
                      <Typography>姓名</Typography>
                    </Grid>
                    <Grid item xs={9}>{ 
                        isEdit ?
                        <TextField name='name' variant="standard" size='small' required hiddenlabel fullWidth defaultValue={info.name} /> :
                        <Typography>{info.name}</Typography>
                    }</Grid>
                    <Grid item xs={1}>
                      <Wc />
                    </Grid>
                    <Grid item xs={2}>
                      <Typography>性别</Typography>
                    </Grid>
                    <Grid item xs={9}>{ 
                        isEdit ?
                        (<RadioGroup row value={info.gender} name="gender" sx={{ '& .MuiSvgIcon-root': { fontSize: 16 }, '& .MuiTypography-body1': { fontSize: 16 } }}>
                          <FormControlLabel value="1" control={<Radio/>} label="男" />
                          <FormControlLabel value="0" control={<Radio/>} label="女" />
                        </RadioGroup>) :
                        <Typography>{info.gender ? '男' : '女'}</Typography>
                    }</Grid>
                    <Grid item xs={1}>
                      <LocalPhone />
                    </Grid>
                    <Grid item xs={2}>
                      <Typography>电话号码</Typography>
                    </Grid>
                    <Grid item xs={9}>{ 
                        isEdit ?
                        <TextField name='phone_no' variant="standard" size='small' required hiddenlabel fullWidth defaultValue={info.phone_no} type='tel'/> :
                        <Typography>{info.phone_no}</Typography>
                    }</Grid>
                    <Grid item xs={1}>
                      <Email />
                    </Grid>
                    <Grid item xs={2}>
                      <Typography>电子邮箱</Typography>
                    </Grid>
                    <Grid item xs={9}>{ 
                        isEdit ?
                        <TextField name='email' variant="standard" size='small' required hiddenlabel fullWidth defaultValue={info.email} type='email' /> :
                        <Typography>{info.email}</Typography>
                    }</Grid>
                    <Grid item xs={1}>
                      <Forum />
                    </Grid>
                    <Grid item xs={2}>
                      <Typography>微信</Typography>
                    </Grid>
                    <Grid item xs={9}>{ 
                      isEdit ?
                      <TextField name='wechatid' variant="standard" size='small' required hiddenlabel fullWidth defaultValue={info.wechatid} /> :
                      <Typography>{info.wechatid}</Typography>
                    }</Grid>
                  </Grid>
                  {
                    isEdit ?
                    (<Box fullWidth sx={{ display: "flex", justifyContent: 'flex-end' }}>
                      <Button variant="contained" sx={{ mt: 2, mr: 5 }} onClick={() => setIsEdit(0)}>取消</Button>
                      <Button variant="contained" sx={{ mt: 2 }} type="submit">完成</Button>
                    </Box>) :
                    (<Box fullWidth sx={{ display: "flex", justifyContent: 'flex-end' }}>
                      <Button variant="contained" sx={{ mt: 2 }} onClick={() => setIsEdit(1)}>编辑</Button>
                    </Box>)
                  }
                </Box>
              )}
              {activeSetting === 'security' && (
                <Box component='form' onSubmit={handleChangePassword} >
                  <Typography variant="h6">修改密码</Typography>
                  <TextField required margin="normal" name="oldPassword" label="原密码" type="password" fullWidth variant="standard" value={formData.oldPassword} onChange={handleChange}/>
                  <TextField required margin="normal" name="newPassword" label="新密码" type="password" fullWidth variant="standard" value={formData.newPassword} onChange={handleChange}/>
                  <TextField required margin="normal" name="confirmPassword" label="确认密码" type="password" fullWidth variant="standard" value={formData.confirmPassword} onChange={handleChange}/>
                  <Box fullWidth sx={{ display: "flex", justifyContent: 'flex-end' }}>
                    <Button variant="contained" sx={{ mt: 2 }} type="submit">完成</Button>
                  </Box>
                  <Dialog open={formData.openConfirmDialog} onClose={() => {setFormData({...formData, openConfirmDialog: false})}} maxWidth="sm" fullWidth>
                    <DialogTitle>确认修改密码？</DialogTitle>
                    <DialogActions>
                      <Button onClick={() => {setFormData({...formData, openConfirmDialog: false})}} color="primary">取消</Button>
                      <Button onClick={handleConfirm} color="primary" autoFocus>确定</Button>
                    </DialogActions>
                  </Dialog>
                </Box>
              )}
            </Box>
            {/* 
              <Typography>ID</Typography>
              <Typography>姓名</Typography>
              <Typography>联系方式</Typography>
              <Typography>电子邮件</Typography>
            */}
            
            {/* <Button onClick={() => setOpenDialog(true)}>修改密码</Button>
            <ChangePasswordDialog open={openDialog} handleClose={() => setOpenDialog(false)}/> */}
        </Paper>
      </Box>
    </Box>
  )
}