import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "/api/students";
const emptyForm = { name: "", age: "", course: "" };

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendConnected, setBackendConnected] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadStudents() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Could not load students.");
      setStudents(await response.json());
      setBackendConnected(true);
    } catch {
      setBackendConnected(false);
      setError("Cannot connect to the server. Start the Spring Boot backend and try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadStudents(); }, []);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function saveStudent(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch(editId === null ? API_URL : `${API_URL}/${editId}`, {
        method: editId === null ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, age: Number(form.age) }),
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Could not save the student. Check the entered details.");
      }
      setForm(emptyForm);
      setEditId(null);
      await loadStudents();
    } catch (saveError) {
      setError(saveError.message || "Could not save the student.");
    } finally {
      setSaving(false);
    }
  }

  function editStudent(student) {
    setEditId(student.id);
    setForm({ name: student.name, age: String(student.age), course: student.course });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteStudent(id) {
    if (!window.confirm("Delete this student?")) return;
    setError("");
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Could not delete this student.");
      if (editId === id) cancelEdit();
      await loadStudents();
    } catch (deleteError) {
      setError(deleteError.message || "Could not delete this student.");
    }
  }

  function cancelEdit() {
    setEditId(null);
    setForm(emptyForm);
  }

  const courseCount = new Set(students.map((student) => student.course)).size;

  return (
    <main className="container">
      <header className="page-header">
        <div><p className="eyebrow">STUDENT ADMINISTRATION</p><h1>Student Management</h1>
          <p className="subtitle">Keep student records organized in one place.</p></div>
        <span className={`status ${backendConnected ? "is-connected" : "is-disconnected"}`}><span />
          {backendConnected ? "Backend connected" : "Backend unavailable"}</span>
      </header>

      {error && <div className="notice" role="alert">{error}</div>}

      <section className="dashboard" aria-label="Student summary">
        <article className="card"><p>Total students</p><strong>{students.length}</strong></article>
        <article className="card"><p>Courses represented</p><strong>{courseCount}</strong></article>
      </section>

      <section className="panel form-section">
        <div className="section-heading"><div><p className="eyebrow">RECORD DETAILS</p>
          <h2>{editId === null ? "Add a student" : "Edit student"}</h2></div></div>
        <form onSubmit={saveStudent}>
          <label>Student name<input name="name" value={form.name} onChange={updateField} placeholder="e.g. Asha Patel" required maxLength="100" /></label>
          <label>Age<input name="age" type="number" min="1" max="150" value={form.age} onChange={updateField} placeholder="e.g. 20" required /></label>
          <label>Course<input name="course" value={form.course} onChange={updateField} placeholder="e.g. Computer Science" required maxLength="100" /></label>
          <div className="form-actions"><button className="primary" type="submit" disabled={saving}>{saving ? "Saving…" : editId === null ? "Add student" : "Save changes"}</button>
            {editId !== null && <button className="secondary" type="button" onClick={cancelEdit}>Cancel</button>}</div>
        </form>
      </section>

      <section className="panel table-section">
        <div className="section-heading"><div><p className="eyebrow">DIRECTORY</p><h2>Students</h2></div>
          <span className="record-count">{students.length} {students.length === 1 ? "record" : "records"}</span></div>
        {loading ? <p className="empty-state">Loading student records…</p> : students.length === 0 ?
          <p className="empty-state">No students yet. Add a student using the form above.</p> :
          <div className="table-wrap"><table><thead><tr><th>ID</th><th>Name</th><th>Age</th><th>Course</th><th>Actions</th></tr></thead>
            <tbody>{students.map((student) => <tr key={student.id}><td className="id-cell">#{student.id}</td><td>{student.name}</td><td>{student.age}</td><td>{student.course}</td>
              <td className="row-actions"><button className="text-button" onClick={() => editStudent(student)}>Edit</button><button className="text-button delete" onClick={() => deleteStudent(student.id)}>Delete</button></td></tr>)}</tbody>
          </table></div>}
      </section>
      <footer>Student records are saved by the backend.</footer>
    </main>
  );
}

export default App;
