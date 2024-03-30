import Login from './Login'
import Home from './Home'
import PermissionManagement from './PermissionManagement'
import Search from './Search'
import { Routes, Route, Navigate } from 'react-router-dom'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/permission" element={<PermissionManagement />} />
      <Route path="/search" element={<Search />} />
    </Routes>
  );
}
