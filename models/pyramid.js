const Pyramid = function (result) {
    this.result = result;
};

Pyramid.prototype.result = {};

Pyramid.prototype.perPersonData = function () {

    console.log("create new date");
    const data = [
        {
            0: "1-10",
            "male": 0,
            "female": 0,
            "total": 0
        },
        {
            1: "11-20",
            "male": 0,
            "female": 0,
            "total": 0
        },
        {
            2: "21-30",
            "male": 0,
            "female": 0,
            "total": 0
        },
        {
            3: "31-40",
            "male": 0,
            "female": 0,
            "total": 0
        },
        {
            4: "41-50",
            "male": 0,
            "female": 0,
            "total": 0
        },
        {
            5: "51-60",
            "male": 0,
            "female": 0,
            "total": 0
        },
        {
            6: "61-70",
            "male": 0,
            "female": 0,
            "total": 0
        },
        {
            7: "71-80",
            "male": 0,
            "female": 0,
            "total": 0
        },
        {
            8: "81-90",
            "male": 0,
            "female": 0,
            "total": 0
        },
        {
            9: "91-100",
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
            if (years > 100)
                if (person.sex === 'MALE') {
                    data['10'].male += 1;
                } else {
                    data['10'].female += 1
                }
            else if (years >= 90)
                if (person.sex === 'MALE') {
                    data['9'].male += 1;
                } else {
                    data['9'].female += 1
                }
            else if (years >= 80)
                if (person.sex === 'MALE') {
                    data['8'].male += 1;
                } else {
                    data['8'].female += 1
                }
            else if (years >= 70)
                if (person.sex === 'MALE') {
                    data['7'].male += 1;
                } else {
                    data['7'].female += 1
                }
            else if (years >= 60)
                if (person.sex === 'MALE') {
                    data['6'].male += 1;
                } else {
                    data['6'].female += 1
                }
            else if (years >= 50)
                if (person.sex === 'MALE') {
                    data['5'].male += 1;
                } else {
                    data['5'].female += 1
                }
            else if (years >= 40)
                if (person.sex === 'MALE') {
                    data['4'].male += 1;
                } else {
                    data['4'].female += 1
                }
            else if (years >= 30)
                if (person.sex === 'MALE') {
                    data['3'].male += 1;
                } else {
                    data['3'].female += 1
                }
            else if (years >= 20)
                if (person.sex === 'MALE') {
                    data['2'].male += 1;
                } else {
                    data['2'].female += 1
                }
            else if (years >= 10)
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
                "age": "0-10 ปี",
            },
            {
                "male": data['1'].male,
                "female": data['1'].female,
                "total": data['1'].total,
                "age": "11-20 ปี",
            },
            {
                "male": data['2'].male,
                "female": data['2'].female,
                "total": data['2'].total,
                "age": "21-30 ปี",
            },
            {
                "male": data['3'].male,
                "female": data['3'].female,
                "total": data['3'].total,
                "age": "31-40 ปี",
            },
            {
                "male": data['4'].male,
                "female": data['4'].female,
                "total": data['4'].total,
<<<<<<< HEAD
<<<<<<< HEAD
                "age": "41-50 ปี",
=======
                "age": "41-50 ปี",
>>>>>>> 10c6f9a3befa3ee293e95a7a501b2b80c2f77bda
=======
                "age": "41-50 ปี",
>>>>>>> 233ad45e00f4f8c514dcaaf60144a124bb57ce36
            },
            {
                "male": data['5'].male,
                "female": data['5'].female,
                "total": data['5'].total,
                "age": "51-60 ปี",
            },
            {
                "male": data['6'].male,
                "female": data['6'].female,
                "total": data['6'].total,
                "age": "61-70 ปี",
            },
            {
                "male": data['7'].male,
                "female": data['7'].female,
                "total": data['7'].total,
                "age": "71-80 ปี",
            },
            {
                "male": data['8'].male,
                "female": data['8'].female,
                "total": data['8'].total,
                "age": "81-90 ปี",
            },
            {
                "male": data['9'].male,
                "female": data['9'].female,
                "total": data['8'].total,
                "age": "91-100 ปี",
            },
            {
                "male": data['10'].male,
                "female": data['10'].female,
                "total": data['10'].total,
                "age": "101 ปีขึ้นไป",
            }
        ]
    };
    /*console.log(this.result.length, 'Length result');
    console.log(total, 'Count result');
    console.log(totalmale, "ชาย", totalfemale, "ผู้หญิง");
    console.log(totalmale + totalfemale, "ชายบวกหญิง");
    console.log(totalmale + totalfemale + countNotAge, "บวกทั้งหมด");
    //ไม่ระบุเพศ
    console.log(countNotAge, " Count else");*/

    return dataArray;
};

module.exports = Pyramid;
