const admin = require('firebase-admin');

const verifyAppCheck = async (req, res, next) => {
   try {
      const appCheckToken = req.header('X-Firebase-AppCheck');

      if (!appCheckToken) {
         return res.status(401).json({
            error: 'App Check token missing'
         });
      }

      await admin.appCheck().verifyToken(appCheckToken);

      next();
   } catch (error) {
      console.error('App Check Error:', error);
      return res.status(401).json({
         error: 'Invalid App Check token'
      });
   }
};