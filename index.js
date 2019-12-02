const FFC = require('./models/ffc');
const Pyramid = require('./models/pyramid');
const Chronics = require('./models/chronic');
const Activity = require('./models/activity');
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
app.get(rootPart + '/pyramid', cors(corsOptions), cache('6 hour'), (req, res) => {
    const personDao = new FFC("person"); // สร้างตัวเข้าถึงฐานข้อมูล ffc ที่ person
    const query = [
        {
            "$match": {
                "$and": [
                    {
                        "death.date": {
                            "$exists": false
                        }
                    }
                ]
            }
        },
        {
            "$project": {
                "birthDate": 1,
                "sex": 1
            }
        }
    ];
    personDao.aggregateToArray(query, (result) => { // ค้นหาแบบ toArray โดยจะได้ result ออกมาเลย
        const prePerson = new Pyramid(result); // ตัวตัวเข้าถึง function perPersonData
        res.json(prePerson.perPersonData()); // เรียกใช้งาน
    });
});

// chronic
app.get(rootPart + '/chronic', cors(corsOptions), cache('6 hour'), (req, res) => {
    const personDao = new FFC("person"); // สร้างตัวเข้าถึงฐานข้อมูล ffc ที่ person
    const query = [
        {
            "$match": {
                "$and": [
                    {"chronics.disease.icd10": {"$exists": true}},
                    {"death.date": {"$exists": false}}
                ]
            }
        },
        {
            "$project": {
                "chronics": 1,
            }
        }
    ];
    personDao.aggregateToArray(query, (result) => { // ค้นหาแบบ toArray โดยจะได้ result ออกมาเลย
        const chronics = new Chronics(result); // ตัวตัวเข้าถึง function perPersonData
        res.json(chronics.topChronic(-1)); // เรียกใช้งาน
    });
});

app.get(rootPart + '/chronic/:orgId', cors(corsOptions), cache('6 hour'), (req, res) => {
    console.log(req.originalUrl, "Url");
    const personDao = new FFC("person"); // สร้างตัวเข้าถึงฐานข้อมูล ffc ที่ person
    const orgId = req.params.orgId;
    const query = [
        {
            "$match": {
                "$and": [
                    {"chronics.disease.icd10": {"$exists": true}},
                    {"death.date": {"$exists": false}},
                    {"orgIndex": ObjectID(orgId)}
                ]
            }
        },
        {
            "$project": {
                "chronics": 1,
            }
        }
    ];
    personDao.aggregateToArray(query, (result) => { // ค้นหาแบบ toArray โดยจะได้ result ออกมาเลย
        const chronics = new Chronics(result); // ตัวตัวเข้าถึง function perPersonData
        res.json(chronics.topChronic(-1)); // เรียกใช้งาน
    });
});

// idorg
app.get(rootPart + '/pyramid/:orgId', cors(corsOptions), cache('6 hour'), (req, res) => {
    const orgId = req.params.orgId;
    console.log(orgId, 'perPersonData');
    const personDao = new FFC("person");

    const query = [
        {
            "$match": {
                "$and": [
                    {
                        "death.date": {
                            "$exists": false
                        }
                    },
                    {
                        "orgIndex": ObjectID(orgId)
                    }
                ]
            }
        },
        {
            "$project": {
                "birthDate": 1,
                "sex": 1
            }
        }
    ];
    personDao.aggregateToArray(query, (result) => {
        const prePerson = new Pyramid(result);
        res.json(prePerson.perPersonData());
    });
});

// ชื่อหน่วยงาน
<<<<<<< HEAD
const ignoreOrg = ["5db0973f698922acf8b802fa", "5dbbc89c698922acf8bc5789", "5cad8abd698922aa8a93b4e9", "5d8b252b698922acf8ac1897", "5cfdc5d5698922acf89a92e8", "5d1c2679698922acf8a0070c", "5d4ebdba698922acf8a45770", "5d5e7a4b698922acf8a6b72d", "5d801307698922acf8ab37c0", "5d8b2523698922acf8ac17cb", "5d8b2b53698922acf8ac35b7", "5daea3eb698922acf8b6a799", "5c98b5ec698922768b67f336", "5d034a2c698922acf89cffdc", "5d59fc53698922acf8a69769"];
=======
const ignoreOrg = ["5dbbc89c698922acf8bc5789"];
>>>>>>> 233ad45e00f4f8c514dcaaf60144a124bb57ce36
app.get(rootPart + '/convert', cors(corsOptions), cache('6 hour'), (req, res) => {
    const orgDao = new FFC("organ");

    orgDao.findToArray({}, (result) => {
        const data = result.filter((item) => {
            return ignoreOrg.indexOf(item.id) < 0;
        }).map((item) => {
            return {
                name: item.displayName,
                label: item.displayName,
                id: item.id
            }
        });
        res.json(data);
        // console.log(data, '======');
    });
});

// อัตราส่วนผู้สูงอายุ
app.get(rootPart + '/elderlyrat', cors(corsOptions), cache('6 hour'), (req, res) => {
    const personDao = new FFC("person");
    const haveActivitiesQuery = [
        {
            "$match": {
                "$and": [
                    {"death.date": {"$exists": false}},
                    {"healthAnalyze.result.ACTIVITIES": {"$exists": true}}
                ]
            }
        },
        {
            "$project": {
                "birthDate": 1,
                "healthAnalyze": 1
            }
        }
    ];
    personDao.aggregateToArray(haveActivitiesQuery, (persons) => {
        const activity = new Activity(persons);
        res.json(activity.activity());
    });
});

app.get(rootPart + '/elderlyrat/:orgId', cors(corsOptions), cache('6 hour'), (req, res) => {
    const orgId = req.params.orgId;
    console.log(orgId, 'perPersonData');

    const personDao = new FFC("person");
    const haveActivitiesQuery = [
        {
            "$match": {
                "$and": [
                    {"death.date": {"$exists": false}},
                    {"healthAnalyze.result.ACTIVITIES": {"$exists": true}},
                    {"orgIndex": ObjectID(orgId)}
                ]
            }
        },
        {
            "$project": {
                "birthDate": 1,
                "healthAnalyze": 1
            }
        }
    ];
    personDao.aggregateToArray(haveActivitiesQuery, (persons) => {
        const activity = new Activity(persons);
        res.json(activity.activity());
    });
});

app.listen(7000, () => {
    console.log('Application is running on port 7000')
});

