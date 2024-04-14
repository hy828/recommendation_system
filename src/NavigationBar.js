import * as React from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Button, MenuItem, Badge } from '@mui/material';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home, Search, AccountCircle, Logout, CalendarMonth, PeopleAlt } from '@mui/icons-material'; // Example icon

export default function NavigationBar() {
  const navigate = useNavigate();
  const pages = ['首页', '搜索', '跟进管理', '用户管理'];
  const settings = ['个人中心', '登出'];

  const pageIcons = {
    '首页': <Home />,
    '搜索': <Search />,
    '跟进管理': <CalendarMonth />,
    '用户管理': <PeopleAlt />,
    '个人中心': <AccountCircle />,
    '登出': <Logout />,
  };

  // 处理页面跳转
  const handlePageClick = (page) => {
    if (page === '首页') {
      navigate('/home');
    } else if (page === '搜索') {
      navigate('/search');
    } else if (page === '跟进管理') {
      navigate('/service');
    } else if (page === '用户管理') {
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
              <ListItemButton onClick={() => handlePageClick(page)}>
                <ListItemIcon sx={{ color: 'inherit' }}>
                  {pageIcons[page]}
                </ListItemIcon>
                <ListItemText primary={page} />
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
    // <AppBar position="absolute">
    //   <Container maxWidth="xl">
    //     <Toolbar disableGutters>
    //       <Typography noWrap variant="h6" component="h3"
    //         sx={{ 
    //           mr: 2, 
    //           display: { xs: 'none', md: 'flex' }, 
    //           fontFamily: 'monospace',
    //           fontWeight: 700, 
    //           letterSpacing: '.3rem', 
    //           color: 'inherit',
    //           textDecoration: 'none',
    //           }}
    //       >
    //         辅助营销推荐系统平台
    //       </Typography>
    //       <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
    //         {pages.map((page) => (
    //           <Button key={page} sx={{ my: 2, color: 'white', display: 'block' }}
    //             onClick={() => handlePageClick(page)}>
    //             {page}
    //           </Button>
    //         ))}
    //       </Box>

    //       <Box sx={{ flexGrow: 1 }} />
    //       <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
    //         {/* <IconButton
    //           size="large"
    //           aria-label="show 17 new notifications"
    //           onClick={() => handlePageClick('通知')}
    //           color="inherit"
    //         >
    //           <Badge badgeContent={17} color="error">
    //             <NotificationsIcon />
    //           </Badge>
    //         </IconButton> */}
    //         <IconButton
    //           size="large"
    //           edge="end"
    //           aria-label="account of current user"
    //           aria-haspopup="true"
    //           onClick={handleProfileMenuOpen}
    //           color="inherit"
    //         >
    //           <AccountCircle />
    //         </IconButton>
    //       </Box>
    //       <Menu keepMounted id="menu-appbar" anchorEl={anchorElUser}
    //         sx={{ mt: '45px' }}
    //         anchorOrigin={{
    //           vertical: 'top',
    //           horizontal: 'right',
    //         }}
    //         transformOrigin={{
    //           vertical: 'top',
    //           horizontal: 'right',
    //         }}
    //         open={Boolean(anchorElUser)}
    //         onClose={() => { setAnchorElUser(null); }}
    //       >
    //         {settings.map((setting) => (
    //           <MenuItem key={setting} onClick={() => handlePageClick(setting)}>
    //             <Typography textAlign="center">{setting}</Typography>
    //           </MenuItem>
    //         ))}
            
    //       </Menu>
    //     </Toolbar>
    //   </Container>
    // </AppBar>
  );
};