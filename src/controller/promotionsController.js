const response = require('express');
const dayjs = require('dayjs');

const db = require("../database/firestoreDb");
const admin = require('firebase-admin');
const promotionService = require('../services/promotionService');
const { getUsagePromotion } = require('../services/passengerService.js');
const { message } = require('../schemas/promotionHistorySchema');
const { func } = require('joi');

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
    //const datare = req.body;
    const data = await promotionService.getPromotionsAvailable();
    //console.log('getPromotionsAvailable', data);
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
          maxUseByUser: promo.conditions?.promoPerUser || null,
          maxAmount: promo.conditions.maxAmount || null,
          maxUse: promo.maxUse || null
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
  try {
    let response = {};
    const data = await promotionService.getPromotionsAvailable();
    if (!Array.isArray(data)) {
      response = {code: 204, response: false, data:{}, message: "The user does not apply for any promotion."}
    }else{
      const filteredPromo = data.filter(
        promo => promo.service.toUpperCase() == typeService.toUpperCase() && promo.userType.toUpperCase() == typeUser.toUpperCase()
      );
      if (Array.isArray(filteredPromo) && filteredPromo.length>0) {
        filteredPromo.sort((a, b) => a.priority.seconds - b.priority.seconds);
        let promoAvailable = false;
        //console.log('filteredPromo', filteredPromo);
        //filteredPromo.forEach(promo => {
        for (const promo of filteredPromo) {
          
          //console.log('Promo foreach', promo);
          if (!promoAvailable) {
            const typePromo = promo.conditions?.type;
            console.log('typePromo', typePromo);
            switch (typePromo) {
              case 'recharge':
                response = promoRecharge(promo)
                /*if (response.response) {
                  promoAvailable = true;
                }*/
                break;
              case 'news':
                response = await promoNewUsers(promo, trips, idUser)
                //console.log('response promoNewUsers', response);
                //if (response.response) promoAvailable = true;
                break;
              case 'perDays':
                response = await promoPerDays(promo, idUser);
                //console.log('perDays response',response);
                //if (response.response) promoAvailable = true;
                //console.log('perDays promoAvailable',promoAvailable);
                break;
              /*case 'perHours':
                response = promoPerHours()
                break;*/
              default:
                response = {code: 204, response: false, data:{}, message: "Not found promotions"}
                break;
            }
            if (response.response) promoAvailable = true;
          }

        };
        //console.log('response success', response);

      }else{
        response = {code: 204, response: false,data:{}, message: "The user does not apply for any promotion"}
      }
    }
    //console.log('response response response', response);
    res.status(response.code).json({success: response.response, data:response.data, message: response.message});

  } catch (error) {
    res.status(500).json({success:false, error: error.message});
  }
}



function byNewUsers(conditions, trips){
  const promoPerUser = (conditions.promoPerUser) ? conditions.promoPerUser : null
  if (promoPerUser && promoPerUser <= trips) {
    return false;
  }
  return conditions.maxAmount || 0;
}

/**
 * valida si el usuario califica a la promocion, valida si esta en los dias y la cantidad maxima de usos por el usuario
 * @param { Object } promo 
 * @param { string } idPassenger 
 * @returns {code: 200, response: true, data: data, message: "ok"}
 */
const promoPerDays = async (promo, idPassenger) => {
  
  const now = dayjs().format('YYYY-MM-DD');
  const days = promo.conditions.list;
  if(days && days.length>0){
    const found = days.some(item => item.date === now);
    const usage = await getUsagePromotion(idPassenger, promo.id);
    if (found && (!usage || usage <= promo.conditions.promoPerUser)) {
      const uid = promo.id;
      const dateObjectStart = new Date(promo.startDate._seconds * 1000);
      const startDate = dayjs(dateObjectStart).format('YYYY-MM-DD');
      const dateObjectEnd = new Date(promo.endDate._seconds * 1000);
      const endDate = dayjs(dateObjectEnd).format('YYYY-MM-DD');

      const data = {
        uid: uid,
        codPromo: promo.codPromo,
        title: promo.name,
        terms: promo.terms,
        discountType: promo.discountType,
        discountAmount: promo.discountAmount,
        endDate:endDate,
        startDate: startDate,
        maxUseByUser: promo.conditions.promoPerUser,
        currentUsage: parseInt(usage) + 1,
        maxAmount: promo.conditions.maxAmount
        }
      return {code: 200, response: true, data: data, message: "Aplicando a promoción"}
    }else if (usage > promo.conditions.promoPerUser) {
      return {code: 204, response: false, data: {}, message: "Superó la contidad de usos de esta promoción"}
    }
  }
  return {code: 204, response: false, data: {}, message: "Not applicable"}
}


