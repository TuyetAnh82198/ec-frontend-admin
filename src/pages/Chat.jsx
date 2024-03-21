import { useState, useEffect, useCallback, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { PersonFill, SendFill } from "react-bootstrap-icons";
import ScrollToBottom from "react-scroll-to-bottom";

import { socket } from "../socket.js";

function App() {
  //state lịch sử chat
  const [messageList, setMessageList] = useState([]);
  //state cập nhật tin nhắn đã input
  const [msg, setMsg] = useState("");
  //state roomId mà ad đang tham gia
  const [roomId, setRoomId] = useState("");
  //state đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //state danh sách tin nhắn các phòng
  const [rooms, setRooms] = useState([]);

  const navigate = useNavigate();
  //hàm kiểm tra người dùng đã đăng nhập chưa
  const fetchIsLoggedIn = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/users/check-login/admin`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.msg === "Have not been logged in yet.") {
          navigate("/login");
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchIsLoggedIn(), []);

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  //hàm thêm tin nhắn vào lịch sử chat
  const chatHandler = (e) => {
    e.preventDefault();
    if (msg.trim().length !== 0) {
      const index = rooms.findIndex((item) => item.roomId === roomId);
      rooms[index].messageList = [
        ...rooms[index].messageList,
        {
          sender: "admin",
          dateTime: `${
            new Date().getMonth() + 1
          }/${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
          content: msg,
        },
      ];
      setRooms(rooms);
      const sendMessages = () => {
        return {
          roomId: rooms[index].roomId,
          messageList: rooms[index].messageList,
        };
      };
      socket.emit("frontend send messages", sendMessages());
      setMsg("");
    }
  };

  useEffect(() => {
    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
    const getRoomId = (id) => {
      socket.emit("joinRoom", id);
    };
    socket.on("roomCreated", getRoomId);
    const receiveMessages = (data) => {
      let index = rooms.findIndex((item) => item.roomId === data.roomId);
      if (index >= 0) {
        rooms[index].messageList = data.messageList;
      } else {
        rooms.push({
          roomId: data.roomId,
          messageList: data.messageList,
        });
      }
      setRooms(rooms);
      localStorage.setItem("rooms", JSON.stringify(rooms));
      setRoomId(data.roomId);
      setMessageList(data.messageList);
    };
    socket.on("server send messages", receiveMessages);
    const getIdToEndChat = (id) => {
      const index = rooms.findIndex((item) => item.roomId === id);
      rooms.splice(index, 1);
      setRooms(rooms);
      localStorage.setItem("rooms", JSON.stringify(rooms));
      setRoomId("");
      setMessageList([]);
    };
    socket.on("server send roomId to end chat", getIdToEndChat);
    return () => {
      socket.off("roomCreated", getRoomId);
      socket.off("server send messages", receiveMessages);
      socket.off("server send roomId to end chat", getIdToEndChat);
    };
  }, []);

  return (
    <Fragment>
      {isLoggedIn && (
        <div className="d-flex">
          <div
            className="col-2"
            style={{ minHeight: "100vh", borderRight: "solid 1px #cccccc" }}
          >
            <div className="border-bottom">
              <input
                className="m-3 col-10"
                type="text"
                placeholder="Search Contact"
              />
            </div>
            {localStorage.getItem("rooms") &&
              JSON.parse(localStorage.getItem("rooms")).map((room) => (
                <div
                  onClick={() => {
                    setRoomId(room.roomId);
                    setMessageList(room.messageList);
                  }}
                  className="m-3"
                  key={room.roomId}
                  style={{ cursor: "pointer" }}
                >
                  <PersonFill style={{ color: "orange" }} /> {room.roomId}
                </div>
              ))}
          </div>
          <div className="col-10 d-flex flex-column justify-content-between">
            <ScrollToBottom>
              <div className="p-3">
                {messageList.map((msg) => (
                  <div
                    key={(Math.random() * 5).toString()}
                    style={{
                      textAlign: msg.sender === "admin" ? "right" : "left",
                      color: msg.sender === "admin" ? "white" : "gray",
                    }}
                  >
                    <div>
                      {msg.sender === "client" && (
                        <PersonFill
                          style={{ color: "orange", fontSize: "1.4rem" }}
                        />
                      )}
                      <p
                        className="d-inline-block p-2 rounded-1"
                        style={{
                          backgroundColor:
                            msg.sender === "admin" ? "#49adf7" : "#f8f9fa",
                        }}
                      >
                        {msg.content}
                      </p>
                    </div>
                    <p style={{ color: "gray" }}>
                      <span>{msg.dateTime}</span> from {msg.sender}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollToBottom>
            <form onSubmit={chatHandler} className="d-flex p-3 border-top">
              <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                className="col-10 p-2 border-1"
                type="text"
                placeholder="Type and enter"
              />
              <button
                type="submit"
                className="my-3 border-0 m-1"
                style={{
                  color: " #49adf7",
                  fontSize: "1.4rem",
                  cursor: "pointer",
                }}
              >
                <SendFill />
              </button>
            </form>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default App;
