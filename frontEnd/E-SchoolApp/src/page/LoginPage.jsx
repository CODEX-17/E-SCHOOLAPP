import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import style from './LoginPage.module.css'
import logoWhite from '../assets/logo-white.png'
import logoBlue from '../assets/logo.png'
import { useAccountStore } from '../stores/useAccountsStore'

const LoginPage = () => {

const navigate = useNavigate()
const [urlImage, seturlImage] = useState(true)
const [isChecked, setisChecked] = useState(false)
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState(false)
const { getAccounts, account } = useAccountStore()

  useEffect(() => {
    getAccounts()
    const authtoken = JSON.parse(localStorage.getItem('authtoken'))
    const user = JSON.parse(localStorage.getItem('user'))

    if ( authtoken || user ) {
        navigate('/home')
    }

  },[])


const handleHoverLogo = () => {
    seturlImage(!urlImage);
    
}

const handleShowPass = () => {
    setisChecked(!isChecked);
}

const handleSubmit = (e) => {
    e.preventDefault()

    const accountVerified = account.filter(acct => acct.email === email && acct.password === password)
    console.log(accountVerified)
    console.log('dsds')

    if (accountVerified.length > 0) {
        localStorage.setItem('user', JSON.stringify(accountVerified[0]))
        localStorage.setItem('authtoken', JSON.stringify(true))
        console.log('token'+ JSON.parse(localStorage.getItem('authtoken')))
        console.log('user'+ JSON.parse(localStorage.getItem('user')))
        navigate('/home')
    }else {
        console.log('error')
        localStorage.removeItem('user')
        localStorage.removeItem('authtoken')
        setError(true)
        setTimeout(() => {
            setError(false)
        }, 3000);
        
    }
}

const handlePassword = (e) => {
    setPassword(e.target.value)
    setError(false)
}

const handleEmail = (e) => {
    setEmail(e.target.value)
    setError(false)
}

  return (
    
    <div className={style.container}>
        <div className={style.content}>
            <div className={style.left}>
                <img src={urlImage? logoBlue : logoWhite} alt="logo" width={400} onMouseEnter={handleHoverLogo}/>
            </div>
            <div className={style.right}>
                <div className={style.top}>
                    <h1 id={style.title}>LOGIN</h1>
                    <p id={style.subtitle}>you account</p>
                </div>
                <div className={style.bot}>
                    <form action="" className='form' onSubmit={handleSubmit}>
                        <div className={style.inputDiv}>
                            <input type="email" placeholder='Email' onChange={handleEmail} required/>
                            <input type={isChecked ? "text" : "password"} placeholder='Password' onChange={handlePassword} required/>
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