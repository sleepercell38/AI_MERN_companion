import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from "../config/Axios.js"
import { initializeSocket, receiveMessage } from '../config/Socket.js';
import { sendMessage } from '../config/Socket.js';
import { useContext } from 'react';
import { UserContext } from '../Context/Usercontext.jsx';
import Markdown from 'markdown-to-jsx'
import { getwebcontainer } from '../config/Webcontainer.js';



const Project = () => {

    const { User } = useContext(UserContext)
    const [message, setmessage] = useState(" ")
    const location = useLocation();
    const [issidepanelopen, setissidepanelopen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const [selectedUserId, setSelectedUserId] = useState([]); // State to store selected user ID
    const messagebox = React.createRef()
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([])
    const [project, setProject] = useState(location.state.projects);// Assuming you have a project object in the state passed from the previous page
    const [currentfile, setcurrentfile] = useState(null)
    const [filetree, setfiletree] = useState({})
    const [openFiles, setOpenFiles] = useState([])
    const [webContainer, setwebContainer] = useState(null)
    const [iframeUrl, setIframeUrl] = useState(null)
    const [runProcess,setrunProcess]= useState(null)





    //function to handle the user selection in the model 
    // here would use set in order to store the selected user id in the state
    // and then we would use that state to check if the user is selected or not
    // when the user clicks on the user in the modal, we will add the user id to the selectedUserId state
    // and when the user clicks on the user again, we will remove the user id from the selectedUserId state


    const handleUserClick = (id) => { //basically here we are using set because they are mutable and can be upadted without updating the state vaiable
        // const newselecteduserid = new Set(selectedUserId);
        // if (newselecteduserid.has(id)) {
        //     newselecteduserid.delete(id);
        // } else {
        //     newselecteduserid.add(id);
        // }

        //  setSelectedUserId(newselecteduserid);


        setSelectedUserId(prevSelectedUserId => {
            const newSelectedUserId = new Set(prevSelectedUserId);
            if (newSelectedUserId.has(id)) {
                newSelectedUserId.delete(id);
            } else {
                newSelectedUserId.add(id);
            }
            console.log(Array.from(newSelectedUserId))
            return newSelectedUserId;
        });

    };


    const addcollaborator = () => {

        //here we will send the selected user id to the backend to add the collaborator to the project
        axios.put("/projects/add-user", {
            projectId: location.state.projects._id,     //used location.state to get the project id from the state passed from the previous page (loginpage ) where we used the navigate function to pass the state
            Users: Array.from(selectedUserId)
        }).then(res => {
            console.log(res.data);
            setIsModalOpen(false)


        }).catch(err => {
            console.log(err);
        })

    }



    //the workflow of send and recieving message ----

    //basically with the help of the use Ref we have targeted the message box and gave it the reference of statevariable we have created earlier [message,setmessage] and on clicking of the send button the {send} function would be called ...

    //in the send function basically we would call the sendMessage function which would accept a eventname and the payload data which we would send ... (here the data would be the message which we are sending and the details of teh message sent like sender:?)          ..here we have also upaded the function addmessage would basically pass the message object which is sent my the user just now......

    //
    // function addMessage(messageObject) {
    //     setMessages(prev => [...prev, messageObject]);
    // }  

    //further the messageobject passed in the send function comes to the addfunction as a parameter  and with the help of statevariable  [messages,setMessages] we are just updating the current message ....with the help of this variable we would laterly update the Ui according to this..



    function send() {


        sendMessage("project-message", {
            message,
            sender: User

        })
        addMessage({ message, sender: User, outgoing: true });


        setmessage("")

    }

    function Writeaimessage(message) {


        const messageObject = JSON.parse(message);

        return (<div className="text-sm font-medium whitespace-pre-wrap break-words max-w-80 overflow-x-auto">
            <Markdown>{messageObject.text}</Markdown>
        </div>)

    }



    //this is a normal function 
    function isJSON(str) {
        try {
            JSON.parse(str);
            return true;
        } catch {
            return false;
        }
    }






    useEffect(() => {
        //building socket connection
        initializeSocket(project._id)

        if (!webContainer) {
            getwebcontainer().then(container => {
                setwebContainer(container)
                console.log("container started")
            })
        }

        receiveMessage("project-message", data => {

            if (isJSON(data.message)) {
                const message = JSON.parse(data.message)
                if (message.fileTree) {
                    setfiletree(message.fileTree)
                }
                addMessage({ ...data, outgoing: false });
                console.log(message)
            } else {
                addMessage({ ...data, outgoing: false });
                console.log(data.message)
            }

            webContainer?.mount(message.fileTree)





            //the work of the revcive message is to show the incoming message sent by the user to the UI
            //basicslly here we have to pass the (data ) which we have  recieved from the user to the addmessage() because from there laterly it would be used to update the Setmessages array .....

            //in simple terms in recieve message we just have to pass the data to some function which would add the message to the Ui ...here we are passing to addmessages function and then from there we are passing it to the SetMessage variable which would update the latest message and with that we could easily show it our UI

            // addMessage({ ...data, outgoing: false });  // here we are updating the Outgoing to false inorder to help for UI
            console.log(JSON.parse(data.message))
            // console.log(data)
            // console.log(messages);
        })




        axios.get("/users/getallusers").then((res) => {

            console.log(res.data)
            setUsers(res.data.users)

        }).catch(err => {
            console.log(err);
        })

        axios.get(`/projects/get-project-info/${location.state.projects._id}`).then(res => {
            console.log(res.data)
            setProject(res.data.project);

        })




    }, [project._id])


    function addMessage(messageObject) {
        setMessages(prev => [...prev, messageObject]);

    }



    function scrollToBottom() {
        messagebox.current.scrollTop = messagebox.current.scrollHeight
    }

    useEffect(() => { //// here we have used the useeffect so that the scrolltrigger should start working as the messages arrive  and its get loaded when we are in the project page
        scrollToBottom();
    }, [messages]);







    return (
        <main className="flex h-screen w-screen">
            <section className="left relative h-full min-w-100 bg-gray-800 flex flex-col">
                <header className="flex justify-between p-2 px-4 w-full bg-gray-400">
                    <button
                        className="flex items-center justify-center gap-1"
                        onClick={() => setIsModalOpen(true)} // Open the modal
                    >
                        <i className="ri-user-add-fill text-2xl"></i>
                        <p className="text-sm">Add Collaborator</p>
                    </button>

                    <button
                        onClick={() => {
                            setissidepanelopen(!issidepanelopen);
                        }}
                        className="p-2"
                    >
                        <i className="ri-group-fill text-xl"></i>
                    </button>
                </header>

                <div className="conversation-area flex-grow flex flex-col overflow-hidden">
                    <div
                        ref={messagebox}
                        className="message-box flex-grow flex flex-col overflow-y-auto overflow-x-hidden"
                        style={{ minHeight: 0, maxHeight: "100%" }}>

                        {/* {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={
                                    (msg.outgoing
                                        ? "outgoing-msg ml-auto bg-gray-300"
                                        : "incoming-msg bg-gray-400") +
                                    " max-w-56 flex flex-col p-2 m-2 rounded-md w-fit"
                                }
                            >
                                <small className="opacity-75 text-xs font-thin">
                                    {msg.sender?.email}
                                </small>
                                <p className="text-sm font-medium">
                                    
                                    <Markdown>{msg.message}</Markdown></p>
                            </div>
                        ))} */}

                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={
                                    (msg.outgoing
                                        ? "ml-auto bg-gray-300"
                                        : msg.sender?.role === "ai"
                                            ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white border-l-4 border-blue-800"
                                            : "bg-gray-400") +
                                    " max-w-md flex flex-col p-2 m-2 rounded-md w-fit break-words"
                                }
                            >
                                <small className="opacity-75 text-xs font-thin">
                                    {msg.sender?.role === "ai" ? "AI" : msg.sender?.email}
                                </small>
                                {/* <div className="text-sm font-medium whitespace-pre-wrap break-words max-w-80 overflow-x-auto">
                                    <Markdown>{msg.message}</Markdown>
                                </div> */}
                                {msg.sender._id === "ai" ? Writeaimessage(msg.message) : msg.message}
                            </div>
                        ))}







                    </div>
                    <div className="input-field w-full flex">
                        <input
                            value={message}
                            onChange={(e) => {
                                setmessage(e.target.value)
                            }}
                            className="p-2 px-4 border-none outline-none bg-gray-400 w-[80%] rounded-md"
                            type="text"
                            placeholder="Start Typing...."
                        />
                        <button onClick={send} className="flex-grow py-4  ">
                            <i className="ri-send-plane-fill text-white text-2xl"></i>
                        </button>
                    </div>
                </div>


                {/* {sidepanel for collaborators} */}

                <div
                    className={`sidepanel w-full h-full bg-gray-200 flex flex-col gap-2 h-60 absolute transition-all ${issidepanelopen ? 'translate-x-0' : '-translate-x-full'
                        } top-0`}
                >
                    <header className="flex justify-between items-center px-4 p-2 bg-gray-400">
                        <h1 className="font-semibold text-lg">Collaborators</h1>

                        <button
                            onClick={() => setissidepanelopen(!issidepanelopen)}
                            className="p-2"
                        >
                            <i className="ri-close-fill text-xl"></i>
                        </button>
                    </header>

                    <div className="users flex flex-col gap-2">

                        {project.Users && project.Users.map((user) => {
                            return (
                                <div
                                    key={user._id}

                                    className="user cursor-pointer hover:bg-slate-300 p-2 flex gap-2 items-center"
                                    onClick={() => setIsModalOpen(false)} // Open the modal when a user is clicked
                                >
                                    <div className="aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600">
                                        <i className="ri-user-fill absolute"></i>
                                    </div>
                                    <h1 className="font-semibold text-lg">{user.email}</h1>
                                </div>
                            )
                        })}

                    </div>
                </div>
            </section>

            <section className="right bg-gray-900 flex-grow flex h-full">
                <div className="explorer h-full w-65 bg-gray-600 p-2">
                    <div className="filetree w-full gap-2 flex flex-col">
                        {Object.keys(filetree).map((file, index) => (
                            <button
                                key={file}
                                onClick={() => {

                                    setcurrentfile(file);
                                    setOpenFiles([...new Set([...openFiles, file])])
                                }}
                                className="treeelement pointer p-2 px-4 flex items-center gap-2 bg-slate-300 w-full rounded"
                            >
                                <p className='font-semibold text-s'>{file}</p>
                            </button>
                        ))}

                    </div>



                </div>



                <div className="code-editor  h-full flex-col flex-grow ">
                    <div className="top flex justify-between w-full">

                        <div className="files flex">
                            {
                                openFiles.map((file, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setcurrentfile(file)}
                                        className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 bg-slate-300 ${currentfile === file ? 'bg-slate-400' : ''}`}>
                                        <p
                                            className='font-semibold text-xs'
                                        >{file}</p>
                                    </button>
                                ))
                            }
                        </div>

                        <button onClick={async () => {

                            await webContainer?.mount(filetree)


                            const installProcess = await webContainer.spawn("npm", ["install"])
                            installProcess.output.pipeTo(new WritableStream({
                                write(chunk) {
                                    console.log(chunk)
                                }
                            }))

                            if(runProcess){
                                runProcess.kill()
                            }


                            let tempRunProcess = await webContainer.spawn("npm", ["start"]);
                            tempRunProcess.output.pipeTo(new WritableStream({
                                write(chunk) {
                                    console.log(chunk)
                                }
                            }))


                            setrunProcess(tempRunProcess)

                            webContainer.on('server-ready', (port, url) => {
                                console.log(port, url)
                                setIframeUrl(url)
                            })



                        }
                        }




                            className='bg-slate-400 text-sm rounded px-4'> Run </button>




                    </div>
                    <div className="bottom  h-[95.5%] flex flex-grow">
                        {filetree[currentfile] && (
                            <textarea
                                value={filetree[currentfile].file.contents}
                                onChange={(e) => {
                                    setfiletree({
                                        ...filetree,
                                        [currentfile]: {
                                            ...filetree[currentfile], // keep other properties!
                                            file: {
                                                ...filetree[currentfile].file,
                                                contents: e.target.value
                                            }
                                        }
                                    });
                                }}
                                className='w-full h-full text-white p-10 bg-slate-700'
                            ></textarea>
                        )}










                    </div>



                </div>



                {iframeUrl && webContainer && (
                    <div className="relative w-1/2 h-full flex flex-col">

                        <div className="addressbar">
                            <input 
                            onChange={(e)=>{
                                setIframeUrl(e.target.value)
                            }}
                            
                            type="text"  value={iframeUrl} className='w-full p-2 px-4 bg-slate-300'/>
                        </div>






                        <button
                            onClick={() => setIframeUrl(null)}
                            className="absolute bottom-2 right-2 z-10 bg-slate-500 text-white px-2 py-1 rounded"
                        >
                            Close
                        </button>
                        <iframe src={iframeUrl} className='w-full h-full bg-gray-200'></iframe>
                    </div>
                )}



            </section>



            {/* Modal for selecting users */}

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">

                    <div className="bg-white p-6 rounded-md shadow-md w-1/3">
                        <h2 className="text-xl mb-4">Select a User</h2>


                        <div className="flex flex-col gap-4 max-h-96 overflow-y-auto">
                            {users.map((user) => (
                                <div
                                    key={user._id}

                                    //basically here we have to check wheather the user is selected or not and if it is selected then we have to change the background color of the div

                                    //but the catch is if the user has been mistakenly selected then we have to deselect that 
                                    className={`p-2 border border-gray-300 rounded-md hover:bg-green-100 cursor-pointer ${Array.from(selectedUserId).includes(user._id) ? 'bg-green-400' : ''}`}



                                    onClick={() => handleUserClick(user._id)} // Select the user
                                >
                                    {/* <h3 className="font-medium">{user.name}</h3> */}
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between mt-4">
                            <button
                                onClick={addcollaborator} // Call the function to add collaborator
                                className='px-4 py-2 bg-gray-300 rounded-md'> Add Collaborator</button>




                            <button
                                className="px-4 py-2 bg-gray-300 rounded-md"
                                onClick={() => setIsModalOpen(false)} // Close the modal
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Project;
