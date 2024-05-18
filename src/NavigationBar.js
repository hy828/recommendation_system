import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home, Search, AccountCircle, Logout, CalendarMonth, PeopleAlt } from '@mui/icons-material';

export default function NavigationBar() {
  const navigate = useNavigate();
  const pages = ['首页', '搜索', '跟进管理', '同事列表'];
  const settings = ['个人中心', '登出'];
  const userPermission = localStorage.getItem("userPermission");

  const pageIcons = {
    '首页': <Home />,
    '搜索': <Search />,
    '跟进管理': <CalendarMonth />,
    '同事列表': <PeopleAlt />,
    '个人中心': <AccountCircle />,
    '登出': <Logout />,
  };

  // 处理页面跳转
  const handlePageClick = (page) => {
    if (page === '跟进管理' && userPermission === 1) {
      return; // 禁止点击操作
    }
    if (page === '首页') {
      navigate('/home');
    } else if (page === '搜索') {
      navigate('/search');
    } else if (page === '跟进管理') {
      navigate('/follow');
    } else if (page === '同事列表') {
      navigate('/permission');
    } else if (page === '通知') {
      navigate('/notification');
    } else if (page === '个人中心') {
      navigate('/personal');
    } else { // 登出
      localStorage.removeItem("userPermission");
      localStorage.removeItem("token");
      navigate('../login', { replace: true });
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 200,
        [`& .MuiDrawer-paper`]: { width: 200, boxSizing: 'border-box', bgcolor: 'primary.dark', color: 'white' },
      }}
    >
      <Typography noWrap variant="h6" component="h3"
        sx={{ 
          m: 2, 
          display: { xs: 'none', md: 'flex' }, 
          // fontFamily: 'monospace',
          fontWeight: 600, 
          // letterSpacing: '.3rem', 
          color: 'inherit',
          textDecoration: 'none',
          }}
      >
        辅助营销推荐系统
      </Typography>
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {pages.map((page) => (
            <ListItem key={page} disablePadding>
              <ListItemButton onClick={() => handlePageClick(page)} disabled={page === '跟进管理' && userPermission === '1'}>
                <ListItemIcon sx={{ color: 'inherit' }}>
                  {pageIcons[page]}
                </ListItemIcon>
                <ListItemText primary={userPermission === '1' && page === '同事列表' ? '权限管理' : page} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 1, bgcolor: 'rgba(255, 255, 255, 0.3)' }} />
        <List>
          {settings.map((setting) => (
            <ListItem key={setting} disablePadding>
              <ListItemButton onClick={() => handlePageClick(setting)}>
                <ListItemIcon sx={{ color: 'inherit' }}>
                  {pageIcons[setting]}
                </ListItemIcon>
                <ListItemText primary={setting} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};