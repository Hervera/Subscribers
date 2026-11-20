const express = require('express');
const router = express.Router();
const {
  getAllSubscribers,
  createSubscriber,
  getSubscriberById,
  updateSubscriber,
  deleteSubscriber,
  getSubscriber
} = require('../controllers/subscribers');

router.get('/', getAllSubscribers);
router.post('/', createSubscriber);
router.get('/:id', getSubscriber, getSubscriberById);
router.patch('/:id', getSubscriber, updateSubscriber);
router.delete('/:id', getSubscriber, deleteSubscriber);

module.exports = router;
