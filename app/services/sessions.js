const DBService = require('./mongoDB.js');
const {collectionName} = require('../config/consts.js');

/**
 * getting all sessions from mongoDB
 * @returns {Object} {Promise<unknown>}
 */
module.exports.getAllSessions = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const dbInstance = new DBService();
            const isDbInstanceNotExists = !(dbInstance && dbInstance.mongo && dbInstance.mongo.client && dbInstance.mongo.db);
            if (isDbInstanceNotExists) {
                console.error("In getAllSessions - Error: Db client not found, failed to get sessions data");
                resolve({ok: false});
            }
            const dbRes = await dbInstance.getFromDbByQuery({}, collectionName, dbInstance.mongo.db)
            const isFailed = !(dbRes && dbRes.ok && dbRes.data);
            if (isFailed) {
                console.error("In getAllSessions - Error: Failed to save session on db.");
                resolve({ok: false});
            }
            resolve({ok: true, data: dbRes.data});
        } catch (err) {
            console.error("In getAllSessions -  Error: ", err);
            reject(err);
        }
    })
}

/**
 * saving session to mongoDB
 * @param {Array} data
 * @returns {Object} {Promise<unknown>}
 */
module.exports.savesSession = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const isNotValidData = !(data);
            if (isNotValidData) {
                console.error("In savesSession - no data found, failed to save session.");
                return res.status(statusCodes.BAD_REQUEST).send({data: null, statusCode: statusCodes.BAD_REQUEST, msg: "no request body found, failed to save session."});
            }

            const dbInstance = new DBService();
            const isDbInstanceNotExists = !(dbInstance && dbInstance.mongo && dbInstance.mongo.client && dbInstance.mongo.db);
            if (isDbInstanceNotExists) {
                console.error("In savesSession - Error Db client not found, failed to save session");
                resolve({ok: false});
            }
            const dbRes = await dbInstance.insertToDb(data, collectionName, dbInstance.mongo.db);
            const isFailed = !(dbRes && dbRes.ok);
            if (isFailed) {
                console.error("In savesSession - Failed to save session on db.");
                resolve({ok: false});
            }

            console.log('In savesSession - finish saving data.');
            resolve({ok: true});
        } catch (err) {
            console.error("In savesSession -  Error: ", err);
            reject(err);
        }
    })
}
