import * as React from 'react';
import { CssBaseline, Box, Paper, Typography, Dialog, DialogTitle, DialogContent, Stack, TextField, DialogActions, Button } from '@mui/material';
import NavigationBar from './NavigationBar';

function ChangePasswordDialog({ open, handleClose }) {
  const handleSubmit = async (event) => {
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
    }

    if (newPassword !== confirmPassword) {
      window.alert('密码和确认密码不一致');
      return;
    }

    const response = await fetch('http://127.0.0.1:5000/users/changePassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem("token")
      },
      body: JSON.stringify({
        'oldPassword': oldPassword,
        'newPassword': newPassword,
      }),
    });
    const responseData = await response.json(); // 解析返回的 JSON 数据

    if (response.ok) {
      console.log('修改密码成功');
      handleClose(); // 关闭对话框
      window.alert(responseData.message);
    } else {
      console.log('修改密码失败');
      // 显示错误信息
      window.alert(responseData.message);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ component: 'form', onSubmit: handleSubmit }}>
      <DialogTitle>修改密码</DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <TextField
            autoFocus
            required
            margin="dense"
            id="oldPassword"
            name="oldPassword"
            label="原密码"
            type="password"
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="newPassword"
            name="newPassword"
            label="密码"
            type="password"
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="confirmPassword"
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

export default function PersonalCenter() {
  const [openDialog, setOpenDialog] = React.useState(false);
  
  return (
    <Box>
      <CssBaseline />
      <NavigationBar />
      <Box sx={{ mx: 15, pt: 15 }}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 550,
          }}>
            <Typography>ID</Typography>
            <Typography>姓名</Typography>
            <Typography>联系方式</Typography>
            <Typography>电子邮件</Typography>
            <Button onClick={() => setOpenDialog(true)}>修改密码</Button>
            <ChangePasswordDialog open={openDialog} handleClose={() => setOpenDialog(false)}/>
        </Paper>
      </Box>
    </Box>
  )
}