const router = require('express').Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));

router.use('/auth', require('./auth.routes'));
router.use('/profile', require('./profile.routes'));
// Future routes go here:
// router.use('/workouts', require('./workout.routes'));
// router.use('/profile', require('./profile.routes'));

module.exports = router;