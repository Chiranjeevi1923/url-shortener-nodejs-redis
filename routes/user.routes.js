import express from 'express';
import { getAdminUsers, insertAdminUsers, userLogin, userSignup } from '../controllers/user.controller.js';
import { generateFakeAdmin } from '../services/fake-data.service.js';

const router = express.Router();
router.use(express.json());

router.get('/', (req, res) => {
    res.send('Welcome to the User Authentication API!');
});

router.post('/signup', userSignup);

router.post('/login', userLogin);

// Code for Pagination - with Ag-grid
router.post('/insert', insertAdminUsers);
router.post('/admins', getAdminUsers);

export default router;