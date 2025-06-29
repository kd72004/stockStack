    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');
    const User = require('../models/user');

    exports.signup = async (req, res) => {
    try {
        const { name, email_id, password, balance } = req.body;

        const existingUser = await User.findOne({ email_id });
        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email_id, password: hashedPassword, balance });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Signup failed' });
    }
    };

    exports.login = async (req, res) => {
    try {
        const { email_id, password } = req.body;

        const user = await User.findOne({ email_id });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
    };
