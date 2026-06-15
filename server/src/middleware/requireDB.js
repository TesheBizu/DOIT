import mongoose from 'mongoose';

const requireDB = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database unavailable. Please ensure MongoDB is running and MONGODB_URI is correct.',
    });
  }
  next();
};

export default requireDB;
