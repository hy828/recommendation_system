import * as React from 'react';
import { Button, CssBaseline, TextField, Box, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate(); // 导航函数

  // 向后端发送登录请求，获取 token
  const handleSubmit = async (event) => {
    event.preventDefault(); // 阻止表单默认提交行为
    const username = new FormData(event.currentTarget).get('username');
    const password = new FormData(event.currentTarget).get('password');
    // console.log('登录界面-用户名和密码：', {username, password});
    const response = await fetch('http://127.0.0.1:5000/personal_center/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'username': username, 'password': password }),
    });
    const responseData = await response.json(); // 解析返回的 JSON 数据

    if (response.ok) {
        console.log('登录成功');
        // setOpen(true);
        localStorage.setItem("token", responseData.token);
        localStorage.setItem("userPermission", responseData.userPermission);
        localStorage.setItem("name", responseData.name);
        // console.log('登录界面-userPermission：', localStorage.getItem("userPermission"));
        navigate('/home'); // 跳转到系统首页
        // window.alert(responseData.message);
    } else {
        // console.log('登录失败');
        window.alert(responseData.message);
    }
  };

  return (
    <Box>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 15,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* 系统名称 */}
          <Typography component="h5" variant="h4"
            sx={{ 
              my: 5, 
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
          <Typography component="h5" variant="h5">
            登录
          </Typography>
          {/* 登录表单 */}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ my: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="用户名"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="密码"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 5, mb: 2 }}
            >
              登录
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}