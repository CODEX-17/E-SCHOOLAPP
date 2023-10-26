import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

const ViewUser = () => {

const [student, setStudent] = useState([])
const navigate = useNavigate()


useEffect(() => {
    axios.get('http://localhost:5000/getAccount')
    .then(result => {setStudent(result.data)
        console.log(result.data)
    })
    .catch(error => console.log(error))
},[])


  return (
    <div className='container bg-primary vw-100 vh-100 d-flex flex-column align-items-center justify-content-center'>
        <div className='w-100 rounded border bg-white p-2'>
            <Link className='btn btn-success m-2' to={'/createUser'}>Add</Link>
            <table className="table border table-hover">
                <thead className='table-dark'>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Acctype</th>
                        <th scope="col">Email</th>
                        <th scope="col">Password</th>
                        <th scope="col" colSpan={2}>Action</th>
                    </tr>
                </thead>
                <tbody>
                        {
                            student.map((students) => {
                                return(
                                    <tr key={students.id}>
                                        <td scope="row">{students.id}</td>
                                        <td>{students.acctype}</td>
                                        <td>{students.email}</td>
                                        <td>{students.password}</td>
                                        <td><Link className='btn btn-success' to={`/update/${student._id}`}>Edit</Link></td>
                                        <td><button className='btn btn-danger'>Delete</button></td>
                                    </tr>
                                )
                            })
                        }
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default ViewUser