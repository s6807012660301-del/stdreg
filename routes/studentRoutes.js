const router = require('express').Router();
const c = require('../controllers/studentController');

router.get('/', c.list);
router.get('/students/new', c.newForm);
router.post('/students', c.create);
router.get('/students/:id/edit', c.editForm);
router.put('/students/:id', c.update);
router.delete('/students/:id', c.remove);

module.exports = router;
