const express = require('express');
const DBService = require('../services/mongoDB.js');

const router = express.Router();

// catches ctrl+c event
process.on('SIGINT', exitHandler);
// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);

init();

function init() {
  try {
    new DBService();
  } catch (e) {
      console.error('In inti() - Error: ' + e)
  }
}

function exitHandler() {
    const dbInstance = new DBService();
    const isDbInstanceExists = !!(dbInstance && dbInstance.mongo && dbInstance.mongo.client && dbInstance.mongo.db);

    if (isDbInstanceExists) {
        console.log("Closing mongo connection");
        dbInstance.closeConnection(dbInstance.mongo.client);
    }
    process.exit();
}

module.exports = router;