const promoNewUsers = async (promo, trips, idPassenger) => {

  const usage = await getUsagePromotion(idPassenger, promo.id);
  console.log('usage news', usage);
  if (!usage || usage <= promo.conditions.promoPerUser) {
    const uid = promo.id;
    const dateObjectStart = new Date(promo.startDate._seconds * 1000);
    const startDate = dayjs(dateObjectStart).format('YYYY-MM-DD');
    const dateObjectEnd = new Date(promo.endDate._seconds * 1000);
    const endDate = dayjs(dateObjectEnd).format('YYYY-MM-DD');

    const data = {
      uid: uid || 123,
      codPromo: promo.codPromo,
      title: promo.name,
      terms: promo.terms,
      discountType: promo.discountType,
      discountAmount: promo.discountAmount,
      endDate:endDate,
      startDate: startDate,
      maxUseByUser: promo.conditions.promoPerUser,
      currentUsage: usage || 0 + 1,
      maxAmount: promo.conditions.maxAmount
    }
    return {code: 200, response: true, data: data, message: "ok"}
  }
  return {code: 204, response: false, data: {}, message: "Usuario superó la contidad de usos de esta promoción"}
}

const promoRecharge = (promo)=>{
  const dateObjectStart = new Date(promo.startDate._seconds * 1000);
  const startDate = dayjs(dateObjectStart).format('YYYY-MM-DD');
  const dateObjectEnd = new Date(promo.endDate._seconds * 1000);
  const endDate = dayjs(dateObjectEnd).format('YYYY-MM-DD');

  const data ={
    uid: promo.id,
    codPromo: promo.codPromo,
    title: promo.name,
    terms: promo.terms,
    discountType: promo.discountType,
    discountAmount: promo.discountAmount,
    endDate:endDate,
    startDate: startDate,
    maxUseByUser: promo.conditions.promoPerUser,
    currentUsage: 1,
    maxAmount: promo.conditions.maxAmount
  }

  return {code: 200, response: true, data: data, message: "ok"}
}



const setPromotionHandler = async (req, res) => {
  const data = req.body
  let response = {};
  console.log( 'setPromotionHandler data', data);
  const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/; // YYYY-MM-DD
  if (!dateRegex.test(data.startDate) || !dateRegex.test(data.endDate)) {
    response = {code: 500, response: false,data:{}, message: "Data error"}
  }else{
    const dateObjectStart = new Date(data.startDate);
    const  startDate = admin.firestore.Timestamp.fromDate(dateObjectStart);
    const dateObjectEnd = new Date(data.endDate);
    let endDate = admin.firestore.Timestamp.fromDate(dateObjectEnd);
    data.startDate = startDate;
    data.endDate = endDate;
    const dataSet = {createAt: new Date(), ...data}
    try {
      const resSet = await promotionService.setPromotion(dataSet);
      if (!resSet) {
        response = {code: 500, response: false,data:{}, message: "Error  inserting record"}
      }else{
        response = {code: 201, response: true,data:{uid: resSet}, message: "Record registered"}
      }
      
    } catch (error) {
      response = {code: 503, response: false, data:{}, message: error}
    }
  }
  
  res.status(response.code).json({success:response.response, data: response.data, message: response.message});
}

module.exports = { createPromotions, getPromotions, getPromotionByUser, getPromotionsAvailable, setPromotionHandler};
