import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const validateDonation = (req: AuthRequest, res: Response, next: NextFunction) => {
  const { amount, cause, paymentMethod, recipientId } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid donation amount'
    });
  }

  const validCauses = ['education', 'healthcare', 'environment', 'elderly', 'disaster','other','health camp','cleanliness drive'];
  if (!validCauses.includes(cause)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid cause selected'
    });
  }

  const validPaymentMethods = ['card', 'upi', 'netbanking'];
  if (!validPaymentMethods.includes(paymentMethod)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid payment method'
    });
  }

  if (!recipientId) {
    return res.status(400).json({
      success: false,
      message: 'Recipient NGO ID is required'
    });
  }

  next();
};