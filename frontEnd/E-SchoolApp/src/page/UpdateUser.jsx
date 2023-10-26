import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const UpdateUser = () => {
    const {id} = useParams()
    const [name, setName] = useState()
    const [age, setAge] = useState()
    const [email, setEmail] = useState()
    const navigate = useNavigate()
    const [student, setStudent] = useState([])

    useEffect(() => {
        axios.get('http://localhost:3001/update:'+id)
        .then(result => console.log(result.data))
        .catch(error => console.log(error))
    },[])

    const submit = () => {

    }

  return (
    <div>
         <div className='container bg-primary vw-100 vh-100 d-flex align-items-center justify-content-center'>
            <form className='form border p-5 rounded bg-white' onSubmit={submit}>
                <h1>Update Student</h1>
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
    </div>
  )
}

export default UpdateUser