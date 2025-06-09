import React, { useEffect } from 'react'
import { UserContext } from '../Context/Usercontext'
import { useContext } from 'react'
import { useState } from 'react'
import axios from "../config/Axios.js"
import {useNavigate} from 'react-router-dom'


const Home = () => {

  const { User } = useContext(UserContext)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState(null);

  //here we are creating a new state variable to store the projects user have created
  const [projects, setProjects] = useState([]);

  const navigate= useNavigate();

  function createProject(e) {
    e.preventDefault();
    console.log({ projectName });

    //sending the project name to the backend to create a new project
    axios.post("/projects/create", {
      name: projectName
    }).then((res) => {
      console.log(res);
      setIsModalOpen(false);

    }).catch((err) => {
      console.log(err)
    })

  }


  useEffect(() => {

    //here we would fetch the projects of the user
    axios.get("/projects/getall").then((res) => {
      setProjects(res.data.projects);  
      //we have set the projects to the state variable we created
     
    }).catch((err) => {
      console.log(err);
    }
    )

  }, [])





  return (
    <div  className='bg-gray-900 min-h-screen'>
      <main className="p-4 bg-gray-800">
        <div className="projects  flex flex-wrap gap-4">

          <button onClick={() => {
            setIsModalOpen(true);
          }}


            className="project p-4 border border-gray-100 rounded-lg flex items-center justify-between gap-2 bg-white hover:bg-gray-200 transition duration-200">
            <i className="ri-link"></i>
            <h4>New Project</h4>


          </button>

             { projects.map((elem)=>{
            return (
              <div key={elem._id} 
              onClick={()=>{
                navigate("/project", {
                  state:{projects : elem }   //here we use state property to pass the data to desired route we want to navigate
                  //basically when we are applying elem basically we target the project element which is been clicked rather than sending the data of one project only
                })
              }}
              
              
              
              className="project p-4 border border-gray-100 rounded-lg flex flex-col  gap-2 bg-white hover:bg-gray-200 transition duration-200">
              
                <h2 className='font-bold'>{elem.name}</h2>

                  <div className='flex gap-2'>
                  <p><small> <i className="ri-user-fill"></i> collaborators  :  {elem.Users.length}</small></p>
                  </div>
              </div> 
            )
             })}













        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md w-1/3">
              <h2 className="text-xl mb-4">Create New Project</h2>
              <form onSubmit={createProject}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Project Name</label>
                  <input
                    onChange={(e) => {
                      setProjectName(e.target.value);
                    }}
                    value={projectName}
                    type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
                </div>
                <div className="flex justify-end">
                  <button type="button" className="mr-2 px-4 py-2 bg-gray-300 rounded-md" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Create</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>



    </div>
  )
}

export default Home


///bascially here we have imported the user context so that we can access the data whoever has logged in 
//the data would be shown here