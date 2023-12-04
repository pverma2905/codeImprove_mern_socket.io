import React, { useState, useEffect } from "react";
import socket from "./io";
export default function ChatBox() {
  const [inputField, setInputField] = useState({
    name: "",
    room: "",
    message: "",
  });

  const [isChatting, setChatting] = useState(false);
  const [messageList,setMessageList] = useState([]);

  useEffect(()=>{
    socket.on('receive_message',(data)=>{
        console.log(data)
        setMessageList([...messageList,data])
    })
    socket.on('typing',(data)=>{
        console.log(data)
        // setMessageList([...messageList,data])
    })
  },[socket])

  const inputHandler = (e) => {
    if (e.target.name === "message") {
      socket.emit('sendTyping', inputField);
    }
    setInputField({
      ...inputField,
      [e.target.name]: e.target.value,
    });
  };

  const enterRoom = () => {
    console.log(inputField);
    setChatting(true)
    socket.emit("join_room", inputField.room);
  };

  const sendMessage = async () => {
    console.log(inputField);
    await socket.emit("send_message", inputField);
    setMessageList([...messageList,inputField])
    setInputField({...inputField,message:""})
  }
//   console.log(messageList)
  return (
    <div>
      <h1>Chat App</h1>
      {!isChatting ? (
        <div>
          <input
            type="text"
            placeholder="Enter name"
            name="name"
            onChange={inputHandler}
          />
          <input
            type="text"
            placeholder="Enter Room"
            name="room"
            onChange={inputHandler}
          />
          <br />
          <button onClick={enterRoom}>Enter Chat Room</button>
          
        </div>
      ) : (
        <div>
          <h2>Chat Box</h2>
          {
            messageList.map((item,index)=>{
                return (
                    <div key={index}>
                        {item.name}:{item.message}
                    </div>
                )
            })
          }
          <input type="text" placeholder='Enter message' name='message' onChange={inputHandler} value={inputField.message} />
          <br />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}
