const router = require('express').Router();
const c = require('../controllers/studentController');
const adminAuth = require('../middleware/adminAuth');

router.get('/', c.list);
router.get('/students/new', c.newForm);
router.post('/students', c.create);

router.get('/admin/login', adminAuth.loginPage);
router.post('/admin/login', adminAuth.login);
router.use('/admin', adminAuth.protect);
router.get('/admin', c.adminList);
router.get('/admin/students/:id/edit', c.editForm);
router.put('/admin/students/:id', c.update);
router.delete('/admin/students/:id', c.remove);
router.post('/admin/logout', adminAuth.logout);

module.exports = router;
