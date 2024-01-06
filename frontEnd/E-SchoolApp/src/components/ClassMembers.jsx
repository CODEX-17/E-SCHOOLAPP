import React, { useEffect, useState } from 'react'
import style from './ClassMembers.module.css'
import { useMemberStore } from '../stores/useMemberStore'
import axios from 'axios'
import { BiExit } from "react-icons/bi"
import sample from '../assets/sample.jpg'
import { AiOutlineDelete } from "react-icons/ai"
import { CgAddR } from "react-icons/cg";

const ClassMembers = ({ memberID }) => {

  const [allMembers, setallMembers] = useState(JSON.parse(localStorage.getItem('members')))
  const [currentMembers, setcurrentMembers] =useState()
  const currentAccount = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    if (allMembers) {
      const filter = allMembers.filter((member) => member.membersID === memberID)
      setcurrentMembers(filter)
    }
  },[])

  return (
    <div className={style.container}>
      <h2>Class Members</h2>
      <div className={style.head}>
        <h2 id={style.labelAdmin}>Class Admin</h2>
        <div className={style.card}>
          <img src={sample} alt="dp" id={style.dpImg}/>
          <p>Rumar C. Pamparo</p>
        </div>
      </div>
      <div className='d-flex align-items-center mt-4 gap-2 p-2'>
        <h2 id={style.memberLabel}>Members</h2>
        {
          currentAccount.acctype === 'faculty' && (
            <CgAddR className={style.addMembers} title='add members'/>
          )
        }
      </div>
      <div className={style.listView}>
      {
        currentMembers ? (
          currentMembers.map((member, index) => (
            <div className={style.head} key={index}>
              <div className={style.cardMember}>
                <img src={sample} alt="dp" id={style.dpImg}/>
                <p>{member.firstName+' '+member.midleName+' '+member.lastName}</p>
                {
                  currentAccount.acctype === 'faculty' && (
                    <AiOutlineDelete id={style.deleteIcon}/>
                  )
                }
                
              </div>
            </div>
          ))) : (<p>Loading..</p>)
      }
       
      </div>
    </div>
  )
}

export default ClassMembers