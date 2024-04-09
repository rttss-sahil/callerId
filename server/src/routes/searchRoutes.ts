import express from 'express';
const router = express.Router();

import verifyToken from '../middleware/verifyToken';

import searchController from '../controllers/searchController';

router.get('/name/:query', verifyToken, searchController.searchByName);
router.get('/phone/:phone', verifyToken, searchController.searchByPhoneNumber);
router.get('/id-source/:id/:source', verifyToken, searchController.searchByIdAndSource);

export default router;
