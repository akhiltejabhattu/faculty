import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "./style.css";

const Login = () => {
  const navigate = useNavigate();
  const [empno, setempno] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    // Validate that both fields are not empty
    if (!empno || !password) {
      setErrorMessage("Both fields are required");
      return;
    }

    const facultyCollection = collection(db, "faculty");
    const q = query(facultyCollection, where("empno", "==", empno));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      setErrorMessage("Invalid Employee Number");
      return;
    }

    const doc = querySnapshot.docs[0].data();
    if (doc.password === password) {
      // Successful login
      setErrorMessage("");
      console.log("Faculty login successful!");

      // Navigate to the dashboard
      navigate("/facultydashboard", { state: { empno: empno } });
    } else {
      setErrorMessage("Invalid login credentials");
    }
  };

  // Event handler for detecting "Enter" key press
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLogin(event);
    }
  };

  return (
    <div className="white-section">
      <div className="login">
        <h1 className="head">VNR VJIET</h1>
        <div className="section">
          <i className="fa-solid fa-user"></i>
          <input
            type="text"
            name="user_name"
            placeholder="Employee ID"
            className="mail"
            value={empno}
            required
            onChange={(e) => setempno(e.target.value)}
            onKeyPress={handleKeyPress} // Trigger handleLogin on "Enter" key press
          />
        </div>
        <br />
        <div className="section">
          <i className="fa-solid fa-lock"></i>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress} // Trigger handleLogin on "Enter" key press
          />
        </div>
        <p className="login-link">
          <button id="loginBtn" className="login-button" onClick={handleLogin}>
            Login
          </button>
        </p>
        {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
      </div>
      <div className="content"></div>
    </div>
  );
};

export default Login;
