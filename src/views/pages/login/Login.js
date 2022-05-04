import React, { useState, useEffect } from "react";
import api from "../../../services/api"
import "./style.css"
const Login = (props) => {
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    let res = await api.login({ phone, password })
    if (res.e !== 0) return alert(res.m)
    
    sessionStorage.setItem('session', JSON.stringify(res.token))
    props.history.push('/')
  }

  return (
    <div className="lg-container">
      <div class="login">
        <h2>Login</h2>
        <div class="group">
          <input type="text" placeholder="Phone" value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <i class="fa fa-user"></i>
        </div>
        <div class="group">
          <input type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i class="fa fa-lock"></i>
        </div>
        <button
          onClick={() => handleLogin()}
        >
          {" "}
          <i class="fa fa-send"></i>Login
      </button>
      </div>
    </div>
  );
};

export default Login;
