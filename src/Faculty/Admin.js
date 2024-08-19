import React, { useState } from "react";
import { Button, Container, Row, Col, Modal, Form } from "react-bootstrap";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // Adjust the import path based on your project structure

const Admin = () => {
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddFacultyModal, setShowAddFacultyModal] = useState(false);
  const [showDeleteStudentModal, setShowDeleteStudentModal] = useState(false);
  const [showDeleteFacultyModal, setShowDeleteFacultyModal] = useState(false);
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [facultyPassword, setFacultyPassword] = useState("");
  const [deleteRollNo, setDeleteRollNo] = useState("");
  const [deleteFacultyId, setDeleteFacultyId] = useState("");
  const [message, setMessage] = useState("");

  // Handlers for showing/hiding modals
  const handleShowAddStudentModal = () => setShowAddStudentModal(true);
  const handleCloseAddStudentModal = () => setShowAddStudentModal(false);
  const handleShowAddFacultyModal = () => setShowAddFacultyModal(true);
  const handleCloseAddFacultyModal = () => setShowAddFacultyModal(false);
  const handleShowDeleteStudentModal = () => setShowDeleteStudentModal(true);
  const handleCloseDeleteStudentModal = () => setShowDeleteStudentModal(false);
  const handleShowDeleteFacultyModal = () => setShowDeleteFacultyModal(true);
  const handleCloseDeleteFacultyModal = () => setShowDeleteFacultyModal(false);

  // Function to handle adding student
  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const studentRef = doc(db, "student", rollNo);
      await setDoc(studentRef, { rollno: rollNo, password: password });
      setMessage("Student added successfully!");
      alert("Student added successfully!");
      setRollNo("");
      setPassword("");
      handleCloseAddStudentModal();
    } catch (error) {
      console.error("Error adding student: ", error);
      setMessage("Error adding student. Please try again.");
    }
  };

  // Function to handle adding faculty
  const handleAddFaculty = async (e) => {
    e.preventDefault();
    try {
      const facultyRef = doc(db, "faculty", facultyId);
      await setDoc(facultyRef, { id: facultyId, password: facultyPassword });
      setMessage("Faculty added successfully!");
      alert("Faculty added successfully!");
      setFacultyId("");
      setFacultyPassword("");
      handleCloseAddFacultyModal();
    } catch (error) {
      console.error("Error adding faculty: ", error);
      setMessage("Error adding faculty. Please try again.");
    }
  };

  // Function to handle deleting student
  const handleDeleteStudent = async (e) => {
    e.preventDefault();
    try {
      const studentRef = doc(db, "student", deleteRollNo);
      const studentDoc = await getDoc(studentRef);

      if (studentDoc.exists()) {
        await deleteDoc(studentRef);
        setMessage(
          `Student with roll number ${deleteRollNo} deleted successfully!`
        );
        alert(`Student with roll number ${deleteRollNo} deleted successfully!`);
        setDeleteRollNo("");
        handleCloseDeleteStudentModal();
      } else {
        setMessage(
          "Student not found. Please check the roll number and try again."
        );
        alert("Student not found. Please check the roll number and try again.");
      }
    } catch (error) {
      console.error("Error deleting student: ", error);
      setMessage("Error deleting student. Please try again.");
    }
  };

  // Function to handle deleting faculty
  const handleDeleteFaculty = async (e) => {
    e.preventDefault();
    try {
      const facultyRef = doc(db, "faculty", deleteFacultyId);
      const facultyDoc = await getDoc(facultyRef);

      if (facultyDoc.exists()) {
        await deleteDoc(facultyRef);
        setMessage(`Faculty with ID ${deleteFacultyId} deleted successfully!`);
        alert(`Faculty with ID ${deleteFacultyId} deleted successfully!`);
        setDeleteFacultyId("");
        handleCloseDeleteFacultyModal();
      } else {
        setMessage("Faculty not found. Please check the ID and try again.");
        alert("Faculty not found. Please check the ID and try again.");
      }
    } catch (error) {
      console.error("Error deleting faculty: ", error);
      setMessage("Error deleting faculty. Please try again.");
    }
  };


  return (
    <Container className="text-center mt-5">
      <h1>Admin Dashboard</h1>
      <Row className="justify-content-center mt-4">
        <Col xs={12} md={3}>
          <Button
            variant="primary"
            className="w-100 mb-2"
            onClick={handleShowAddStudentModal}
          >
            Add Student
          </Button>
        </Col>

        <Col xs={12} md={3}>
          <Button
            variant="success"
            className="w-100 mb-2"
            onClick={handleShowAddFacultyModal}
          >
            Add Faculty
          </Button>
        </Col>

        <Col xs={12} md={3}>
          <Button
            variant="warning"
            className="w-100 mb-2"
            onClick={handleShowDeleteStudentModal}
          >
            Del Student
          </Button>
        </Col>

        <Col xs={12} md={3}>
          <Button
            variant="danger"
            className="w-100 mb-2"
            onClick={handleShowDeleteFacultyModal}
          >
            Del Faculty
          </Button>
        </Col>
      </Row>

      {/* Add Student Modal */}
      <Modal show={showAddStudentModal} onHide={handleCloseAddStudentModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddStudent}>
            <Form.Group controlId="formRollNo">
              <Form.Label>Roll Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Roll Number"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mt-2">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Add Student
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Add Faculty Modal */}
      <Modal show={showAddFacultyModal} onHide={handleCloseAddFacultyModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Faculty</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddFaculty}>
            <Form.Group controlId="formFacultyId">
              <Form.Label>Faculty ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Faculty ID"
                value={facultyId}
                onChange={(e) => setFacultyId(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formFacultyPassword" className="mt-2">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                value={facultyPassword}
                onChange={(e) => setFacultyPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Add Faculty
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Student Modal */}
      <Modal
        show={showDeleteStudentModal}
        onHide={handleCloseDeleteStudentModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleDeleteStudent}>
            <Form.Group controlId="formDeleteRollNo">
              <Form.Label>Roll Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Roll Number"
                value={deleteRollNo}
                onChange={(e) => setDeleteRollNo(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="danger" type="submit" className="mt-3">
              Delete Student
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Faculty Modal */}
      <Modal
        show={showDeleteFacultyModal}
        onHide={handleCloseDeleteFacultyModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Faculty</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleDeleteFaculty}>
            <Form.Group controlId="formDeleteFacultyId">
              <Form.Label>Faculty ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Faculty ID"
                value={deleteFacultyId}
                onChange={(e) => setDeleteFacultyId(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="danger" type="submit" className="mt-3">
              Delete Faculty
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};
export default Admin;
