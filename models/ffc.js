const MongoClient = require('mongodb').MongoClient;
const dbUrl = "mongodb://localhost:27017/ffc";
const dbName = "ffc";

/**
 * สร้าง query เชื่อมไปยัง ffc
 * @param collection ชื่อ collection เช่น person, org .....
 */
const FFC = function (collection) {
    this.collection = collection
};

FFC.prototype.collection = {}

/**
 * ทำการ query
 * @param query เช่น {"orgId":"sdfasdfsadfedsf"}
 * @param callback(result) คำสั่งที่จะให้ทำงาน
 */
FFC.prototype.find = function (query, callback) {
    MongoClient.connect(dbUrl, {useNewUrlParser: true}, (err, db) => {
        if (err) throw err;
        const dbo = db.db(dbName);
        dbo.collection(this.collection).find(query).toArray((err, result) => {
            if (err) throw err;
            callback(result)
        });

    });
};

module.exports = FFC;
