/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState, useContext, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { ctx } from "./App";
import { address } from "./address";
import "./ChatWindows.css";

export default function ChatWindows() {
  const [msgList, setMsgList] = useState([]);
  const [nowMsg, setNowMsg] = useState("");
  const [sendMsg, setsendMsg] = useState("");
  const socket = useContext(ctx);

  const listDomRef = useRef();
  useEffect(() => {
    // 连接服务器, 得到与服务器的连接对象
    // 绑定监听, 接收服务器发送的消息
    socket.on("receiveMsg", function (data) {
      //客户端接收服务器发送的消息
      setsendMsg(data);
    });
  }, []);

  useEffect(() => {
    if (sendMsg.message) {
      setMsgList([...msgList, sendMsg]);
    }
  }, [sendMsg]);

  useEffect(() => {
    listDomRef.current.scrollTo(0, listDomRef.current.scrollHeight);
    if (msgList.length > 150) {
      msgList.splice(0, 100);
    }
  }, [msgList]);

  return (
    <div className="container">
      <div className="title">情报局😈</div>
      <div ref={listDomRef} className="list-container">
        {msgList.map((it) => (
          <div
            key={uuidv4()}
            className="msg-item"
            style={{
              float: it.id === socket.id ? "right" : "left",
            }}
          >
            <img
              src={"http://" + address + it.info.avatar}
              className="msg-avatar"
              style={{
                float: it.id === socket.id ? "right" : "left",
              }}
            />
            <div
              style={{
                float: it.id === socket.id ? "right" : "left",
              }}
            >
              <p
                className="msg-name"
                style={{
                  textAlign: it.id === socket.id ? "end" : "start",
                }}
              >
                {it.info.name}
              </p>
              <div
                className="msg-text"
                style={{
                  backgroundColor: it.id === socket.id ? "lightblue" : "white",
                }}
              >
                {it.message}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="input-bar">
        <input
          type="text"
          value={nowMsg}
          onChange={(e) => {
            setNowMsg(e.target.value);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              // 发送消息
              socket.emit("sendMsg", { message: nowMsg, id: socket.id });
              setNowMsg("");
            }
          }}
        />
        <button
          onClick={() => {
            // 发送消息
            socket.emit("sendMsg", { message: nowMsg, id: socket.id });
            setNowMsg("");
          }}
        >
          发送
        </button>
      </div>
    </div>
  );
}
