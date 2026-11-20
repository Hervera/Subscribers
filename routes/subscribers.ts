import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { getSubscriber } from '../middlewares/getSubscriber';
import { createSubscriberSchema, updateSubscriberSchema } from '../validators/subscribers';
import {
  getAllSubscribers,
  createSubscriber,
  getSubscriberById,
  updateSubscriber,
  deleteSubscriber
} from '../controllers/subscribers';

const router = Router();

router.get('/', getAllSubscribers);
router.post('/', validate(createSubscriberSchema), createSubscriber);
router.get('/:id', getSubscriber, getSubscriberById);
router.patch('/:id', validate(updateSubscriberSchema), getSubscriber, updateSubscriber);
router.delete('/:id', getSubscriber, deleteSubscriber);

export default router;
