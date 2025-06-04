const express =  require('express');
//import  auth from '../middlewares/auth.js';
const { getPromotions, getPromotionByUser, getPromotionsAvailable, setPromotionHandler } = require('../controller/promotionsController.js');
const promotionSchema = require('../schemas/promotionsSchema.js')
const {validatePromotion} = require('../middlewares/validatePromotion.js')
const auth = require('../middlewares/auth.js');
const router = express.Router();


// controllers to manage las request de promotions

// Path GET para obtener todos las promociones
router.get('/', auth, getPromotions);

// Path GET para obtener un usuario por ID
router.get('/:typeService/:typeUser',  ((req, res)=>{
  getPromotionsAvailable(req, res)
}) );

router.get('/:idUser/:trips/:typeService/:typeUser',  ((req, res)=>{
  getPromotionByUser(req, res)
}) );

router.post('/',auth,validatePromotion(promotionSchema), setPromotionHandler);


// Path PUT para actualizar un usuario
//router.put('/:id', promotionsController.updateUser);

// path DELETE para eliminar un usuario
//router.delete('/:id', promotionsController.deleteUser);

module.exports = router;