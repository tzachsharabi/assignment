const MongoClient = require('mongodb').MongoClient;
const addresses = require('../config/addresses.js');
const {mongoDbName} = require('../config/consts.js');
const {extractArrayOfData} = require('../src/helpers/helpers.js');
const PromiseB = require('bluebird');

class DBService {

    constructor() {
        if (DBService.dbInstance) {
            return DBService.dbInstance;
        }
        DBService.dbInstance = this;
        this.init();
    }

    async init() {
        try {
            console.log(`Init DB Service ${new Date()}`);
            await this.openConnection();
        } catch (ex) {
            console.error(`Failed to Init DB Service ${new Date()}, Error:${ex}`);
            throw ex;
        }
    }

    async openConnection() {
        try {
            console.log("Opening connection to mongodb.");
            const mongoClient = new MongoClient(addresses.mongoConnectionUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            // Use connect method to connect to the Server
            await mongoClient.connect();
            const db = mongoClient.db(mongoDbName);
            console.log("Connection to mongodb - success.");
            this.mongo = {db: db, client: mongoClient};
        } catch (err) {
            console.error("Error connecting to DB: ", err);
            throw err;
        }
    }

    closeConnection(client) {
        try {
            console.log(`closing DB Service connection  ${new Date()}`);
            if (client) {
                client.close();
            }
        } catch (ex) {
            console.error(`Failed to close DB Service connection  ${new Date()}, Error:${ex}`);
            throw ex;
        }
    }

    async insertToDb(data, collectionName, db) {
        return new Promise(async (resolve, reject) => {
            try {
                if (data && collectionName) {
                    let collection = db.collection(collectionName);

                    collection.insert(data, {upsert: true}, (err, res) => {
                        if (err) {
                            console.error('In insertToDb() - Error: ' + err);
                            resolve({ok: false});
                        } else {
                            console.log('In insertToDb() - Success');
                            resolve({ok: true, data: res});
                        }
                    });
                } else {
                    console.error('In insertToDb() - one or more props are missing');
                    resolve({ok: false});
                }
            } catch (e) {
                console.error('In insertToDb() - Error: ' + e);
                reject(e);
            }
        });
    };


    async getFromDbByQuery(findQuery, collectionName, db) {
        return new Promise(async (resolve, reject) => {
            try {
                if (findQuery && collectionName) {
                    const collection = db.collection(collectionName);
                    const find = PromiseB.promisify(collection.find, {context: collection});
                    const list = await find(findQuery);
                    if (list) {
                        const result = await extractArrayOfData(list);
                        if (result) {
                            console.log('In getFromDbByQuery() - data found and returned!');
                            resolve({ok: true, data: result});
                        } else {
                            console.log('In getFromDbByQuery() - failed to return data array.');
                            resolve({ok: false});
                        }
                    } else {
                        console.log('In getFromDbByQuery() - failed to get data.');
                        resolve({ok: false});
                    }
                } else {
                    console.error('In getFromDbByQuery() - one or more props are missing');
                    resolve({ok: false});
                }
            } catch (e) {
                console.error('In getFromDbByQuery() - Error: ' + e);
                reject(e);
            }
        });
    };
}




module.exports = DBService
