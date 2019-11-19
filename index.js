const FFC = require('./models/ffc');
const Pyramid = require('./models/pyramid');
const Chronics = require('./models/chronic');
const ObjectID = require('mongodb').ObjectID;

const rootPart = "/report";

const express = require('express');
const app = express();
const apicache = require('apicache');
const cache = apicache.middleware;

// const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const whitelist = [
    'https://report.ffc.in.th',
    'http://localhost:3000'];

const corsOptions = {
    origin: function (origin, callback) {
        console.log(origin, " Origin");
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // callback(new Error('Not allowed by CORS')); // ใช้จริงจะเอา comment ออก
            callback(null, true);
        }
    },
    credentials: true
};

// ตารางปิรามิดประชากร
app.get(rootPart + '/pyramid', cors(corsOptions), cache('12 hour'), (req, res) => {
    const personDao = new FFC("person"); // สร้างตัวเข้าถึงฐานข้อมูล ffc ที่ person
    const query = {"death.date": {"$exists": false}};
    personDao.findToArray(query, (result) => { // ค้นหาแบบ toArray โดยจะได้ result ออกมาเลย
        const prePerson = new Pyramid(result); // ตัวตัวเข้าถึง function perPersonData
        res.json(prePerson.perPersonData()); // เรียกใช้งาน
    });
});

// chronic
app.get(rootPart + '/chronic', cors(corsOptions), cache('12 hour'), (req, res) => {
    const personDao = new FFC("person"); // สร้างตัวเข้าถึงฐานข้อมูล ffc ที่ person
    const query = {
        "chronics.disease.icd10": {"$exists": true},
        "death.date": {"$exists": false}
    };
    personDao.findToArray(query, (result) => { // ค้นหาแบบ toArray โดยจะได้ result ออกมาเลย
        const chronics = new Chronics(result); // ตัวตัวเข้าถึง function perPersonData
        res.json(chronics.topChronic(-1)); // เรียกใช้งาน
    });
});

app.get(rootPart + '/chronic/:orgId', cors(corsOptions), cache('12 hour'), (req, res) => {
    const personDao = new FFC("person"); // สร้างตัวเข้าถึงฐานข้อมูล ffc ที่ person
    const orgId = req.params.orgId;
    const query = {
        "orgIndex": ObjectID(orgId),
        "chronics.disease.icd10": {"$exists": true},
        "death.date": {"$exists": false}
    };
    personDao.findToArray(query, (result) => { // ค้นหาแบบ toArray โดยจะได้ result ออกมาเลย
        const chronics = new Chronics(result); // ตัวตัวเข้าถึง function perPersonData
        res.json(chronics.topChronic(-1)); // เรียกใช้งาน
    });
});

// idorg
app.get(rootPart + '/pyramid/:orgId', cors(corsOptions), cache('12 hour'), (req, res) => {
    const orgId = req.params.orgId;
    console.log(orgId, 'perPersonData');
    const personDao = new FFC("person");
    const query = {"orgIndex": ObjectID(orgId), "death.date": {"$exists": false}};
    personDao.findToArray(query, (result) => {
        const prePerson = new Pyramid(result);
        res.json(prePerson.perPersonData());
    });
});

// ชื่อหน่วยงาน
app.get(rootPart + '/convert', cors(corsOptions), cache('12 hour'), (req, res) => {
    const orgDao = new FFC("organ");

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
app.get(rootPart + '/elderlyrat', cors(corsOptions), cache('12 hour'), (req, res) => {
    const personDao = new FFC("person");
    const haveActivitiesQuery = {
        "death.date": {"$exists": false},
        "healthAnalyze.result.ACTIVITIES": {"$exists": true}
    };
    personDao.findToArray(haveActivitiesQuery, (arr) => {
        res.json(Activ(arr));
    });
});

app.get(rootPart + '/elderlyrat/:orgId', cors(corsOptions), cache('12 hour'), (req, res) => {
    const orgId = req.params.orgId;
    console.log(orgId, 'perPersonData');

    const personDao = new FFC("person");
    const haveActivitiesQuery = {
        "death.date": {"$exists": false},
        "healthAnalyze.result.ACTIVITIES": {"$exists": true},
        "orgIndex": ObjectID(orgId)
    };
    personDao.findToArray(haveActivitiesQuery, (arr) => {
        res.json(Activ(arr));
    });
});

app.listen(7000, () => {
    console.log('Application is running on port 7000')
});

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
    var Else = 0;
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
