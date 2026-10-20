// src/routes/auth.routes.js
const router = require('express').Router();
const c = require('../controllers/auth.controller');
const auth = require('../middleware/auth');
const { validate, signupSchema, loginSchema } = require('../middleware/validate');

router.post('/signup', validate(signupSchema), c.signup);
router.post('/login', validate(loginSchema), c.login);
router.post('/refresh', c.refresh);
router.post('/forgot-password', c.forgotPassword);
router.post('/logout', auth, c.logout);
router.get('/me', auth, c.me);

module.exports = router;