const express = require('express');
const router = express.Router();
const DBService = require('../services/mongoDB.js');
const sessions = require('../services/sessions.js');
const {statusCodes} = require('../config/consts.js');
const {collectionName} = require('../config/consts.js');

/**
 * getting all sessions from mongoDB
 */
router.get('/getSessions', async function (req, res, next) {
    try {
        console.log('In getSessions() - starting to get sessions data.');

        const result = await sessions.getAllSessions();

        const isFailed = !(result && result.ok && result.data);
        if (isFailed) {
            console.error("Error: Failed to save session on db.");
            return res.status(statusCodes.BAD_REQUEST).send({data: null, statusCode: statusCodes.BAD_REQUEST, msg: "Error Db client not found, failed to save session"});
        }
        console.log('In getSessions() - finish getting sessions data.');
        return res.send({data: result.data, statusCode: statusCodes.OK, msg: 'success'});
    } catch (err) {
        console.error("In /getSessions - Error: ", err);
        return res.status(statusCodes.BAD_REQUEST).send({data: null, statusCode: statusCodes.BAD_REQUEST, msg: err});
    }
});

/**
 * saving session to mongoDB
 */
router.post('/savesSessionToDb', async function (req, res, next) {
  try {
      console.log('In savesSessionToDb() - starting to save data.');

      const isNotValidBody = !(req && req.body);
      if (isNotValidBody) {
        console.error("no request body found, failed to save session.");
        return res.status(statusCodes.BAD_REQUEST).send({data: null, statusCode: statusCodes.BAD_REQUEST, msg: "no request body found, failed to save session."});
      }

      const result = await sessions.savesSession(req.body);
      const isFailed = !(result && result.ok);
      if (isFailed) {
        console.error("Failed to save session on db.");
        return res.status(statusCodes.BAD_REQUEST).send({data: null, statusCode: statusCodes.BAD_REQUEST, msg: "Error Db client not found, failed to save session"});
      }

      console.log('In savesSessionToDb() - finish saving data.');
      return res.send({data: null, statusCode: statusCodes.CREATED, msg: 'success'});
  } catch (err) {
    console.error("In /savesSessionToDb - Error: ", err);
    return res.status(statusCodes.BAD_REQUEST).send({data: null, statusCode: statusCodes.BAD_REQUEST, msg: err});
  }
});

module.exports = router;
