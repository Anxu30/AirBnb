const express = require('express');
const userRouter = express.Router();
const { 
  userHome, 
  homeList, 
  bookings, 
  favorites, 
  homeDetails, 
  favSet,
  booking,
  delfav,
  delbook
} = require('../controller/storeController');


userRouter.get('/', userHome);
userRouter.get('/homes', homeList);
userRouter.get('/bookings', bookings);
userRouter.get('/favorites', favorites);
userRouter.get('/homes/:homeId', homeDetails);
userRouter.get('/favorites/:favId', favSet);
userRouter.get('/bookings/:bookId', booking);
userRouter.get('/unfav/:favId',delfav);
userRouter.get('/unbook/:bookId',delbook);
module.exports = userRouter;