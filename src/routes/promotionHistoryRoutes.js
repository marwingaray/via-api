const express =  require('express');
const {validatePromotionHistory} = require('../middlewares/validatePromotionHistory');
const promotionHistorySchema = require('../schemas/promotionHistorySchema');
const {createHistoryHandler, getHistoryByDriverHandler } = require('../controller/promotionsHistoryController');

const auth = require('../middlewares/auth.js');
const router = express.Router();


//router.post('/post', ((req,res) =>{res.status(200).json({ success: true, message: "message" });}));
router.post('/',auth,validatePromotionHistory(promotionHistorySchema), createHistoryHandler);

router.get('/:driver',auth, getHistoryByDriverHandler);


module.exports = router;