import { useEffect, useMemo, useState } from 'react';
import {
  GraduationCap, LayoutDashboard, Users, UserPlus, Search, Download,
  Pencil, Trash2, X, Menu, BookOpen, Mail, Phone, CalendarDays,
  ChevronDown, School, CheckCircle2, Clock3, UserRound
} from 'lucide-react';

const starterStudents = [
  { id: 1, firstName: 'Aline', lastName: 'Uwimana', email: 'aline@example.com', phone: '+250 788 123 456', gender: 'Female', className: 'Level 4', course: 'Software Development', status: 'Active', joined: '2026-01-15' },
  { id: 2, firstName: 'Eric', lastName: 'Ndayisenga', email: 'eric@example.com', phone: '+250 788 234 567', gender: 'Male', className: 'Level 3', course: 'Networking', status: 'Active', joined: '2026-02-03' },
  { id: 3, firstName: 'Diane', lastName: 'Mukamana', email: 'diane@example.com', phone: '+250 788 345 678', gender: 'Female', className: 'Level 4', course: 'Software Development', status: 'Inactive', joined: '2025-09-10' },
  { id: 4, firstName: 'Patrick', lastName: 'Habimana', email: 'patrick@example.com', phone: '+250 788 456 789', gender: 'Male', className: 'Level 2', course: 'Multimedia', status: 'Active', joined: '2026-01-22' }
];

const emptyForm = {
  firstName: '', lastName: '', email: '', phone: '', gender: 'Female',
  className: 'Level 4', course: 'Software Development', status: 'Active', joined: ''
};

