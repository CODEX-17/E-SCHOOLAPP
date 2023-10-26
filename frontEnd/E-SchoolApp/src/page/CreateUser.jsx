import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CreateUser = () => {

    const [name, setName] = useState()
    const [age, setAge] = useState()
    const [email, setEmail] = useState()
    const navigate = useNavigate()

    const submit = (e)=> {
        e.preventDefault();
        axios.post("http://localhost:3001/createUser", {name, email, age})
        .then(result => {
            console.log(result),
            navigate('/view')
        })
        .catch(error => console.log(error))
    }

  return (
    <div className='container bg-primary vw-100 vh-100 d-flex align-items-center justify-content-center'>
        <form className='form border p-5 rounded bg-white' onSubmit={submit}>
            <h1>Create Student</h1>
            <div className="mb-3">
                <label className="form-label">Name</label>
                <input type="text" className="form-control" placeholder='Enter Name...' onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" placeholder='Enter Email...' onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-3">
                <label className="form-label">Age</label>
                <input type="text" className="form-control" placeholder='Enter Age' onChange={(e) => setAge(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    </div>
  )
}

export default CreateUser