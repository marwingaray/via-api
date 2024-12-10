const express =  require('express');
//import  auth from '../middlewares/auth.js';
const { getPromotions, getPromotionByUser, getPromotionsAvailable } = require('../controller/promotionsController.js');

const router = express.Router();


// controllers to manage las request de promotions


// Path GET para obtener todos los usuarios
router.get('/', getPromotions);

// Path GET para obtener un usuario por ID
router.get('/:typeService/:typeUser',  ((req, res)=>{
  getPromotionsAvailable(req, res)
}) );

router.get('/:idUser/:trips/:typeService/:typeUser',  ((req, res)=>{
  getPromotionByUser(req, res)
}) );

// Path POST para crear un nuevo usuario
//router.post('/', promotionsController.createUser);

// Path PUT para actualizar un usuario
//router.put('/:id', promotionsController.updateUser);

// path DELETE para eliminar un usuario
//router.delete('/:id', promotionsController.deleteUser);

module.exports = router;