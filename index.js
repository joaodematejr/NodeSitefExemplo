const path = require('path');
const SiTef = require('node-sitef');

const dlls = path.resolve(__dirname, 'bin', 'CliSiTef64I.dll');

const sitef = new SiTef(dlls)

console.log(sitef)



