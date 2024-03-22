import './App.css'
import Login from './Login'
import Home from './Home'
import CustomerManagement from './CustomerManagement'

import { Routes, Route, Navigate } from 'react-router-dom'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/customermanagement" element={<CustomerManagement />} />
    </Routes>
  );
}
