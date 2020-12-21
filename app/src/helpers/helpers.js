/**
 * return true if the value is of type Object
 * @param {object} val
 * @returns {boolean}
 */
module.exports.isAnObject = (val) => {
    return !!(val && typeof val === 'object' && val.constructor === Object);
}


/**
 * creating array of data from object
 * @param {object} list
 * @returns {Promise<unknown>}
 */
module.exports.extractArrayOfData = (list)=> {
    return new Promise((resolve) => {
        list.toArray((err, docs) => {
            resolve(docs);
        });
    });
}

