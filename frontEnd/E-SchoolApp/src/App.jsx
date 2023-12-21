import './App.css';
import HomePage from './page/HomePage';
import LoginPage from './page/LoginPage';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAccountStore } from './stores/useAccountsStore';
import { useEffect, useState } from 'react';

function App() {

  const [logginIn, setlogginIn] = useState(false)

  useEffect(() => {
    const authtoken = localStorage.getItem('authtoken')
    if (authtoken) {
      setlogginIn(true)
    }
  },[])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage/>} />
          <Route path="/home" element={<HomePage/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
