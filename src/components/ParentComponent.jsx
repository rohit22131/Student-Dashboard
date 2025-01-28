// import React, { useState, useEffect } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import StudentTable from "./StudentTable";
// import { db } from "../firebase";

// const ParentComponent = () => {
//     const [students, setStudents] = useState([]);

//     // Fetch students from Firestore
//     const fetchStudents = async () => {
//         const querySnapshot = await getDocs(collection(db, "students"));
//         const studentsList = querySnapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data(),
//         }));
//         setStudents(studentsList);
//     };

//     useEffect(() => {
//         fetchStudents();
//     }, []);

//     return (
//         <StudentTable
//             students={students}
//             fetchStudents={fetchStudents}
//             onView={(student) => console.log("Viewing student:", student)}
//             onEdit={(student) => console.log("Editing student:", student)}
//         />
//     );
// };

// export default ParentComponent;