function App() {
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('sms-students');
      return saved ? JSON.parse(saved) : starterStudents;
    } catch { return starterStudents; }
  });
  const [activePage, setActivePage] = useState('Students');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => localStorage.setItem('sms-students', JSON.stringify(students)), [students]);

  const filteredStudents = useMemo(() => students.filter((s) => {
    const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
    const matchesQuery = [fullName, s.email, s.course, s.className].some(v => v.toLowerCase().includes(query.toLowerCase()));
    return matchesQuery && (statusFilter === 'All statuses' || s.status === statusFilter);
  }), [students, query, statusFilter]);

  const activeCount = students.filter(s => s.status === 'Active').length;
  const inactiveCount = students.length - activeCount;

  function openAdd() {
    setEditingId(null);
    setForm({ ...emptyForm, joined: new Date().toISOString().slice(0, 10) });
    setShowForm(true);
  }

  function openEdit(student) {
    setEditingId(student.id);
    setForm({ ...student });
    setShowForm(true);
  }

  function saveStudent(event) {
    event.preventDefault();
    const clean = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]));
    if (editingId) {
      setStudents(current => current.map(s => s.id === editingId ? { ...clean, id: editingId } : s));
      showNotice('Student record updated successfully.');
    } else {
      setStudents(current => [{ ...clean, id: Date.now() }, ...current]);
      showNotice('Student added successfully.');
    }
    setShowForm(false);
  }

  function deleteStudent(id) {
    const student = students.find(s => s.id === id);
    if (!window.confirm(`Delete ${student?.firstName} ${student?.lastName}'s record?`)) return;
    setStudents(current => current.filter(s => s.id !== id));
    showNotice('Student record deleted.');
  }

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2800);
  }

  function exportCSV() {
    const headers = ['First name', 'Last name', 'Email', 'Phone', 'Gender', 'Class', 'Course', 'Status', 'Date joined'];
    const rows = filteredStudents.map(s => [s.firstName, s.lastName, s.email, s.phone, s.gender, s.className, s.course, s.status, s.joined]);
    const csv = [headers, ...rows].map(row => row.map(value => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'students.csv';
    link.click();
    URL.revokeObjectURL(url);
    showNotice('Student list exported as CSV.');
  }

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Students', icon: Users }
  ];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><GraduationCap size={25} /></div>
          <div><strong>EduManage</strong><span>ADMIN PORTAL</span></div>
          <button className="mobile-close icon-button" onClick={() => setMobileMenu(false)} aria-label="Close menu"><X /></button>
        </div>
        <div className="school-label">WORKSPACE</div>
        <nav>
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-link ${activePage === label ? 'selected' : ''}`} onClick={() => { setActivePage(label); setMobileMenu(false); }}>
              <Icon size={19} /><span>{label}</span>
              {label === 'Students' && <span className="nav-count">{students.length}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><div className="help-icon"><BookOpen size={18} /></div><strong>Student records</strong><p>Keep your student information organized and up to date.</p></div>
          <div className="admin-profile"><div className="avatar admin-avatar">AD</div><div><strong>Administrator</strong><span>System admin</span></div><ChevronDown size={16} /></div>
        </div>
      </aside>

      {mobileMenu && <button className="scrim" onClick={() => setMobileMenu(false)} aria-label="Close navigation" />}

      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu icon-button" onClick={() => setMobileMenu(true)} aria-label="Open menu"><Menu /></button>
          <div className="breadcrumb">Workspace <span>/</span> <strong>{activePage}</strong></div>
          <div className="topbar-right"><span className="today"><CalendarDays size={16} /> {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span><div className="avatar">AD</div></div>
        </header>

        <div className="page-wrap">
          {activePage === 'Dashboard' ? (
            <>
              <section className="page-heading"><div><div className="eyebrow">OVERVIEW</div><h1>Dashboard</h1><p>Welcome back. Here is your student overview.</p></div><button className="primary-button" onClick={openAdd}><UserPlus size={17} /> Add student</button></section>
              <Stats students={students} activeCount={activeCount} inactiveCount={inactiveCount} />
              <section className="panel dashboard-panel"><div className="panel-heading"><div><h2>Recently added students</h2><p>Your latest student records</p></div><button className="text-button" onClick={() => setActivePage('Students')}>View all students →</button></div><StudentTable students={students.slice(0, 5)} onEdit={openEdit} onDelete={deleteStudent} /></section>
            </>
          ) : (
            <>
              <section className="page-heading"><div><div className="eyebrow">PEOPLE MANAGEMENT</div><h1>Students</h1><p>Manage student profiles, enrollment details and status.</p></div><button className="primary-button" onClick={openAdd}><UserPlus size={17} /> Add student</button></section>
              <Stats students={students} activeCount={activeCount} inactiveCount={inactiveCount} />
              <section className="panel">
                <div className="panel-heading table-heading"><div><h2>All students <span className="heading-count">{students.length}</span></h2><p>A complete list of registered students</p></div><button className="secondary-button" onClick={exportCSV}><Download size={16} /> Export CSV</button></div>
                <div className="toolbar"><div className="search-box"><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name, email, course..." /></div><select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option>All statuses</option><option>Active</option><option>Inactive</option></select></div>
                <StudentTable students={filteredStudents} onEdit={openEdit} onDelete={deleteStudent} />
                <div className="table-footer"><span>Showing <strong>{filteredStudents.length}</strong> of <strong>{students.length}</strong> students</span><span>Data saved on this device</span></div>
              </section>
            </>
          )}
          <footer>© {new Date().getFullYear()} EduManage <span>Student Management System</span></footer>
        </div>
      </main>

      {notice && <div className="toast"><CheckCircle2 size={18} />{notice}</div>}
      {showForm && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
        <section className="modal" role="dialog" aria-modal="true" aria-labelledby="form-title">
          <div className="modal-header"><div><div className="eyebrow">{editingId ? 'UPDATE RECORD' : 'NEW RECORD'}</div><h2 id="form-title">{editingId ? 'Edit student' : 'Add a student'}</h2><p>Enter the student's information below.</p></div><button className="icon-button" onClick={() => setShowForm(false)} aria-label="Close"><X /></button></div>
          <form onSubmit={saveStudent}>
            <div className="form-grid">
              <Field label="First name" required><input required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} placeholder="e.g. Aline" /></Field>
              <Field label="Last name" required><input required value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} placeholder="e.g. Uwimana" /></Field>
              <Field label="Email address" required><input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="student@example.com" /></Field>
              <Field label="Phone number"><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+250 ..." /></Field>
              <Field label="Gender"><select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}><option>Female</option><option>Male</option><option>Other</option><option>Prefer not to say</option></select></Field>
              <Field label="Class / Level"><select value={form.className} onChange={e => setForm({ ...form, className: e.target.value })}>{['Level 1','Level 2','Level 3','Level 4','Level 5','Level 6'].map(v => <option key={v}>{v}</option>)}</select></Field>
              <Field label="Course"><select value={form.course} onChange={e => setForm({ ...form, course: e.target.value })}>{['Software Development','Networking','Multimedia','Electronics','Computer Systems'].map(v => <option key={v}>{v}</option>)}</select></Field>
              <Field label="Enrollment date"><input type="date" value={form.joined} onChange={e => setForm({ ...form, joined: e.target.value })} /></Field>
              <Field label="Student status"><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option>Active</option><option>Inactive</option></select></Field>
            </div>
            <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowForm(false)}>Cancel</button><button className="primary-button" type="submit">{editingId ? 'Save changes' : 'Add student'}</button></div>
          </form>
        </section>
      </div>}
    </div>
  );
}

function Field({ label, required, children }) {
  return <label className="field"><span>{label}{required && <b> *</b>}</span>{children}</label>;
}

function Stats({ students, activeCount, inactiveCount }) {
  const cards = [
    { label: 'Total students', value: students.length, icon: Users, tone: 'blue', note: 'All registered records' },
    { label: 'Active students', value: activeCount, icon: CheckCircle2, tone: 'green', note: 'Currently enrolled' },
    { label: 'Inactive students', value: inactiveCount, icon: Clock3, tone: 'orange', note: 'Not currently active' },
    { label: 'Courses', value: new Set(students.map(s => s.course)).size, icon: BookOpen, tone: 'purple', note: 'Courses represented' }
  ];
  return <section className="stats-grid">{cards.map(({ label, value, icon: Icon, tone, note }) => <article className="stat-card" key={label}><div className={`stat-icon ${tone}`}><Icon size={20} /></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-note">{note}</div></article>)}</section>;
}

function StudentTable({ students, onEdit, onDelete }) {
  if (!students.length) return <div className="empty-state"><div className="empty-icon"><UserRound size={25} /></div><h3>No students found</h3><p>Try changing your search or add a new student record.</p></div>;
  return <div className="table-scroll"><table><thead><tr><th>STUDENT</th><th>CLASS / COURSE</th><th>CONTACT</th><th>DATE JOINED</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>{students.map(s => <tr key={s.id}>
    <td><div className="student-cell"><div className="avatar student-avatar">{s.firstName[0]}{s.lastName[0]}</div><div><strong>{s.firstName} {s.lastName}</strong><span>{s.gender}</span></div></div></td>
    <td><div className="course-cell"><strong>{s.className}</strong><span>{s.course}</span></div></td>
    <td><div className="contact-cell"><span><Mail size={13} />{s.email}</span>{s.phone && <span><Phone size={13} />{s.phone}</span>}</div></td>
    <td className="date-cell">{s.joined || '—'}</td>
    <td><span className={`status ${s.status.toLowerCase()}`}><i />{s.status}</span></td>
    <td><div className="actions"><button className="action-button edit" onClick={() => onEdit(s)} title="Edit student" aria-label={`Edit ${s.firstName}`}><Pencil size={16} /></button><button className="action-button delete" onClick={() => onDelete(s.id)} title="Delete student" aria-label={`Delete ${s.firstName}`}><Trash2 size={16} /></button></div></td>
  </tr>)}</tbody></table></div>;
}

export default App;