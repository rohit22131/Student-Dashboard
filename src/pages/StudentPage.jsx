import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import StudentTable from "../components/StudentTable";
import AddStudentModal from "../components/AddStudentModel";
import Sidebar from "../components/Sidebaar";

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  const navigate = useNavigate();

  // Fetch students data from Firestore
  const fetchStudents = async () => {
    const querySnapshot = await getDocs(collection(db, "students"));
    const studentsList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setStudents(studentsList);
  };

  // Handle user logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/"); // Navigate to the login page
  };

  // Fetch students when the page loads
  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="flex">
      {/* Sidebar Component */}
      <Sidebar onLogout={handleLogout} />
      <div className="flex-1 p-4">
              {/* Student Table */}
        <StudentTable students={students} />
        
  

        {/* Add Student Modal */}
        {isModalOpen && (
          <AddStudentModal
            onClose={() => setIsModalOpen(false)} // Close modal when clicked
            onSubmit={() => fetchStudents()} // Re-fetch students after adding
          />
        )}
      </div>
    </div>
  );
};

export default StudentsPage;
