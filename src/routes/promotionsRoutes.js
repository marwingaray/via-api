const express = require('express');
const { getPromotions, getPromotionByUser, getPromotionsAvailable, setPromotionHandler, deletePromo, patchStatus } = require('../controller/promotionsController.js');
const promotionSchema = require('../schemas/promotionsSchema.js')
const { validatePromotion, } = require('../middlewares/validatePromotion.js')
const auth = require('../middlewares/auth.js');
//const verifyAppCheck = require('../middlewares/appcheckMiddleware.js');
const router = express.Router();


// Path GET return all promotions available
router.get('/', getPromotions);

// Path GET by id
router.get('/:typeService/:typeUser', auth, ((req, res) => {
   getPromotionsAvailable(req, res)
}));

router.get('/:idUser/:trips/:typeService/:typeUser', auth, ((req, res) => {
   getPromotionByUser(req, res)
}));

router.post('/', auth, validatePromotion(promotionSchema), setPromotionHandler);

router.delete('/:id', auth, deletePromo);

router.patch('/:id', auth, patchStatus);

// Path PUT to update 
//router.put('/:id', promotionsController.updateUser);

// path DELETE
//router.delete('/:id', promotionsController.deleteUser);

module.exports = router;