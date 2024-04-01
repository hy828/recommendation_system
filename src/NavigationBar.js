import * as React from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Button, MenuItem, Dialog, DialogTitle, DialogContent, Stack, TextField, DialogActions } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

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

export default function NavigationBar() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const navigate = useNavigate();
  const pages = ['首页', '搜索', '跟进管理', '用户管理'];
  const settings = ['修改密码', '登出'];

  // 处理页面跳转
  const handlePageClick = (page) => {
    if (page === '用户管理') {
      navigate('/permission');
    } else if (page === '搜索') {
      navigate('/search');
    } else if (page === '首页') {
      navigate('/home');
    } else if (page === '登出') {
      localStorage.removeItem("userPermission");
      localStorage.removeItem("token");
      navigate('../login', { replace: true });
    } else if (page === '跟进管理') {
      navigate('/service');
    } else {
      setOpenDialog(true);
    }
  };

  return (
    <AppBar position="absolute">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography noWrap variant="h6" component="h3"
            sx={{ 
              mr: 2, 
              display: { xs: 'none', md: 'flex' }, 
              fontFamily: 'monospace',
              fontWeight: 700, 
              letterSpacing: '.3rem', 
              color: 'inherit',
              textDecoration: 'none',
              }}
          >
            辅助营销推荐系统平台
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button key={page} sx={{ my: 2, color: 'white', display: 'block' }}
                onClick={() => handlePageClick(page)}>
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={(event) => { setAnchorElUser(event.currentTarget); }} sx={{ p: 0 }}>
              <AccountCircleIcon fontSize="large" color='white' />
            </IconButton>
            <Menu keepMounted id="menu-appbar" anchorEl={anchorElUser}
              sx={{ mt: '45px' }}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={() => { setAnchorElUser(null); }}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={() => handlePageClick(setting)}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
              <ChangePasswordDialog open={openDialog} handleClose={() => setOpenDialog(false)}/>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};