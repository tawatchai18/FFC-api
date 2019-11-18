const dbUrl = "mongodb://localhost:27017/ffc";
const FFC = require('./models/ffc');
const Pyramid = require('./models/pyramid');
const express = require('express');
const app = express();
var apicache = require('apicache');
var MongoClient = require('mongodb').MongoClient;
let cache = apicache.middleware;

// const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:7000',
    optionsSuccessStatus: 200
};

// ตารางปิรามิดประชากร
app.get('/pyramid', cors(corsOptions), cache('12 hour'), (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    const personDao = new FFC("person"); // สร้างตัวเข้าถึงฐานข้อมูล ffc ที่ person
    const query = { "death.date": { "$exists": false } };
    personDao.findToArray(query, (result) => { // ค้นหาแบบ toArray โดยจะได้ result ออกมาเลย
        const prePerson = new Pyramid(result); // ตัวตัวเข้าถึง function perPersonData
        res.json(prePerson.perPersonData()); // เรียกใช้งาน
    });
});

// idorg
app.get('/pyramid/:orgId', cors(corsOptions), cache('12 hour'), (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    const orgId = req.params.orgId;
    console.log(orgId, 'perPersonData');
    const personDao = new FFC("person");
    const query = { "orgId": orgId, "death.date": { "$exists": false } };
    personDao.findToArray(query, (result) => {
        const prePerson = new Pyramid(result);
        res.json(prePerson.perPersonData());
    });
});

// ชื่อหน่วยงาน
app.get('/convert', cors(corsOptions), cache('12 hour'), (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    const orgDao = new FFC("organ")

    orgDao.findToArray({}, (result) => {
        var data = [];
        result.forEach((item) => {
            data.push({
                name: item.displayName,
                label: item.displayName,
                id: item.id,
            })
        });
        res.json(data);
        console.log(data, '======');
    });
});

// อัตราส่วนผู้สูงอายุ
app.get('/elderlyrat', cors(corsOptions), cache('12 hour'), (req, res) => {
    MongoClient.connect(dbUrl, { useNewUrlParser: true }, (err, db) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        if (err) throw err;
        var dbo = db.db('ffc');
        var haveActivitiesQuery = {
            "death.date": { "$exists": false }, "healthAnalyze.result.ACTIVITIES": { "$exists": true }
        };
        dbo.collection("person").find(haveActivitiesQuery).toArray((err, arr) => {
            if (err) throw err;
            if (!Array.isArray) {
                Array.isArray = function (arg) {
                    return Object.prototype.toString.call(arg) === '[object Array]';
                };
            }
            res.json(Activ(arr))
        });
    });
});

app.get('/elderlyrat/:orgId', cors(corsOptions), cache('12 hour'), (req, res) => {
    const orgId = req.params.orgId;
    console.log(orgId, 'perPersonData');
    MongoClient.connect(dbUrl, { useNewUrlParser: true }, (err, db) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        if (err) throw err;
        var dbo = db.db('ffc');
        var q = {
            "death.date": { "$exists": false }, $or: [
                { "healthAnalyze.result.ACTIVITIES.severity": "MID" },
                { "healthAnalyze.result.ACTIVITIES.severity": "OK" },
                { "healthAnalyze.result.ACTIVITIES.severity": "VERY_HI" }
            ],
            "orgId": orgId
        }
        dbo.collection("person").find(q).toArray((err, arr) => {
            if (err) throw err;
            if (!Array.isArray) {
                Array.isArray = function (arg) {
                    return Object.prototype.toString.call(arg) === '[object Array]';
                };
            }
            res.json(Activ(arr))
        });
    });
});

app.listen(7000, () => {
    console.log('Application is running on port 7000')
})

function Activ(arr) {
    const data = [
        {
            0: "MID",
            "mid": 0
        },
        {
            1: "OK",
            "ok": 0
        },
        {
            2: "VERY_HI",
            "veryhi": 0
        },
        {
            3: "othor",
            "null": 0
        }
    ];
    var moment = require('moment');
    let Else = 0;
    console.log(Else, 'มากกว่า 60');
    arr.forEach((item) => {
        if (item.healthAnalyze.result !== undefined) {
            var years = moment().diff(item.birthDate, 'years', false);
            if (years >= 60) {
                if (item.healthAnalyze.result.ACTIVITIES.severity === 'MID') {
                    data['0'].mid += 1;
                } else if (item.healthAnalyze.result.ACTIVITIES.severity === 'OK') {
                    data['1'].ok += 1;
                } else if (item.healthAnalyze.result.ACTIVITIES.severity === 'VERY_HI') {
                    data['2'].veryhi += 1;
                }
            } else {
                data['3'].null += 1
            }
        }
    });

    var ACTIV = {
        "MID": data['0'].mid,
        "OK": data['1'].ok,
        "VERYHI": data['2'].veryhi,
        "UNKNOWN": data['3'].null,
        "total": data['0'].mid + data['1'].ok + data['2'].veryhi + data['3'].null,
        "byActive": [
            {
                "name": "ติดสังคม",
                "peple": data['1'].ok
            },
            {
                "name": "ติดบ้าน",
                "peple": data['0'].mid
            },
            {
                "name": "ติดเตียง",
                "peple": data['2'].veryhi
            },
            {
                "name": "ไม่ระบุ",
                "peple": data['3'].null
            }
        ]
    };

    return ACTIV;
}
