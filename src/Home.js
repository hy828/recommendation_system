import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import GroupsIcon from '@mui/icons-material/Groups';
import RecommendIcon from '@mui/icons-material/Recommend';
import BarChartIcon from '@mui/icons-material/BarChart';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import { useNavigate } from 'react-router-dom';
import CustomerManagement from './CustomerManagement';
import CustomerService from './CustomerService';
import ProductRecommendation from './ProductRecommendation';
import DataVisualization from './DataVisualization';
import AuthorityManagement from './AuthorityManagement';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Home() {
  const [open, setOpen] = React.useState(false);
  const [selectedPage, setSelectedPage] = React.useState(1);
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleLogOut = () => {
    navigate('../login');
  };

  const handleListItemButtonClick = (buttonId) => {
    console.log('Item clicked:', buttonId);
    setSelectedPage(buttonId);
    setOpen(false);
  };

  const mainListItems = (
    <React.Fragment>
      <ListItemButton onClick={() => handleListItemButtonClick(1)} sx={selectedPage === 1 ? { backgroundColor: '#e0e0e0' } : {}}>
        <ListItemIcon>
          <GroupsIcon />
        </ListItemIcon>
        <ListItemText primary="客户管理" />
      </ListItemButton>
      <ListItemButton onClick={() => handleListItemButtonClick(2)} sx={selectedPage === 2 ? { backgroundColor: '#e0e0e0' } : {}}>
        <ListItemIcon>
          <QuestionAnswerIcon />
        </ListItemIcon>
        <ListItemText primary="客户服务" />
      </ListItemButton>
      <ListItemButton onClick={() => handleListItemButtonClick(3)} sx={selectedPage === 3 ? { backgroundColor: '#e0e0e0' } : {}}>
        <ListItemIcon>
          <RecommendIcon />
        </ListItemIcon>
        <ListItemText primary="产品功能推荐" />
      </ListItemButton>
      <ListItemButton onClick={() => handleListItemButtonClick(4)} sx={selectedPage === 4 ? { backgroundColor: '#e0e0e0' } : {}}>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="数据可视化" />
      </ListItemButton>
    </React.Fragment>
  );
  
  const secondaryListItems = (
    <React.Fragment>
      <ListItemButton onClick={() => handleListItemButtonClick(5)} sx={selectedPage === 5 ? { backgroundColor: '#e0e0e0' } : {}}>
        <ListItemIcon>
          <LockPersonIcon />
        </ListItemIcon>
        <ListItemText primary="权限管理" />
      </ListItemButton>
    </React.Fragment>
  );

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              辅助营销推荐系统平台
            </Typography>
            <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleLogOut}
                color="inherit"
              >
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
            {selectedPage === 1 && (<CustomerManagement/>)}
            {selectedPage === 2 && (<CustomerService/>)}
            {selectedPage === 3 && (<ProductRecommendation/>)}
            {selectedPage === 4 && (<DataVisualization/>)}
            {selectedPage === 5 && (<AuthorityManagement/>)}
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}