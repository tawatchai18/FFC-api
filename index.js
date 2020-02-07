const FFC = require('./models/ffc');
const Pyramid = require('./models/pyramid');
const Pyramid60up = require('./models/pyramid60up');
const Chronics = require('./models/chronic');
const Chronicdilldown = require('./models/chronicdilldown');
const Activity = require('./models/activity');
const ObjectID = require('mongodb').ObjectID;
const rootPart = "/report";
var cron = require('node-cron');

const express = require('express');
const app = express();
const apicache = require('apicache');
const cache = apicache.middleware;

const cors = require('cors');
const whitelist = [
    'https://report.ffc.in.th',
    'http://localhost:3000'];

const corsOptions = {
    origin: function (origin, callback) {
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
cron.schedule('*/1 * * * *', () => {
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


    // ผู้สูงอายุที่ถูกประเมิน
    app.get(rootPart + '/pyramid60up', cors(corsOptions), cache('6 hour'), (req, res) => {
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
            const pyramid60up = new Pyramid60up(result); // ตัวตัวเข้าถึง function perPersonData
            res.json(pyramid60up.pyramidData()); // เรียกใช้งาน
        });
    });

    // chronic
    app.get(rootPart + '/chronic', cors(corsOptions), cache('6 hour'), (req, res) => {
        const personDao = new FFC("person"); // สร้างตัวเข้าถึงฐานข้อมูล ffc ที่ person
        const query = [
            {
                "$match": {
                    "$and": [
                        { "chronics.disease.icd10": { "$exists": true } },
                        { "death.date": { "$exists": false } }
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

    app.get(rootPart + '/chronicdilldown', cors(corsOptions), cache('6 hour'), (req, res) => {
        const personDao = new FFC("person"); // สร้างตัวเข้าถึงฐานข้อมูล ffc ที่ person
        const query = [
            {
                "$match": {
                    "$and": [
                        { "chronics.disease.icd10": { "$exists": true } },
                        { "death.date": { "$exists": false } }
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
            const chronicdilldown = new Chronicdilldown(result); // ตัวตัวเข้าถึง function perPersonData
            res.json(chronicdilldown.topChronic(-1)); // เรียกใช้งาน
        });
    });

    app.get(rootPart + '/chronicdilldown/:orgId', cors(corsOptions), cache('6 hour'), (req, res) => {
        console.log(req.originalUrl, "Url");
        const personDao = new FFC("person"); // สร้างตัวเข้าถึงฐานข้อมูล ffc ที่ person
        const orgId = req.params.orgId;
        const query = [
            {
                "$match": {
                    "$and": [
                        { "chronics.disease.icd10": { "$exists": true } },
                        { "death.date": { "$exists": false } },
                        { "orgIndex": ObjectID(orgId) }
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
            const chronicdilldown = new Chronicdilldown(result); // ตัวตัวเข้าถึง function perPersonData
            res.json(chronicdilldown.topChronic(-1)); // เรียกใช้งาน
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
                        { "chronics.disease.icd10": { "$exists": true } },
                        { "death.date": { "$exists": false } },
                        { "orgIndex": ObjectID(orgId) }
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

    // igorg ผู้สูงอายุที่ถูกประเมิน
    app.get(rootPart + '/pyramid60up/:orgId', cors(corsOptions), cache('6 hour'), (req, res) => {
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
            const pyramid60up = new Pyramid60up(result);
            res.json(pyramid60up.pyramidData());
        });
    });

    // ชื่อหน่วยงาน
    const ignoreOrg = [];
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
                        { "death.date": { "$exists": false } },
                        { "healthAnalyze.result.ACTIVITIES": { "$exists": true } }
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
                        { "death.date": { "$exists": false } },
                        { "healthAnalyze.result.ACTIVITIES": { "$exists": true } },
                        { "orgIndex": ObjectID(orgId) }
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

});

app.listen(7000, () => {
    console.log('Application is running on port 7000')
});

