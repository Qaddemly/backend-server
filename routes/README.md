contains API endpoints

e.g. `userRoutes.js` `authRoutes.js`

```js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route definitions
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/:id', userController.getUserById);

module.exports = router;

```