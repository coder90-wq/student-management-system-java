
import { useState } from "react";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [course, setCourse] = useState("");
  const [editId, setEditId] = useState(null);

  function addStudent(e) {
    e.preventDefault();

    if (editId !== null) {
      const updatedStudents = students.map((student) =>
          student.id === editId
              ? {...student, name, age, course}
              : student
      );

      setStudents(updatedStudents);
      setEditId(null);
    } else {
      const newStudent = {
        id: Date.now(),
        name,
        age,
        course
      };

      setStudents([...students, newStudent]);
    }

    setName("");
    setAge("");
    setCourse("");

    setStudents([...students, newStudent]);

    setName("");
    setAge("");
    setCourse("");
  }

  function deleteStudent(id) {
    setStudents(students.filter((student) => student.id !== id));
  }
  function editStudent(id) {
    const student = students.find((s) => s.id === id);

    if (student) {
      setEditId(id);
      setName(student.name);
      setAge(student.age);
      setCourse(student.course);
    }
  }

  return (
      <div className="container">

        <h1>Student Management System</h1>
        <p>Welcome to Student Dashboard</p>

        <div className="dashboard">
          <div className="card">
            <h3>Total Students</h3>
            <h2>{students.length}</h2>
          </div>

          <div className="card">
            <h3>Total Courses</h3>
            <h2>{new Set(students.map((s) => s.course)).size}</h2>
          </div>
        </div>

        <div className="form-section">
          <h2>Add New Student</h2>

          <form onSubmit={addStudent}>
            <input
                type="text"
                placeholder="Student Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />

            <input
                type="number"
                placeholder="Student Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
            />

            <input
                type="text"
                placeholder="Course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                required
            />

            <button type="submit">
              {editId !== null ? "Update Student" : "Add Student"}
            </button>          </form>
        </div>

        <div className="table-section">
          <h2>Student List</h2>

          <table>
            <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Course</th>
              <th>Action</th>
            </tr>
            </thead>

            <tbody>
            {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.age}</td>
                  <td>{student.course}</td>
                  <td>
                    <button onClick={() => editStudent(student.id)}>
                      Edit
                    </button>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>

          {students.length === 0 && (
              <p>No students found.</p>
          )}
        </div>

      </div>
  );
}

export default App;
