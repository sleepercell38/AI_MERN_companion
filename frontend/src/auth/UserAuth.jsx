import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../Context/Usercontext.jsx'
import { useEffect } from 'react'





const UserAuth = ({children}) => {

       const { User } = useContext(UserContext)
    const [ loading, setLoading ] = useState(true)
    const token = localStorage.getItem('token')
    const navigate = useNavigate()




    useEffect(() => {
        if (User) {
            setLoading(false)
        }

        if (!token) {
            navigate('/login')
        }

        if (!User) {
            navigate('/login')
        }

    }, [])

    if (loading) {
        return <div>Loading...</div>
    }



  return (
    <>
    {children}</>
  )
}

export default UserAuth
