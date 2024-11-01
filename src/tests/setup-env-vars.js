const { config } = require('dotenv');
const path = require('path');

config({
  path: path.resolve(process.cwd(), '.env.test'),
});