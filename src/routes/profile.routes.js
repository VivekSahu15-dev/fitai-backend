const router = require('express').Router();
const c = require('../controllers/profile.controller');
const auth = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const { validate, fitnessSchema } = require('../middleware/validate');

router.get('/fitness', auth, asyncHandler(c.getFitness));
router.put('/fitness', auth, validate(fitnessSchema), asyncHandler(c.saveFitness));

module.exports = router;