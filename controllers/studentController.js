const Student = require('../models/Student');

const parseCourses = s => (s || '').split(',').map(c => c.trim()).filter(Boolean);
const body = b => ({ studentId: b.studentId, fullName: b.fullName, email: b.email,
                     major: b.major, year: b.year, courses: parseCourses(b.courses) });

// READ (public and admin list + search)
async function renderList(req, res, isAdmin) {
  const q = (req.query.q || '').trim();
  const matches = [
    { fullName: new RegExp(q, 'i') },
    { major: new RegExp(q, 'i') },
    { courses: new RegExp(q, 'i') }
  ];
  if (isAdmin) matches.push({ studentId: new RegExp(q, 'i') });
  const filter = q ? { $or: matches } : {};
  const students = await Student.find(filter).sort({ createdAt: -1 });
  res.render('index', { students, q, isAdmin });
}
exports.list = (req, res) => renderList(req, res, false);
exports.adminList = (req, res) => renderList(req, res, true);

// CREATE
exports.newForm = (req, res) => res.render('form', { student: {}, action: '/students', method: 'POST', error: null, isAdmin: false });
exports.create = async (req, res) => {
  try { await Student.create(body(req.body)); res.redirect('/'); }
  catch (e) { res.status(400).render('form', { student: { ...body(req.body), courses: req.body.courses }, action: '/students', method: 'POST', error: e.code === 11000 ? 'That Student ID is already registered.' : e.message, isAdmin: false }); }
};

// UPDATE
exports.editForm = async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.redirect('/admin');
  res.render('form', { student: { ...student.toObject(), courses: student.courses.join(', ') }, action: `/admin/students/${student._id}?_method=PUT`, method: 'POST', error: null, isAdmin: true });
};
exports.update = async (req, res) => {
  try { await Student.findByIdAndUpdate(req.params.id, body(req.body), { runValidators: true }); res.redirect('/admin'); }
  catch (e) { res.status(400).render('form', { student: { ...body(req.body), courses: req.body.courses }, action: `/admin/students/${req.params.id}?_method=PUT`, method: 'POST', error: e.code === 11000 ? 'That Student ID is already registered.' : e.message, isAdmin: true }); }
};

// DELETE
exports.remove = async (req, res) => { await Student.findByIdAndDelete(req.params.id); res.redirect('/admin'); };
