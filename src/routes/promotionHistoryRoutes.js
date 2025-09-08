const express =  require('express');
const {validatePromotionHistory} = require('../middlewares/validatePromotionHistory');
const promotionHistorySchema = require('../schemas/promotionHistorySchema');
const {createHistoryHandler, getHistoryByDriverHandler, getHistoryByIdHandler } = require('../controller/promotionsHistoryController');

const auth = require('../middlewares/auth.js');
const router = express.Router();


//router.post('/post', ((req,res) =>{res.status(200).json({ success: true, message: "message" });}));
router.post('/',auth,validatePromotionHistory(promotionHistorySchema), createHistoryHandler);

router.get('/driver/:driver',auth, getHistoryByDriverHandler);


//TODO agregar solicitid de promoision inidividuales
router.get('/:driver/:idHistoryPayment',auth, getHistoryByIdHandler);


module.exports = router;