const express =  require('express');
const {validatePromotionHistory} = require('../middlewares/validatePromotionHistory');
const promotionHistorySchema = require('../schemas/promotionHistorySchema');
const {createHistoryHandler, getHistoryByDriverHandler, getHistoryByIdHandler } = require('../controller/promotionsHistoryController');

const auth = require('../middlewares/auth.js');
const router = express.Router();


router.post('/',auth,validatePromotionHistory(promotionHistorySchema), createHistoryHandler);

router.get('/driver/:driver',auth, getHistoryByDriverHandler);

router.get('/:driver/:idHistoryPayment',auth, getHistoryByIdHandler);


module.exports = router;