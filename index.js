const express = require('express');
const app = express();
var apicache = require('apicache');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/ffc";
let cache = apicache.middleware

// const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}

// ตารางปิรามิดประชากร
app.get('/pyramid', cors(corsOptions), cache('12 hour'), (req, res) => {
    // const orgId = req.params.orgId;
    // console.log(orgId, 'perPersonData');
    MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        if (err) throw err;
        var dbo = db.db('ffc');
        var query = {};
        dbo.collection("person").find(query).toArray((err, result) => {
            if (err) throw err;
            if (!Array.isArray) {
                Array.isArray = function (arg) {
                    return Object.prototype.toString.call(arg) === '[object Array]';
                };
            }
            res.json(perPersonData(result));
        });
    });
});

// idorg
app.get('/pyramid/:orgId', cors(corsOptions), cache('12 hour'), (req, res) => {
    const orgId = req.params.orgId;
    console.log(orgId, 'perPersonData');
    MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
        if (err) throw err;
        var dbo = db.db('ffc');
        var query = { "orgId": orgId };
        dbo.collection("person").find(query).toArray((err, result) => {
            if (err) throw err;
            if (!Array.isArray) {
                Array.isArray = function (arg) {
                    return Object.prototype.toString.call(arg) === '[object Array]';
                };
            }
            res.json(perPersonData(result));
        });
    });
});

// ชื่อหน่วยงาน
app.get('/convert', cors(corsOptions), cache('12 hour'), (req, res) => {
    MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
        if (err) throw err;
        // var data;
        var dbo = db.db('ffc');
        var query = {};
        var data = []
        dbo.collection("organ").find(query).toArray((err, result) => {
            if (err) throw err;
            if (!Array.isArray) {
                Array.isArray = function (arg) {
                    return Object.prototype.toString.call(arg) === '[object Array]';
                };
            }
            result.forEach((item) => {
                data.push({
                    name: item.displayName,
                    id: item.id
                })
            })
            res.json(data);
            console.log(data, '======');
        });
    });
});

// อัตราส่วนผู้สูงอายุ
app.get('/elderlyrat', cors(corsOptions), (req, res) => {
    MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
        if (err) throw err;
        var dbo = db.db('ffc');
        var query = { "healthAnalyze.result.ACTIVITIES.severity": "MID", }
        var query1 = { "healthAnalyze.result.ACTIVITIES.severity": "OK", }
        var query2 = { "healthAnalyze.result.ACTIVITIES.severity": "VERY_HI", }
        // var query = {}
        var data = [
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
                2: "othor",
                "null": 0
            }
        ]
        dbo.collection("person").find(query, query1, query2).toArray((err, arr) => {
            if (err) throw err;
            if (!Array.isArray) {
                Array.isArray = function (arg) {
                    return Object.prototype.toString.call(arg) === '[object Array]';
                };
            }
            arr.forEach((item) => {
                if (item.healthAnalyze.result.ACTIVITIES.severity === 'MID') {
                    data['0'].mid += 1;
                }
                else if (item.healthAnalyze.result.ACTIVITIES.severity === 'OK') {
                    data['1'].ok += 1;
                }
                else if (item.healthAnalyze.result.ACTIVITIES.severity === 'VERY_HI') {
                    data['2'].veryhi += 1;
                }
                else if (item.healthAnalyze.result.ACTIVITIES.severity === 'null') {
                    data['3'].null += 1;
                }
            })
            var dataArray = [
                {
                    "ติดบ้าน": data['0'].mid
                },
                {
                    "ติดสังคม": data['1'].ok
                },
                {
                    "ติดเตียง": data['2'].veryhi
                },
                {
                    "ไม่ระบุ": data['3'].null
                }
            ]
            res.json(dataArray)
            console.log(dataArray, 'you ploblem');

        });
    });
});

app.listen(7000, () => {
    console.log('Application is running on port 7000')
})

// function Princes(result) {
//     const data = [
//         {
//             0: "MID",
//             "mid": 0
//         },
//         {
//             1: "OK",
//             "ok": 0
//         },
//         {
//             2: "VERY_HI",
//             "veryhi": 0
//         }
//     ]

//     result.forEach((item) => {
//         if (item.healthAnalyze.result.ACTIVITIES.severity === 'MID') {
//             data['0'].mid += 1;
//         }
//         else if (item.healthAnalyze.result.ACTIVITIES.severity === 'OK') {
//             data['1'].ok += 1;
//         }
//         else if (item.sex === 'VERY_HI') {
//             data['2'].veryhi += 1;
//         }
//     })
//     var dataArray = [
//         {
//             "mid": data['0'].mid
//         },
//         {
//             "ok": data['1'].ok
//         },
//         {
//             "very_hi": data['2'].veryhi
//         }
//     ]
//     return dataArray
// }

