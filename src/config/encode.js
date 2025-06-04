const fs = require('fs');

const json = fs.readFileSync('google-firebase.json');
const base64 = Buffer.from(json).toString('base64');

console.log(base64);