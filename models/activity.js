const Activity = function (persons) {
    this.persons = persons;
};

Activity.prototype.persons = {};

Activity.prototype.activity = function () {
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
    const moment = require('moment');
    this.persons.forEach((item) => {
        if (item.healthAnalyze.result !== undefined) {
            const years = moment().diff(item.birthDate, 'years', false);
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

    return {
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
};

module.exports = Activity;
