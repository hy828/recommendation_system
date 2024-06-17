import * as React from 'react';
import { CssBaseline, Box, Paper, Typography, Dialog, DialogTitle, TextField, DialogActions, Button, Tabs, Tab, Grid, Chip, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import NavigationBar from './NavigationBar';
import { LocalPhone, Email, Forum, Badge, Person, Wc } from '@mui/icons-material';

export default function PersonalCenter() {
  const [activeSetting, setActiveSetting] = React.useState('basic'); // 当前所在的个人中心页面 - 基本设置/安全设置
  const [info, setInfo] = React.useState({}); // 个人信息
  const [isEdit, setIsEdit] = React.useState(0); // 是否处于编辑模式
  const [formData, setFormData] = React.useState({ // 表单数据
    oldPassword: '', 
    newPassword: '',
    confirmPassword: '',
    openConfirmDialog: false,
  });

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // 向后端请求数据，获取个人信息
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
      // console.log('获取数据失败');
      window.alert('无法获取个人信息');
    }
    
  }

  const handleOpenSettings = (event, newValue) => { // 切换个人中心页面
    setActiveSetting(newValue);
  };

  const handleChange = (event) => { // 处理表单数据变化
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleConfirm = async () => {
    const oldp = formData.oldPassword;
    const newp = formData.newPassword;
    // 向后端发送修改密码请求
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
      // console.log(responseData.message);
      window.alert(responseData.message);
    } else {
      // console.log(responseData.message);
      window.alert(responseData.message);
    }
    setFormData({
      oldPassword: '', 
      newPassword: '', 
      confirmPassword: '',
      openConfirmDialog: false });
  };

  const handleChangePassword = async (event) => { // 处理修改密码表单提交
    event.preventDefault(); // 阻止表单默认提交行为
    const formData = new FormData(event.currentTarget); // 获取表单数据
    const oldPassword = formData.get('oldPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');
    // console.log('修改密码界面-旧密码和新密码：', {oldPassword, newPassword});
    
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
    const phone = formData.get('phone');
    const email = formData.get('email');
    const wechatid = formData.get('wechatid');
    const gender = formData.get('gender');
    console.log({name, phone, email, wechatid});

    const mailregex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+$/i; // 邮箱正则表达式
    const telregex = /^1[3-9]\d{9}$/; // 电话号码正则表达式
    
    // 校验数据
    if (!name || !phone || !email || !wechatid || !gender) {
      window.alert('请填写完整所有字段');
      return;
    } else if (!mailregex.test(email)) {
      window.alert('请输入正确的邮箱格式');
      return;
    } else if (!telregex.test(phone)) {
      window.alert('请输入正确的电话号码格式');
      return;
    } else {
      // 向后端发送修改个人信息请求
      const response = await fetch('http://127.0.0.1:5000/personal_center/update_info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem("token")
        },
        body: JSON.stringify({
          'name': name,
          'phone': phone,
          'email': email,
          'wechatid': wechatid,
          'gender': gender,
        }),
      });
      const responseData = await response.json(); // 解析返回的 JSON 数据

      if (response.ok) {
        // console.log(responseData.message);
        fetchData();
        setIsEdit(0);
        window.alert(responseData.message);
      } else {
        // console.log(responseData.message);
        window.alert(responseData.message);
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
              {/* 基本设置 */}
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
                        <Chip label={info.permission ? '管理员' : '客户经理'} variant="outlined" size='small' sx={{ ml: 2 }}/>
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
                        (<RadioGroup row defaultValue={parseInt(info.gender)} name="gender" sx={{ '& .MuiSvgIcon-root': { fontSize: 16 }, '& .MuiTypography-body1': { fontSize: 16 } }}>
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
                        <TextField name='phone' variant="standard" size='small' required hiddenlabel fullWidth defaultValue={info.phone} type='tel'/> :
                        <Typography>{info.phone}</Typography>
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
              {/* 安全设置 */}
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
        </Paper>
      </Box>
    </Box>
  )
}