/**
 * ถ้าไม่ได้กำหนดค่า MONGODB_URI จะดึงค่าจาก dbUrl
 * @type {string}
 */
const dbUrl = "mongodb://localhost:27017/ffc";
const MongoClient = require('mongodb').MongoClient;
const dbName = "ffc";
const process = require('process');

/**
 * สร้าง query เชื่อมไปยัง ffc
 * @param collection ชื่อ collection เช่น person, org .....
 */
const FFC = function (collection) {
    this.collectionName = collection
};

FFC.prototype.collectionName = {};

/**
 * ทำการ query
 * @param query เช่น {"orgId":"sdfasdfsadfedsf"}
 * @param callback(result) คำสั่งที่จะให้ทำงาน
 */
FFC.prototype.findToArray = function (query, callback) {
    this.collection((collection) => {
        collection.find(query).toArray((err, result) => {
            if (err) throw err;
            callback(result)
        });

    });
};

/**
 * เปรียบเสมือนการใช้คำสั่ง dbo.collection
 * แต่ในที่นี้จะใส่ชื่อ collection ให้เลย
 * @param callback
 */
FFC.prototype.collection = function (callback) {
    MongoClient.connect(getMongoUrl(), {useNewUrlParser: true}, (err, db) => {
        if (err) throw err;
        const dbo = db.db(dbName);
        callback(dbo.collection(this.collectionName))
    });
};

function getMongoUrl() {
    const env = process.env.MONGODB_URI;
    if (env !== undefined)
        return env;
    else
        return dbUrl;
}

module.exports = FFC;
