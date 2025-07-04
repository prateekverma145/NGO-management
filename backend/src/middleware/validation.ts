import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const validateDonation = (req: AuthRequest, res: Response, next: NextFunction):void => {
  const { amount, cause, paymentMethod, recipientId } = req.body;

  if (!amount || amount <= 0) {
     res.status(400).json({
      success: false,
      message: 'Invalid donation amount'
    });return;
  }

  const validCauses = ['education', 'healthcare', 'environment', 'elderly', 'disaster','other','health camp','cleanliness drive'];
  if (!validCauses.includes(cause)) {
    res.status(400).json({
      success: false,
      message: 'Invalid cause selected'
    });return ;
  }

  const validPaymentMethods = ['card', 'upi', 'netbanking'];
  if (!validPaymentMethods.includes(paymentMethod)) {
    res.status(400).json({
      success: false,
      message: 'Invalid payment method'
    });return ;
  }

  if (!recipientId) {
     res.status(400).json({
      success: false,
      message: 'Recipient NGO ID is required'
    });return;
  }

  next();
};
