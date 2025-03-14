import { Request, Response, NextFunction } from 'express';

export const validateDonation = (req: Request, res: Response, next: NextFunction) => {
  const { amount, cause, paymentMethod } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid donation amount'
    });
  }

  const validCauses = ['education', 'healthcare', 'environment', 'elderly', 'disaster'];
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

  next();
};