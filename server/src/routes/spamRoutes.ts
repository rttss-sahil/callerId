import express from 'express';
const router = express.Router();

import verifyToken from '../middleware/verifyToken';
import spamController from '../controllers/spamController';

router.get('/:phone', verifyToken, spamController.getUserSpams);

router.post('/:phone', verifyToken, spamController.spamContact);
router.delete('/:phone', verifyToken, spamController.unspamContact);


export default router;