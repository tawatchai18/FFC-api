const Pyramid = function (result) {
    this.result = result;
};

Pyramid.prototype.result = {};

Pyramid.prototype.perPersonData = function () {

    const data = [
        {
            0: "0-9",
            "male": 0,
            "female": 0,
            "total": 0
        },
        {
            1: "10-19",
            "male": 0,
            "female": 0,
            "total": 0
        },
        {
            2: "20-29",
            "male": 0,
            "female": 0,
            "total": 0
        },
        {
            3: "30-39",
            "male": 0,
            "female": 0,
            "total": 0
        },
        {
            4: "40-49",
            "male": 0,
            "female": 0,
            "total": 0
        },
        {
            5: "50-59",
            "male": 0,
            "female": 0,
            "total": 0
        },
        {
            6: "60-69",
            "male": 0,
            "female": 0,
            "total": 0
        },
        {
            7: "70-79",
            "male": 0,
            "female": 0,
            "total": 0
        },
        {
            8: "80-89",
            "male": 0,
            "female": 0,
            "total": 0
        },
        {
            9: "90-99",
            "male": 0,
            "female": 0,
            "total": 0
        },
        {
            10: "100",
            "male": 0,
            "female": 0,
            "total": 0
        }
    ];

    const moment = require('moment');
    var countNotAge = 0;
    var countNotSex = 0;
    var total = 0;
    var date = new Date();
    const monentFun = moment();
    this.result.forEach((person) => {
        total++;
        var years = monentFun.diff(person.birthDate, 'years', false);

        if (person.sex === 'UNKNOWN' || person.sex === undefined)
            countNotSex++;
        else {
            if (years >= 100)
                if (person.sex === 'MALE') {
                    data['10'].male += 1;
                } else {
                    data['10'].female += 1
                }
            else if (years > 89)
                if (person.sex === 'MALE') {
                    data['9'].male += 1;
                } else {
                    data['9'].female += 1
                }
            else if (years > 79)
                if (person.sex === 'MALE') {
                    data['8'].male += 1;
                } else {
                    data['8'].female += 1
                }
            else if (years > 69)
                if (person.sex === 'MALE') {
                    data['7'].male += 1;
                } else {
                    data['7'].female += 1
                }
            else if (years > 59)
                if (person.sex === 'MALE') {
                    data['6'].male += 1;
                } else {
                    data['6'].female += 1
                }
            else if (years > 49)
                if (person.sex === 'MALE') {
                    data['5'].male += 1;
                } else {
                    data['5'].female += 1
                }
            else if (years > 39)
                if (person.sex === 'MALE') {
                    data['4'].male += 1;
                } else {
                    data['4'].female += 1
                }
            else if (years > 29)
                if (person.sex === 'MALE') {
                    data['3'].male += 1;
                } else {
                    data['3'].female += 1
                }
            else if (years > 19)
                if (person.sex === 'MALE') {
                    data['2'].male += 1;
                } else {
                    data['2'].female += 1
                }
            else if (years > 9)
                if (person.sex === 'MALE') {
                    data['1'].male += 1;
                } else {
                    data['1'].female += 1
                }
            else if (person.birthDate !== undefined && years >= 0)
                if (person.sex === 'MALE') {
                    data['0'].male += 1;
                } else {
                    data['0'].female += 1
                }
            else
                countNotAge++;
        }
    });

    data['0'].total = data['0'].male + data['0'].female;
    data['1'].total = data['1'].male + data['1'].female;
    data['2'].total = data['2'].male + data['2'].female;
    data['3'].total = data['3'].male + data['3'].female;
    data['4'].total = data['4'].male + data['4'].female;
    data['5'].total = data['5'].male + data['5'].female;
    data['6'].total = data['6'].male + data['6'].female;
    data['7'].total = data['7'].male + data['7'].female;
    data['8'].total = data['8'].male + data['8'].female;
    data['9'].total = data['9'].male + data['9'].female;
    data['10'].total = data['10'].male + data['10'].female;

    var totalmale = 0;
    var totalfemale = 0;
    data.forEach((item) => {
        totalmale += item.male;
        totalfemale += item.female
        // countData += item.female
    });

    var dataArray = {
        "total": total,
        "male": totalmale,
        "female": totalfemale,
        "date": date,
        "undefinedSex": countNotSex,
        "undefinedAge": countNotAge,
        "byAge": [
            {
                "male": data['0'].male,
                "female": data['0'].female,
                "total": data['0'].total,
                "age": "0-9 ปี",
            },
            {
                "male": data['1'].male,
                "female": data['1'].female,
                "total": data['1'].total,
                "age": "10-19 ปี",
            },
            {
                "male": data['2'].male,
                "female": data['2'].female,
                "total": data['2'].total,
                "age": "20-29 ปี",
            },
            {
                "male": data['3'].male,
                "female": data['3'].female,
                "total": data['3'].total,
                "age": "30-39 ปี",
            },
            {
                "male": data['4'].male,
                "female": data['4'].female,
                "total": data['4'].total,
                "age": "40-49 ปี",
            },
            {
                "male": data['5'].male,
                "female": data['5'].female,
                "total": data['5'].total,
                "age": "50-59 ปี",
            },
            {
                "male": data['6'].male,
                "female": data['6'].female,
                "total": data['6'].total,
                "age": "60-69 ปี",
            },
            {
                "male": data['7'].male,
                "female": data['7'].female,
                "total": data['7'].total,
                "age": "70-79 ปี",
            },
            {
                "male": data['8'].male,
                "female": data['8'].female,
                "total": data['8'].total,
                "age": "80-89 ปี",
            },
            {
                "male": data['9'].male,
                "female": data['9'].female,
                "total": data['9'].total,
                "age": "90-99 ปี",
            },
            {
                "male": data['10'].male,
                "female": data['10'].female,
                "total": data['10'].total,
                "age": "100 ปีขึ้นไป",
            }
        ]
    };

    return dataArray;
};

module.exports = Pyramid;
