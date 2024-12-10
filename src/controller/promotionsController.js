const response = require('express');
const getDatabase = require('../database');
const dayjs = require('dayjs');
const promotionService = require('../services/promotionService')

const db = require("../database/firestoreDb")


//const newDb = new FirestoreDatabase()



//const db = getDatabase;


const createPromotions = async (req, res) => {
  try {
    const userData = req.body;
    const result = await db.create('users', userData);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
}

const getPromotionsAvailable = async (req, res) => {
  try {
    const datare = req.body;
    const data = await promotionService.getPromotionsAvailable();
    if (data) {
      let response={
        code:200,
        data:{
          status:"success",
          promotions:[]
        }
      }
      data.forEach(promo=>{
        const dateObjectStart = new Date(promo.startDate._seconds * 1000);
        const startDate = dayjs(dateObjectStart).format('YYYY-MM-DD');
        const dateObjectEnd = new Date(promo.endDate._seconds * 1000);
        const endDate = dayjs(dateObjectEnd).format('YYYY-MM-DD');
        promotion= {
          codPromo: promo.codPromo,
          title: promo.name,
          terms: promo.terms,
          discountType: promo.discountType,
          discountAmount: promo.discountAmount,
          endDate:endDate,
          startDate: startDate,
          maxUseByUser: promo.conditions.promoPerUser,
        }
    
        response.data.promotions.push(promotion);
      })

      res.status(response.code).json(response.data);

    }else {
      console.log("No se encontraron datos");
      res.status(204).json({ message: "No se encontraron promociones disponibles" });
    }
    return
  } catch (error) {
    res.status(500).json({ error: 'Error' });
  }
}

async function addPromotionHistory(req, res) {
  try {
    const userData = req.body;

/*

    structure from add record to history,

    uid, promoCod, useAt, discount,
*/

    const result = await db.create('promotionHistory', userData);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
}


// status: SUCCESS
const getPromotions = async (req, res) => {
  try {
    const data = req.body;
    const result = await promotionService.getPromotions();
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
}


const getPromotionByUser = async (req, res) => {
  const { idUser, trips, typeService, typeUser } = req.params;
  let response = {};
  try {
    //const data = await db.data('promotions');
    const data = await promotionService.getPromotions();
    //promotionService.getPromotions
    const promoNewsPassenger = data.find(promo => promo.id === 'news');

    //console.log('data', promoNewsPassenger)
    if(promoNewsPassenger){

      /*const countPromoUsage = await promoHistoryService.getPromotionByUser(idUser, promoNewUser.promCod);
      if (countPromoUsage && countPromoUsage>) {
        
      }*/
      console.log("prom conditions", promoNewsPassenger.conditions)
      const promo = byNewUsers(promoNewsPassenger.conditions,trips);
      console.log("prom", promo)
      if (!promo) {
        response = {
          code:204,
          data:{
            status:"success",
            promotions:{},
            message: 'The user does not apply for any promotion'
          }
            
          
        }
        
      }else{
        const dateObjectStart = new Date(promoNewsPassenger.startDate._seconds * 1000);
        const startDate = dayjs(dateObjectStart).format('YYYY-MM-DD');
        const dateObjectEnd = new Date(promoNewsPassenger.endDate._seconds * 1000);
        const endDate = dayjs(dateObjectEnd).format('YYYY-MM-DD');

        response = {
          code:200,
          data:{
            status:"success",
            promotions:{
              codPromo: promoNewsPassenger.codPromo,
              title: promoNewsPassenger.name,
              terms: promoNewsPassenger.terms,
              discountType: promoNewsPassenger.discountType,
              discountAmount: promoNewsPassenger.discountAmount,
              endDate:endDate,
              startDate: startDate,
              maxUseByUser: promoNewsPassenger.conditions.promoPerUser,
              currentUsage: parseFloat(trips) +1,
              maxAmount: promo
            }
          },
        }
      }
      res.status(response.code).json(response.data);
      return true
      
    }else{
      //TODO ver otra s promociones


    }



    res.status(201).json(response);


  } catch (error) {
    res.status(500).json({ error: error.message});
  }
}


/*
function checkPromos(){
let data=[
  {
        "id": "lO1kx59HbSgZFVKYjdAO",
        "codPromo": "ASD31",
        "name": "PROMO 50%  de descuento en los primeros 3 viajes",
        "startDate": {
            "_seconds": 1732770000,
            "_nanoseconds": 561000000
        },
        "terms": "Aplica a usuarios nuevos, máximo 1 viaje por usuario,  descuento sobre precio sugerido.",
        "service": "Taxi",
        "maxUse": null,
        "useCount": 0,
        "status": true,
        "conditions": {
            "maxTrips": 3,
            "maxAmount": 20
        },
        "user": "pasajero",
        "endDate": {
            "_seconds": 1733806800,
            "_nanoseconds": 5000000
        },
        "discountType": "PEN",
        "discountAmount": 5
    },
    {
        "id": "mDccyZzrG7AJuf075Yg5",
        "codPromo": "321DES",
        "user": "pasajero",
        "useCount": 20,
        "estatus": true,
        "service": "Taxi",
        "endDate": {
            "_seconds": 1735275600,
            "_nanoseconds": 307000000
        },
        "startDate": {
            "_seconds": 1730437200,
            "_nanoseconds": 517000000
        },
        "masUse": 100,
        "name": "25% de descuento  este viernes",
        "discountAmount": 25,
        "discountType": "%",
        "terms": "Todos los viernes entre las 12:00 pm hasta 5:00 pm, uso máximo por usuario 1, máximos 100 usos",
        "conditions": {
            "maxAmount": 15,
            "maxTrips": 1
        }
    }
  ]

  if (data) {
    if(data.news){

    }

    data.forEach(promo => {

      const startDate = new Date(promo.startDate._seconds * 1000);
      const endDate = new Date(promo.endDate._seconds * 1000);
      const currentDate = new Date();
      if (promo.status && currentDate >= startDate && currentDate <= endDate ) {
        if (promo.conditions) {
          switch (promo.conditions) {
            case value:
              
              break;
          
            default:
              break;
          }
        }
      }
    });
  }
}
  */



/*
function byUser(conditions, uid){
  if (conditions.byUser?.all) {
    return true;
  }else{
    const found = conditions.byUser.find((user)=>user==uid)
    return true ? found: false;
  }
}

function byDays(conditions ){
  if (conditions.byDays) {
    const todayDate = dayjs();
    const hasMatchingDate = conditions.byDays.some(ts => {
      const firestoreDate = dayjs.unix(ts._seconds); // Convertimos el timestamp a Day.js
      return firestoreDate.isSame(todayDate, 'day'); // Comparamos solo el día
    });
    return hasMatchingDate;
  }else{
    return false;
  }
}
  */

// TODO VERIFICAR CANTIDAD DE VECES USADAS LA PROMO

function byNewUsers(conditions, trips){
  const promoPerUser = (conditions.promoPerUser) ? conditions.promoPerUser : null
  /*const perDay = (conditions.perDay) ? conditions.perDay : null
  if (perDay && perDay > 0) {
    return false;
  }*/
  if (promoPerUser && promoPerUser <= trips) {
    return false;
  }
  return conditions.maxAmount || 0;
}


module.exports = { createPromotions, getPromotions, getPromotionByUser, getPromotionsAvailable};
