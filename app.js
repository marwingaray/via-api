
const dotenv = require('dotenv');
const express = require('express');
const  morgan = require('morgan');
const cors = require('cors');

const promotionsRoutes = require('./src/routes/promotionsRoutes.js');
const promotionsHistoryRoutes = require('./src/routes/promotionHistoryRoutes.js');
const paymentRoutes = require('./src/routes/paymentRoutes.js');

dotenv.config();

const app = express();
app.set("port",process.env.PORT || 3000);
app.set('json spaces', 2);

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

//const { response } = require('express');

//const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
//dotenv.config({ path: envFile });

const port = process.env.PORT || 3000;
console.log(`server running in port: ${port}`);

app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// Register the paths 'promotions'
app.use('/v1/api/promotions', promotionsRoutes);
app.use('/v1/api/promotionsHistory', promotionsHistoryRoutes);
app.use('/v1/api/payment', paymentRoutes);

/*app.post('/v1/api/promotions/payment/:uidDriver', (req, res) => {
  const response = {
    "status": "success",
    "data": {
        "userCredit": 10,
        "promotionalPercentage": 10,
        "totalUserCredit": 11
    },
    "message": "Usuario creado exitosamente"
  }
  return res.status(200).json(response);
});*/

/*app.post('/v1/api/payment/recharge/:idDriver', (req, res) => {
  const response = {
    "status": "success",
    "data": {
        "userCredit": 10,
        "promotionalPercentage": 10,
        "totalUserCredit": 11
    },
    "message": "Usuario creado exitosamente"
  }
  return res.status(200).json(response);
});*/







app.get('/', (req, res) => {    
  res.json({"Title": "Hola mundo"});
})
app.get('/v1', (req, res) => {    
  res.json({"Title": "Hola mundo v1"});
})

/**
 * Default route, not found
 */
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not found',
    path: req.originalUrl
  });
});


app.listen(app.get('port'),process.env.HOSTNAME|| '192.168.1.36',()=>{
  console.log(`Server listening on port ${app.get('port')}`);
});