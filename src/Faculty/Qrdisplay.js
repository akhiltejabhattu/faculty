import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { useLocation } from "react-router-dom";
import {
  doc,
  setDoc,
  updateDoc,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import "./style.css"; // Make sure to import your CSS file

function Qrdisplay() {
  const location = useLocation();
  const [domain, setDomain] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [isFetching, setIsFetching] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [newRollNo, setNewRollNo] = useState("");
  const [isDownloadPopupVisible, setIsDownloadPopupVisible] = useState(false);
  const [downloadFilename, setDownloadFilename] = useState("");
  const [isFileDownloaded, setIsFileDownloaded] = useState(false); // Track if file is downloaded
  const empno = location.state?.empno;

  useEffect(() => {
    const generateRandomString = () => {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < 16; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return "https://smart-attendance-student.netlify.app?" + empno + result;
      // return "https://smart-attendance-student1.netlify.app?" + empno + result;
    };

    const generateQRCode = async () => {
      const newRandomString = generateRandomString();
      setDomain(newRandomString);
      console.log(newRandomString);

      try {
        await setDoc(doc(db, "qrCodes", empno), {
          qrCodeValue: newRandomString.slice(
            newRandomString.lastIndexOf("?") + 11
          ),
        });
        console.log("QR code stored successfully");
      } catch (error) {
        console.error("Error storing QR code: ", error);
      }
    };

    const startQRCodeGeneration = () => {
      generateQRCode();

      const intervalId = setInterval(generateQRCode, 10000);

      return () => clearInterval(intervalId);
    };

    const cleanup = startQRCodeGeneration();

    return cleanup;
  }, [empno]);

  useEffect(() => {
    const docRef = doc(db, "attendance", empno);

    // Set up a Firestore real-time listener
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setAttendees(docSnap.data().students || []);
      } else {
        console.log("No such document!");
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [empno]);

  const addStudent = async () => {
    if (newRollNo.trim() === "") {
      return;
    }

    try {
      const docRef = doc(db, "attendance", empno);
      if (!attendees.includes(newRollNo)) {
        await setDoc(
          docRef,
          { students: [...attendees, newRollNo] },
          { merge: true }
        );
      }

      setNewRollNo("");
      setIsPopupVisible(false);
    } catch (error) {
      console.error("Error adding student: ", error);
    }
  };

  const handleAddRoll = (event) => {
    event.preventDefault();
    addStudent();
  };

  const handleDownload = () => {
    setIsDownloadPopupVisible(true);
  };

  const downloadExcel = () => {
    if (!downloadFilename.trim()) {
      alert("Please enter a filename.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      attendees.map((rollNo) => ({ RollNumber: rollNo }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendees");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, `${downloadFilename}.xlsx`);

    setDownloadFilename("");
    setIsDownloadPopupVisible(false);
    setIsFileDownloaded(true); // Mark file as downloaded
  };

  const sortedAttendees = [...attendees].sort();

  const filteredAttendees = sortedAttendees.filter((rollNo) =>
    rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (rollNo) => {
    try {
      const docRef = doc(db, "attendance", empno);
      await updateDoc(docRef, {
        students: arrayRemove(rollNo),
      });
    } catch (error) {
      console.error("Error deleting student: ", error);
    }
  };


  // Handle tab closure
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!isFileDownloaded) {
        event.preventDefault();
        event.returnValue = "Please download the file before closing the tab.";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isFileDownloaded]);

  const handleStopQR = () => {
    if (!isFileDownloaded) {
      alert("Please download the file before stopping QR.");
    } else {
      localStorage.setItem("isFileDownloaded", "true");
      alert("You can now close this tab manually.");
    }
  };

  return (
    <div className="text-center mt-3">
      <h1>Scan here to mark your attendance</h1>
      {domain && (
        <>
          <QRCode value={domain} size={550} level="H" className="mt-2 mb-3" />
          <p>{domain}</p>
        </>
      )}
      <div className="btn-con">
        <button
          className="text-center btn btn-success"
          onClick={() => console.log("Attendees fetched automatically.")}
        >
          View attendees
        </button>
        <button
          className="btn btn-primary"
          onClick={() => setIsPopupVisible(true)}
        >
          Add Roll No.
        </button>
        <button className="btn btn-danger" onClick={handleStopQR}>
          Stop QR
        </button>
        <button className="btn btn-secondary" onClick={handleDownload}>
          Download List
        </button>
      </div>

      {isFetching && <p>Loading...</p>}

      {isPopupVisible && (
        <div className="popup">
          <h2>Add Roll Number</h2>
          <form onSubmit={handleAddRoll}>
            <input
              type="text"
              value={newRollNo}
              onChange={(e) => setNewRollNo(e.target.value)}
              placeholder="Enter Roll Number"
              required
            />
            <button type="submit" className="btn btn-primary">
              Add Student
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsPopupVisible(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {isDownloadPopupVisible && (
        <div className="popup">
          <h2>Download List</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              downloadExcel();
            }}
          >
            <input
              type="text"
              value={downloadFilename}
              onChange={(e) => setDownloadFilename(e.target.value)}
              placeholder="Enter Filename"
              required
            />
            <button type="submit" className="btn btn-primary">
              Download
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsDownloadPopupVisible(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {sortedAttendees.length > 0 && (
        <div className="resCon">
          <ol className="prsenteesCon text-center">
            <h1>Presentees Roll Numbers</h1>
            <hr />
            
            <input
              type="text"
              placeholder="Search Roll Number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className=" mb-3"
            />
            {filteredAttendees.map((rollNo, index) => (
              <React.Fragment key={index}>
                <div className="licon">
                  <li>{rollNo}</li>
                  <i
                    className="fa-solid fa-trash"
                    onClick={() => handleDelete(rollNo)}
                  ></i>
                </div>
                <hr />
              </React.Fragment>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default Qrdisplay;