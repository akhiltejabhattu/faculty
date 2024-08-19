import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../firebase"; // Ensure you import your Firebase instance
import { doc, setDoc } from "firebase/firestore";

const Dashboard = () => {
  const navigate = useNavigate();
  const location=useLocation();

  const handleShareQR = async () => {
    // Get the logged-in faculty's empno from localStorage
    const empno = location.state?.empno;
    console.log(empno);

    if (!empno) {
      console.error("No faculty ID found");
      return;
    }

    const facultyDocRef = doc(db, "attendance", empno);

    try {
      // Create a document for the faculty with an empty students array
      await setDoc(facultyDocRef, { students: [] }, { merge: true });
      console.log("QR shared, document created with empno:", empno);
      navigate("/qrdisplay", { state: { empno: empno } });
    } catch (error) {
      console.error("Error creating document: ", error);
    }
  };

  return (
    <div className="text-center mt-5">
      <h1>This is Faculty Dashboard</h1>
      <button className="btn btn-success mt-2" onClick={handleShareQR}>
        Share QR
      </button>
    </div>
  );
};

export default Dashboard;
