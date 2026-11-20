const express = require('express');
const router = express.Router();
const { requireFields } = require('../middlewares/validate');
const { getSubscriber } = require('../middlewares/getSubscriber');
const {
  getAllSubscribers,
  createSubscriber,
  getSubscriberById,
  updateSubscriber,
  deleteSubscriber
} = require('../controllers/subscribers');

router.get('/', getAllSubscribers);
router.post('/', requireFields(['name', 'subscribedToChannel']), createSubscriber);
router.get('/:id', getSubscriber, getSubscriberById);
router.patch('/:id', getSubscriber, updateSubscriber);
router.delete('/:id', getSubscriber, deleteSubscriber);

module.exports = router;
