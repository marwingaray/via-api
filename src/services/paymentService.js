const db = require("../database/firestoreDb");
const {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  getDocs,
} = require("firebase/firestore");


const { updateStatePaymentAll } = require("./promoHistoryService.js");
const { createUser } = require("./usersService.js");
const { message } = require("../schemas/promotionHistorySchema");
const { getPromotionsAvailable } = require("./promotionService")

const pathCollection = "users";

const createPayment = async (driverId, newPayment) => {
  try {
    const resState = await updateStatePaymentAll(driverId);
    if (!resState) {
      return {error:true, message:"Usuario no tiene pendientes por pagar"};
    }
    const totalCredit = resState.reduce((accumulator, current) => accumulator + current.discount, 0);

    const promos = await getPromotionsAvailable();
    const promo = promos.find(promo => promo.id === "recargarCredito");
    let discountType = '%';
    let discountAmount = 0;
    let maxAmount = 0;
    if (promo) {
      discountType = promo.discountType;
      discountAmount = promo.discountAmount;
      maxAmount = promo.conditions.maxAmount || null;
    }
    let discount = (totalCredit * (discountAmount/100))
    if (maxAmount && maxAmount>0 && discount > maxAmount) {
      discount = maxAmount;
    }
    const total = discount + totalCredit;

    newPayment.credit = totalCredit;
    newPayment.amount = total;
    newPayment.promotionalPercentage = discountAmount;
    const userRef = db.collection(pathCollection).doc(driverId);
    const userSnapshot = await userRef.get();
    //console.log("userSnapshot.exists",userSnapshot.exists);
    if (!userSnapshot.exists) {
      const resUser = await createUser(driverId);
      if (resUser) {
        const userRef_ = db.collection(pathCollection).doc(driverId);
        const userSnapshot_ = await userRef_.get();
        const currentHistory = userSnapshot_.data().payments || [];
        currentHistory.push(newPayment);
        await userRef.update({ payments: currentHistory });
        return {error:false, message:"User created, payment registered", data: newPayment};
      }else{
        return {error:true, message:'Error creating user'};
      }
    }
    const currentHistory = userSnapshot.data().payments || [];
    currentHistory.push(newPayment);
    await userRef.update({ payments: currentHistory });
    return {error:false, message:"Payment registered", data:newPayment};
  } catch (error) {
    return {error:true, message:error.message};
  }
};

module.exports = { createPayment }