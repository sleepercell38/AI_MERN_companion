import React from 'react'
import { createContext , useContext } from 'react'
import { useState } from 'react'


//basically here we ccreated the user context which will be used to store the user data
// and provide it to the components that need it

 export const UserContext = createContext();

export const Userprovider=({children})=>{

  const [User,setUser]= useState(null);

  return ( <UserContext.Provider value={{User,setUser}}>
    {children}
  </UserContext.Provider>)


}
 


