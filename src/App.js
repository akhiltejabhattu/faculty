import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css";
import Login from "./Faculty/Login";
import Dashboard from "./Faculty/Dashboard";
import Qrdisplay from "./Faculty/Qrdisplay";

function App() {
  return (
    <div>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/facultydashboard" element={<Dashboard />} />
          <Route path="/qrdisplay" element={<Qrdisplay />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
