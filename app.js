
const dotenv = require('dotenv');
const express = require('express');
const  morgan = require('morgan');
const promotionsRoutes = require('./src/routes/promotionsRoutes.js');
const promotionsHistoryRoutes = require('./src/routes/promotionHistoryRoutes.js');

dotenv.config();

const app = express();
app.set("port",process.env.PORT || 3000);
app.set('json spaces', 2);



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

app.get('/v1/api/promotions2/:idUser/:trips/:typeService/:typeUser', (req, res) => {
  try {
    
    const authHeader = req.headers.authorization;

    /*if (!authHeader) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token inválido o mal formado' });
    }*/

    const responseSuccess = {
      status:'success',
      promotions:
        {
          codPromo:'50FREE',
          title: '50% de descuento en tus 4 primeros viajes',
          terms: 'Aplica a nuevos usuarios, maximo 4 uso por usuario, promocion no aplicable con otras, etc ....',
          discountType:'PEN',
          discountAmount:3,
          endDate:'2024-11-01',
          startDate: '2024-11-30',
          maxUse:400,
          maxUseByUser: 4,
          currentUsage:"1",
          maxAmount: 3
        }
    };
    res.json(responseSuccess);
  } catch (error) {
    console.error('Error al procesar el token:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } 
})


app.get('/v1/api/promotions2/:typeService/:typeUser', (req, res) => {   
  try {
    // Extraer el token del encabezado Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    // Eliminar el prefijo "Bearer " del token
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token inválido o mal formado' });
    }

    responseSuccess = {
      status:'success',
      promotions:[
        {
          codPromo:'50FREE',
          title: '50% de descuento en tus 4 primeros viajes',
          terms: 'Aplica a nuevos usuarios, maximo 4 uso por usuario, promocion no aplicable con otras, etc ....',
          discountType:'PEN',
          discountAmount:3,
          endDate:'2024-11-01',
          startDate: '2024-11-30',
          maxUse:400,
          maxUseByUser: 4,
          currentUsage:"1",
          maxAmount: 10.00
        },
        {
          codPromo:'50FREE2',
          title: '50% de descuento en tus 4 primeros viajes',
          terms: 'Aplica a nuevos usuarios, maximo 4 uso por usuario, promocion no aplicable con otras, etc ....',
          discountType:'%',
          discountAmount:50,
          endDate:'2024-11-01',
          startDate: '2024-11-30',
          maxUse:400,
          maxUseByUser: 4,
          currentUsage:"1",
          maxAmount: 10.00
        }
      ]
    };
    res.json(responseSuccess);
  } catch (error) {
    console.error('Error al procesar el token:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } 
  //res.json({"Title": "Hola mundo"});
})


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