function perPersonData(result) {
    const data = [
        {
            0: "1-10",
            "male": 0,
            "female": 0,
            "total":0,
            "undefined": 0
        },
        {
            1: "11-20",
            "male": 0,
            "female": 0,
            "total":0,
            "undefined": 0
        },
        {
            2: "21-30",
            "male": 0,
            "female": 0,
            "total":0,
            "undefined": 0
        },
        {
            3: "31-40",
            "male": 0,
            "female": 0,
            "total":0,
            "undefined": 0
        },
        {
            4: "41-50",
            "male": 0,
            "female": 0,
            "total":0,
            "undefined": 0
        },
        {
            5: "51-60",
            "male": 0,
            "female": 0,
            "total":0,
            "undefined": 0
        },
        {
            6: "61-70",
            "male": 0,
            "female": 0,
            "total":0,
            "undefined": 0
        },
        {
            7: "71-80",
            "male": 0,
            "female": 0,
            "total":0,
            "undefined": 0
        },
        {
            8: "81-90",
            "male": 0,
            "female": 0,
            "total":0,
            "undefined": 0
        },
        {
            9: "91-100",
            "male": 0,
            "female": 0,
            "total":0,
            "undefined": 0
        }
    ]

    var moment = require('moment');
    let countElse = 0
    let countResult = 0
    result.forEach((item) => {
        countResult++
        var years = moment().diff(item.birthDate, 'years', false);
        if (years >= 1 && years <= 10) {
            if (item.sex === 'MALE') {
                data['0'].male += 1
                data['0'].total++
            }
            else {
                data['0'].female += 1
                data['0'].undefined++  
            }
        }
        else if (years <= 20) {
            if (item.sex === 'MALE') {
                data['1'].male += 1;
                data['1'].total++
            }
            else {
                data['1'].female += 1
                data['1'].undefined++
            }
        }
        else if (years <= 30) {
            if (item.sex === 'MALE') {
                data['2'].male += 1;
                data['2'].total++
            }
            else {
                data['2'].female += 1
                data['2'].undefined++
            }
        }
        else if (years <= 40) {
            if (item.sex === 'MALE') {
                data['3'].male += 1;
                data['3'].total++
            }
            else {
                data['3'].female += 1
                data['3'].undefined++
            }
        }
        else if (years <= 50) {
            if (item.sex === 'MALE') {
                data['4'].male += 1;
                data['4'].total++
            }
            else {
                data['4'].female += 1
                data['4'].undefined++
            }
        }
        else if (years <= 60) {
            if (item.sex === 'MALE') {
                data['5'].male += 1;
                data['5'].total++
            }
            else {
                data['5'].female += 1
                data['5'].undefined++
            }
        }
        else if (years <= 70) {
            if (item.sex === 'MALE') {
                data['6'].male += 1;
                data['6'].total++
            }
            else {
                data['6'].female += 1
                data['6'].undefined++
            }
        }
        else if (years <= 80) {
            if (item.sex === 'MALE') {
                data['7'].male += 1;
                data['7'].total++
            }
            else {
                data['7'].female += 1
                data['7'].undefined++
            }
        }
        else if (years <= 90) {
            if (item.sex === 'MALE') {
                data['8'].male += 1;
                data['8'].total++
            }
            else {
                data['8'].female += 1
                data['8'].undefined++
            }
        }
        else if (years <= 100) {
            if (item.sex === 'MALE') {
                data['9'].male += 1;
                data['9'].total++
            }
            else {
                data['9'].female += 1
            }
        }
        else {
            countElse++
        }
    })
    let countData = 0
    let countdataFemale = 0
    data.forEach((item) => {
        countData += item.male
        countdataFemale += item.female
        // countData += item.female
    })

    var dataArray = [
        {
            "male": data['0'].male,
            "female": data['0'].female,
            "total": data['0'].total,
            "undifined": data['0'].undefined,
            "age": "1-10 ปี",
        },
        {
            "male": data['1'].male,
            "female": data['1'].female,
            "total": data['1'].total,
            "undifined": data['1'].undefined,
            "age": "11-20 ปี",
        },
        {
            "male": data['2'].male,
            "female": data['2'].female,
            "total": data['2'].total,
            "undifined": data['2'].undefined,
            "age": "21-30 ปี",
        },
        {
            "male": data['3'].male,
            "female": data['3'].female,
            "total": data['3'].total,
            "undifined": data['3'].undefined,
            "age": "31-40 ปี",
        },
        {
            "male": data['4'].male,
            "female": data['4'].female,
            "total": data['4'].total,
            "undifined": data['4'].undefined,
            "age": "41-50 ปีี",
        },
        {
            "male": data['5'].male,
            "female": data['5'].female,
            "total": data['5'].total,
            "undifined": data['5'].undefined,
            "age": "51-60 ปี",
        },
        {
            "male": data['6'].male,
            "female": data['6'].female,
            "total": data['6'].total,
            "undifined": data['6'].undefined,
            "age": "61-70 ปี",
        },
        {
            "male": data['7'].male,
            "female": data['7'].female,
            "total": data['7'].total,
            "undifined": data['7'].undefined,
            "age": "71-80 ปี",
        },
        {
            "male": data['8'].male,
            "female": data['8'].female,
            "total": data['8'].total,
            "undifined": data['8'].undefined,
            "age": "81-90 ปี",
        },
        {
            "male": data['9'].male,
            "female": data['9'].female,
            "total": data['9'].total,
            "undifined": data['9'].undefined,
            "age": "91-100 ปีขึ้นไป",
        },
        {
            "countelse": countElse,
            "countresult": countResult,
            "countmale": countData,
            "countfemale": countdataFemale
        }
    ]
    // let countDataArrayOutput = 0
    // let countData = 0
    // let countdataFemale = 0
    let loop = 0
    dataArray.forEach((item) => {
        loop++
        // countDataArrayOutput += item.male
        // countDataArrayOutput += item.female
    })
    // data.forEach((item) => {
    //     countData += item.male
    //     countdataFemale += item.female
    //     // countData += item.female
    // })
    console.log(loop, "Loop count");
    //ข้อมูลทั้งหมด
    console.log(result.length, 'Length result');
    console.log(countResult, 'Count result');
    console.log(countData, "ชาย", countdataFemale, "ผู้หญิง");
    console.log(countData + countdataFemale, "ชายบวกหญิง");
    console.log(countData + countdataFemale + countElse, "บวกทั้งหมด");
    //ไม่ระบุเพศ
    console.log(countElse, " Count else");

    return dataArray;
}