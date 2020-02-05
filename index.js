const FFC = require('./models/ffc');
const Pyramid = require('./models/pyramid');
const Pyramid60up = require('./models/pyramid60up');
const Chronics = require('./models/chronic');
const Chronicdilldown = require('./models/chronicdilldown');
const Activity = require('./models/activity');
const ObjectID = require('mongodb').ObjectID;
const rootPart = "/report";

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
            callback(null, true);
        }
    },
    credentials: true
};

app.get(rootPart + '/pyramid', cors(corsOptions), cache('6 hour'), (req, res) => {
    const personDao = new FFC("person"); 
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
    personDao.aggregateToArray(query, (result) => { 
        const prePerson = new Pyramid(result); 
        res.json(prePerson.perPersonData()); 
    });
});

app.get(rootPart + '/pyramid60up', cors(corsOptions), cache('6 hour'), (req, res) => {
    const personDao = new FFC("person"); 
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
    personDao.aggregateToArray(query, (result) => { 
        const pyramid60up = new Pyramid60up(result); 
        res.json(pyramid60up.pyramidData()); 
    });
});

app.get(rootPart + '/chronic', cors(corsOptions), cache('6 hour'), (req, res) => {
    const personDao = new FFC("person"); 
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
    personDao.aggregateToArray(query, (result) => { 
        const chronics = new Chronics(result); 
        res.json(chronics.topChronic(-1)); 
    });
});

app.get(rootPart + '/chronicdilldown', cors(corsOptions), cache('6 hour'), (req, res) => {
    const personDao = new FFC("person"); 
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
    personDao.aggregateToArray(query, (result) => { 
        const chronicdilldown = new Chronicdilldown(result); 
        res.json(chronicdilldown.topChronic(-1)); 
    });
});

app.get(rootPart + '/chronicdilldown/:orgId', cors(corsOptions), cache('6 hour'), (req, res) => {
    const personDao = new FFC("person"); 
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
    personDao.aggregateToArray(query, (result) => { 
        const chronicdilldown = new Chronicdilldown(result); 
        res.json(chronicdilldown.topChronic(-1)); 
    });
});

app.get(rootPart + '/chronic/:orgId', cors(corsOptions), cache('6 hour'), (req, res) => {
    const personDao = new FFC("person"); 
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
    personDao.aggregateToArray(query, (result) => { 
        const chronics = new Chronics(result); 
        res.json(chronics.topChronic(-1)); 
    });
});

app.get(rootPart + '/pyramid/:orgId', cors(corsOptions), cache('6 hour'), (req, res) => {
    const orgId = req.params.orgId;
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

app.get(rootPart + '/pyramid60up/:orgId', cors(corsOptions), cache('6 hour'), (req, res) => {
    const orgId = req.params.orgId;
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
    });
});

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

app.listen(7000, () => {
    console.log('Application is running on port 7000')
});

