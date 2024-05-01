import Login from './Login'
import Home from './Home'
import UserManagement from './UserManagement'
import CustomerService from './CustomerService'
import Search from './Search'
import CustomerDetail from './CustomerDetail'
import PersonalCenter from './PersonalCenter'
import Notification from './Notification'
import Calendar from './Calendar'
import { Routes, Route, Navigate } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#fafafa',
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/follow" element={<Calendar />} />
        <Route path="/permission" element={<UserManagement />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/personal" element={<PersonalCenter />} />
        <Route path="/search" element={<Search />} />
          <Route path="/detail" element={<CustomerDetail />} />
      </Routes>
    </ThemeProvider>
  );
}
