import io from "socket.io-client";
import ChatWindows from "./ChatWindows";
import { address, password } from "./address";
import React, { useRef, useState } from "react";
import md5 from "md5";
export const ctx = React.createContext();

function App() {
  const [login, setLogin] = useState(false);
  const passwordRef = useRef();
  function handleLogin() {
    const nowPass = md5(passwordRef.current.value);
    if (password === nowPass) {
      setLogin(true);
    } else {
      alert("密码错误，禁止非法入侵");
    }
  }

  let content = login ? (
    <ctx.Provider value={io("ws://" + address)}>
      <ChatWindows />
    </ctx.Provider>
  ) : (
    <div
      style={{
        height: "40px",
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%,-50%)",
        display: "flex",
      }}
    >
      <input
        style={{ flex: 1, padding: "4px" }}
        type="password"
        placeholder="请输入情报局密码..."
        ref={passwordRef}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            handleLogin();
            passwordRef.current.value = null;
          }
        }}
      />
      <button
        style={{ marginLeft: "4px", width: "80px", cursor: "pointer" }}
        onClick={() => {
          handleLogin();
        }}
      >
        进入聊天室
      </button>
    </div>
  );
  return <div className="App">{content}</div>;
}

export default App;
