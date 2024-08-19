// populateData.js

const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyC8oZPrsCi3N43Dol9Gw06ABBk6l0uHEgA",
  authDomain: "smart-attendance-3b7cb.firebaseapp.com",
  projectId: "smart-attendance-3b7cb",
  storageBucket: "smart-attendance-3b7cb.appspot.com",
  messagingSenderId: "929770978031",
  appId: "1:929770978031:web:0bcdd11ea4d3c9fd88791a",
  measurementId: "G-5H2X64MDWS",
};

// Initialize Firebase only once
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to populate data
const populateData = async () => {
  try {
    // Define an array of faculty data
    const facultyData = [
      { empno: "22071A6601", password: "22071A6601@emp" },
      { empno: "22071A6602", password: "22071A6602@emp" },
      { empno: "22071A6603", password: "22071A6603@emp" },
      { empno: "22071A6604", password: "22071A6604@emp" },
      { empno: "22071A6605", password: "22071A6605@emp" },
    ];

    // Add each faculty record to Firestore
    for (const [index, faculty] of facultyData.entries()) {
      const facultyRef = doc(db, "faculty", faculty.empno);
      await setDoc(facultyRef, {
        empno: faculty.empno,
        password: faculty.password,
      });
      console.log(`Data for faculty ${faculty.empno} added successfully!`);
    }
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

populateData();
