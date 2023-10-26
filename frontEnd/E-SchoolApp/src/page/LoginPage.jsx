import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import style from './LoginPage.module.css'
import logoWhite from '../assets/logo-white.png'
import logoBlue from '../assets/logo.png'
import axios from 'axios'
import { useAccountStore } from '../stores/useAccountsStore'

const LoginPage = () => {

const navigate = useNavigate()
const [urlImage, seturlImage] = useState(true)
const [isChecked, setisChecked] = useState(false)
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState('')
const { updateStatus, account, getAccounts, isAuthenticated, updateAccountFiltered, updateisAuthenticated, accountFiltered } = useAccountStore()


const dataAccount = JSON.parse(localStorage.getItem('accounts'))
const user = JSON.parse(localStorage.getItem('user'))

if (user) {
    useEffect(() => {
        console.log(user.status)
        if (user.status === 'login') {
            updateisAuthenticated(true)
            navigate('/home')
        }
    },[])
}


const handleHoverLogo = () => {
    seturlImage(!urlImage);
    
}

const handleShowPass = () => {
    setisChecked(!isChecked);
}

const handleSubmit = (e) => {
    e.preventDefault();
    const dataFilter = dataAccount.find(acct => acct.email === email && acct.password === password)
    console.log(dataFilter.id)
    if (dataFilter) {
        const id = dataFilter.id
        const status = 'login'
        updateStatus( id, status )
        console.log('login Successfully!')
        updateAccountFiltered(dataFilter)
        updateisAuthenticated(true)
        navigate('/home')
    
    }else {
        console.log('Incorrect Password!')
        setError(true)
    }
}

  return (
    
    <div className={style.container}>
        <div className={style.content}>
            <div className={style.left}>
                <img src={urlImage? logoBlue : logoWhite} alt="logo" width={400} onMouseEnter={handleHoverLogo}/>
            </div>
            <div className={style.right}>
                <div className={style.top}>
                    <h1 id={style.title}>Login</h1>
                    <p id={style.subtitle}>your ACCOUNT</p>
                </div>
                <div className={style.bot}>
                    <form action="" className='form' onSubmit={handleSubmit}>
                        <div className={style.inputDiv}>
                            <input type="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)} required/>
                            <input type={isChecked ? "text" : "password"} placeholder='Password' onChange={(e) => setPassword(e.target.value)} required/>
                            <div className={style.horizontalDiv}>
                                <label id={style.label} htmlFor="checkbox">Show password?</label>
                                <input id={style.checkbox} type="checkbox" name='checkbox' checked={isChecked} onChange={handleShowPass}/>
                             </div>
                            <button className={style.btn} type="submit">Login</button>
                        </div>
                        { error && <p className={style.errorMessage}>You've Incorrect Password!</p>}
                    </form>
                </div>
            </div>
            <div className={style.footer}>
                    @All Right Reserved 2023
            </div>
        </div>
    </div>
  )
}

export default LoginPage