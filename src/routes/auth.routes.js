// src/routes/auth.routes.js
const rateLimit = require('express-rate-limit');
const router = require('express').Router();
const c = require('../controllers/auth.controller');
const auth = require('../middleware/auth');
const { validate, signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require('../middleware/validate');


const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many attempts. Please try again later.' },
});

router.post('/signup', validate(signupSchema), c.signup);
router.post('/login', validate(loginSchema), c.login);
router.post('/refresh', c.refresh);
router.post('/forgot-password', c.forgotPassword);
router.post('/logout', auth, c.logout);
router.get('/me', auth, c.me);
router.post('/forgot-password', validate(forgotPasswordSchema), c.forgotPassword);
router.post('/reset-password', resetLimiter, validate(resetPasswordSchema), c.resetPassword);

module.exports = router;