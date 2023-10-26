import './App.css';
import HomePage from './page/HomePage';
import LoginPage from './page/LoginPage';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAccountStore } from './stores/useAccountsStore';
import { useEffect } from 'react';

function App() {

  const { isAuthenticated, getAccounts, account, updateisAuthenticated } = useAccountStore()
  
  useEffect(()=> {
    getAccounts()
    console.log('execute getting accounts...')
  },[])

  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage/>} />
        
          <Route path="/" element={<LoginPage/>} />
          {
            <Route path='/home' element={ isAuthenticated ? <HomePage /> : <Navigate to="/login" />}/>
          }
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
