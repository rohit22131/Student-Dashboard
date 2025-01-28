import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { db } from "../firebase";
import AddStudentModal from "./AddStudentModel";

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    section: "",
    rollNumber: "",
    dob: "",
    email: "",
    phone: "",
    address: "",
    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
    admissionDate: "",
  });
  const [viewStudent, setViewStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);

  // Fetch students from Firestore
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "students"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStudents(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudents();
  }, []);

  // Handle adding a new student to the table
  const handleNewStudent = (newStudent) => {
    setStudents((prevStudents) => [...prevStudents, newStudent]);
  };

  // Edit student details
  const handleEditStudent = async () => {
    if (Object.values(formData).some((field) => !field)) {
      alert("All fields are required!");
      return;
    }

    try {
      const studentRef = doc(db, "students", editingStudent.id);
      await updateDoc(studentRef, formData);

      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === editingStudent.id ? { ...student, ...formData } : student
        )
      );

      setIsEditModalOpen(false);
      setFormData({
        name: "",
        class: "",
        section: "",
        rollNumber: "",
        dob: "",
        email: "",
        phone: "",
        address: "",
        guardianName: "",
        guardianPhone: "",
        guardianEmail: "",
        admissionDate: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Delete student
  const handleDeleteStudent = async (id) => {
    try {
      await deleteDoc(doc(db, "students", id));
      setStudents((prevStudents) => prevStudents.filter((student) => student.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // View student details
  const handleViewStudent = (student) => {
    setViewStudent(student);
    setIsViewModalOpen(true);
  };

  // Open edit modal
  const handleEditClick = (student) => {
    setEditingStudent(student);
    setFormData(student);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">Students List</h1>

        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-left">Section</th>
              <th className="p-3 text-left">Roll Number</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{student.name}</td>
                <td className="p-3">{student.class}</td>
                <td className="p-3">{student.section}</td>
                <td className="p-3">{student.rollNumber}</td>
                <td className="p-3 flex justify-center gap-4">
                  <FaEye
                    className="text-green-500 cursor-pointer hover:scale-110"
                    onClick={() => handleViewStudent(student)}
                  />
                  <FaEdit
                    className="text-blue-500 cursor-pointer hover:scale-110"
                    onClick={() => handleEditClick(student)}
                  />
                  <FaTrash
                    className="text-red-500 cursor-pointer hover:scale-110"
                    onClick={() => handleDeleteStudent(student.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {students.length === 0 && (
          <div className="text-center text-gray-500 mt-4">No students found.</div>
        )}
      </div>

      <button
          onClick={() => setIsAddModalOpen(true)}
          className="m-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Add Student
        </button>

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onNewStudent={handleNewStudent}
      />

      {/* View Student Modal */}
      {isViewModalOpen && viewStudent && (
        <div className="fixed inset-0 flex backdrop-brightness-50 justify-center items-center p-4">
          <div className="bg-white w-full max-w-xl sm:max-w-2xl mx-auto p-6 rounded-md shadow-lg relative overflow-auto max-h-[90vh]">
            <h3 className="text-xl font-bold mb-6 text-center">Student Details</h3>

            <button
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <span className="text-2xl">&times;</span>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-auto">
              {Object.keys(viewStudent).map((key) => (
                <div key={key} className="flex flex-col">
                  <label className="text-sm font-medium capitalize mb-1">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                    {viewStudent[key]}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md mr-4 hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-brightness-50 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-3xl h-auto max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Student</h2>
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(formData).map((key) => {
                let inputType = 'text';

                if (key === 'age') {
                  inputType = 'number';
                } else if (key === 'email') {
                  inputType = 'email';
                } else if (key === 'phone' || key === 'parentPhone') {
                  inputType = 'tel';
                } else if (key === 'admissionDate') {
                  inputType = 'date';
                }

                return (
                  <div key={key} className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <input
                      type={inputType}
                      value={formData[key]}
                      onChange={(e) =>
                        setFormData({ ...formData, [key]: e.target.value })
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                );
              })}
            </form>
            <div className="flex justify-between">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md mr-4 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleEditStudent}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentTable;

