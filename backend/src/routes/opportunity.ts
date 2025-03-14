import express from 'express';
import { auth } from '../middleware/auth';
import { 
  createOpportunity,
  getAllOpportunities,
  registerForOpportunity,
  getOpportunityById
} from '../controllers/opportunityController';

const router = express.Router();

router.post('/', auth, createOpportunity);
router.get('/', getAllOpportunities);
router.post('/register/:id', auth, registerForOpportunity);
router.get('/:id', getOpportunityById);

export default router;