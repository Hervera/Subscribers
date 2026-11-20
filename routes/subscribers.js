const express = require('express');
const router = express.Router();
const { validate } = require('../middlewares/validate');
const { getSubscriber } = require('../middlewares/getSubscriber');
const { createSubscriberSchema, updateSubscriberSchema } = require('../validators/subscribers');
const {
  getAllSubscribers,
  createSubscriber,
  getSubscriberById,
  updateSubscriber,
  deleteSubscriber
} = require('../controllers/subscribers');

router.get('/', getAllSubscribers);
router.post('/', validate(createSubscriberSchema), createSubscriber);
router.get('/:id', getSubscriber, getSubscriberById);
router.patch('/:id', validate(updateSubscriberSchema), getSubscriber, updateSubscriber);
router.delete('/:id', getSubscriber, deleteSubscriber);

module.exports = router;
