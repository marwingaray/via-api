const response = require('express');

const dayjs = require('dayjs');
const promotionService = require('../services/promotionService')

const db = require("../database/firestoreDb");
const { message } = require('../schemas/promotionHistorySchema');


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
  let response = {};
  try {
    const data = await promotionService.getPromotionsAvailable();
    if (!Array.isArray(data)) {
      response = {code: 204, response: false, data:{}, message: "The user does not apply for any promotion."}
    }
    const filteredPromo = data.filter(
      promo => promo.service.toUpperCase() == typeService.toUpperCase() && promo.userType.toUpperCase() == typeUser.toUpperCase()
    );
    if (Array.isArray(filteredPromo) && filteredPromo.length>0) {
      filteredPromo.sort((a, b) => a.priority.seconds - b.priority.seconds);
      const selectedPromo = filteredPromo[0];
      const typePromo = selectedPromo.conditions?.type;
      
      switch (typePromo) {
        case 'recharge':
          response = promoRecharge(selectedPromo)
          break;
        case 'news':
          const promoNewsPassenger = data.find(promo => promo.id === 'news');
          response = promoNewUsers(selectedPromo,trips)
          break;
        /*case 'perDays':
          response = promoPerDays()
          break;
        case 'perHours':
          response = promoPerHours()
          break;*/
        default:
          response = response = {code: 204, response: false, data:{}, message: "NOT FOUND PROMOTIONS"}
          break;
      }
    }else{
      response = {code: 204, response: false,data:{}, message: "The user does not apply for any promotion"}
    }
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


const promoNewUsers = (promoNewsPassenger, trips) => {
  const promo = byNewUsers(promoNewsPassenger.conditions,trips);
  if (!promo) {
    return {code: 204, data:{}, response: false, message: "The user does not apply for any promotion"}
  }
  const uid = promoNewsPassenger.id;
  const dateObjectStart = new Date(promoNewsPassenger.startDate._seconds * 1000);
  const startDate = dayjs(dateObjectStart).format('YYYY-MM-DD');
  const dateObjectEnd = new Date(promoNewsPassenger.endDate._seconds * 1000);
  const endDate = dayjs(dateObjectEnd).format('YYYY-MM-DD');

  const data = {
    uid: uid || 123,
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

  return {code: 200, response: true, data: data, message: "ok"}
}

promoRecharge = (promo)=>{
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

module.exports = { createPromotions, getPromotions, getPromotionByUser, getPromotionsAvailable};
