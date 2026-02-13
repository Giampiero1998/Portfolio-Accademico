const express = require('express');
const citationController = require('../controllers/citationController');
const validate=require('../middleware/validate');
const { 
    createCitationSchema,
    updateCitationSchema 
} = require('../validation/citationSchema');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
.post(protect, validate(createCitationSchema), citationController.createCitation)
.get(citationController.getAllCitations);

router.route('/:id')
    .get(citationController.getCitationById)
    .patch(protect, validate(updateCitationSchema), citationController.updateCitationById)
    .delete(protect, citationController.deleteCitation);

module.exports = router;