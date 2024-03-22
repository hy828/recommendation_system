import './App.css'
import Login from './Login'
import Home from './Home'

import { Routes, Route, Navigate } from 'react-router-dom'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}
