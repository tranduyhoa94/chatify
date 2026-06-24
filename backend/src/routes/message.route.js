import express from 'express';
import { getAllContracts, getChatPartners, getMessagesByUserId, sendMessage } from '../controllers/message.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/contracts', protectRoute, getAllContracts);
router.get('/chats', protectRoute, getChatPartners);
router.get('/:id', protectRoute, getMessagesByUserId);
router.post('/send/:id', protectRoute, sendMessage);

export default router;