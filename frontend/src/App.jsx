import React from 'react'
import AppRoutes from './Routes/AppRoutes'
import { Userprovider } from './Context/Usercontext'




const App = () => {
  return ( 
//here we would wrap the AppRoutes with the Userprovider so that we can access the user data in all the components
<Userprovider>
       <AppRoutes />
</Userprovider>

)
}

export default App

