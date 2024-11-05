contains business logic

e.g. `userSerives.js`

```js
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new User({...userData, password: hashedPassword});
    return await user.save();
};

exports.authenticateUser = async (email, password) => {
    const user = await User.findOne({email});
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials');
    }
    return jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
};

exports.findUserById = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

```