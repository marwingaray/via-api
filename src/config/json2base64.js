const fs = require('fs');
const filePath = path.join(
   __dirname,
   'dev-viago-firebase-adminsdk-r5k0t-dc54289b77.json'
);
const json = fs.readFileSync(filePath, 'utf8');
const base64 = Buffer.from(json).toString('base64');

console.log(base64);