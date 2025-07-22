
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const promotionsRoutes = require('./src/routes/promotionsRoutes.js');
const promotionsHistoryRoutes = require('./src/routes/promotionHistoryRoutes.js');
const paymentsRoutes = require('./src/routes/paymentRoutes.js');

dotenv.config();

const app = express();
app.set("port",process.env.PORT);
app.set('json spaces', 2);

const allowedOrigins = [
  'http://localhost:4200',
  'https://register.aqupe.com',
  'http://192.168.1.100:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No autorizado por CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

app.use((err, req, res, next) => {
  if (err.message === 'CORS unauthorized') {
    return res.status(403).json({ error: 'CORS' });
  }
  next(err);
});




const port = process.env.PORT;
console.log(`server running in port: ${port}`);


app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));

app.use(express.json());


// Register the paths 'promotions'
app.use('/v1/api/promotions', promotionsRoutes);
app.use('/v1/api/promotionsHistory', promotionsHistoryRoutes);
app.use('/v1/api/payments', paymentsRoutes);


app.get('/', (req, res) => {    
  res.json({"Error": "not found"});
})
app.get('/v1', (req, res) => {    
  res.json({"Error": "not found"});
})

app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not found',
    path: req.originalUrl
  });
});


app.listen(app.get('port'),()=>{ 
  console.log(`Server listening on port ${app.get('port')}`);
});


// LOCALHOST DEPLOY WITH HTTPS: OK
// const options = {
//   key: fs.readFileSync('./certs/server.key'),
//   cert: fs.readFileSync('./certs/server.cert'),
// };
// https.createServer(options, app).listen(4430, () => {
//   console.log('server HTTPS listened in https://localhost:4430');
// });