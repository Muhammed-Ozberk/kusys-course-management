var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const authorizeAdmin = require('../middlewares/authorizeAdmin');

/* GET users listing. */
router.get('/', userController.userList);

/* GET user detail. */
router.get('/:id', userController.userDetail);

/* POST user create. */
router.post('/create', authorizeAdmin, userController.userCreate);

/* POST user update. */
router.post('/update/:id', authorizeAdmin, userController.userUpdate);

/* GET user delete. */
router.delete('/:id', authorizeAdmin, userController.userDelete);

module.exports = router;
