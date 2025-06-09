import socket from 'socket.io-client';


let socketInstance= null;


//here basically we have initialized the socket inclding the project_id which would only all the members of the project to send and recieve the message by creating a room ..
export const initializeSocket=( projectId)=>{
    socketInstance = socket(import.meta.env.VITE_API_URL,{
        auth:{
            token: localStorage.getItem("token")
        },
        query: {
              projectId
        }
    })


    return  socketInstance;
}
 // remember while using the sockets make sure that the event name must be same else the message would not be sent

export const receiveMessage = (eventName, cb) => {      // used to recieve the message 
    socketInstance.on(eventName, cb);
}



export const sendMessage = (eventName, data) => {     //used to send the message ...which includes the message and the senders details 
    if (!socketInstance) {
        console.error("Socket not initialized!");
        return;
    }
   
    socketInstance.emit(eventName, data);
}