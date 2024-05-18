import Login from './Login'
import Home from './Home'
import UserManagement from './UserManagement'
import Search from './Search'
import CustomerDetail from './CustomerDetail'
import PersonalCenter from './PersonalCenter'
import Calendar from './Calendar'
import { Routes, Route, Navigate } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles';

// 设置主题
const defaultTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#fafafa', // 设置默认背景色，浅灰色
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      {/* 路由配置 */}
      <Routes>
        {/* 默认跳转到登录页 */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/follow" element={<Calendar />} />
        <Route path="/permission" element={<UserManagement />} />
        <Route path="/personal" element={<PersonalCenter />} />
        <Route path="/search" element={<Search />} />
          <Route path="/detail" element={<CustomerDetail />} />
      </Routes>
    </ThemeProvider>
  );
}
