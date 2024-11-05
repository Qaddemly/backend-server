Stores logic for each route/resource

e.g. `userController.js` `authController.js`

```js
const userService = require('../services/userService');

exports.registerUser = async (req, res) => {
    try {
        const user = await userService.createUser(req.body); // Calls the service layer
        res.status(201).json({message: 'User registered successfully', user});
    } catch (error) {
        res.status(500).json({message: 'Registration failed', error: error.message});
    }
};

exports.loginUser = async (req, res) => {
    try {
        const token = await userService.authenticateUser(req.body.email, req.body.password);
        res.status(200).json({message: 'Login successful', token});
    } catch (error) {
        res.status(401).json({message: 'Login failed', error: error.message});
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await userService.findUserById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({message: 'User not found', error: error.message});
    }
};

```