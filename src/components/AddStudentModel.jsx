import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

const AddStudentModal = ({ isOpen, onClose, onNewStudent }) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(formData).some((field) => !field)) {
      alert("All fields are required!");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "students"), formData);
      const newStudent = { id: docRef.id, ...formData };
      onNewStudent(newStudent); // Immediately update the student table
      onClose();
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
      console.error("Error adding student: ", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-brightness-50 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-3xl h-auto max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Add New Student</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.keys(formData).map((key) => {
             let inputType = 'text';

             if (key === 'age') {
               inputType = 'number';
             } else if (key === 'email') {
               inputType = 'email';
             } else if (key === 'phone' || key === 'parentPhone') {
               inputType = 'tel';
             } else if (key === 'admissionDate' || key === 'dob') {
               inputType = 'date';
             } else{
               inputType = 'text'
             }

            return(
            <div key={key} className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {key.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type={inputType} 
                value={formData[key]}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
          )})}
          <div className="col-span-2 flex justify-between gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;
