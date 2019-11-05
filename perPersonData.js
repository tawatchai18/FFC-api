function perPersonData(result){
    const data = [
        {
            0: "1-10",
            "male": 0,
            "female": 0
        },
        {
            1: "11-20",
            "male": 0,
            "female": 0
        },
        {
            2: "21-30",
            "male": 0,
            "female": 0
        },
        {
            3: "31-40",
            "male": 0,
            "female": 0
        },
        {
            4: "41-50",
            "male": 0,
            "female": 0
        },
        {
            5: "51-60",
            "male": 0,
            "female": 0
        },
        {
            6: "61-70",
            "male": 0,
            "female": 0
        },
        {
            7: "71-80",
            "male": 0,
            "female": 0
        },
        {
            8: "81-90",
            "male": 0,
            "female": 0
        },
        {
            9: "91-100",
            "male": 0,
            "female": 0
        }
    ]

    var moment = require('moment');
    result.forEach((item) => {
        var years = moment().diff(item.birthDate, 'years', false);
        if (years >= 1 && years <= 10) {
            if (item.sex === 'MALE') {
                data['0'].male += 1;
            }
            else {
                data['0'].female += 1
            }
        }
        if (years >= 11 && years <= 20) {
            if (item.sex === 'MALE') {
                data['1'].male += 1;
            }
            else {
                data['1'].female += 1
            }
        }
        if (years >= 21 && years <= 30) {
            if (item.sex === 'MALE') {
                data['2'].male += 1;
            }
            else {
                data['2'].female += 1
            }
        }
        if (years >= 31 && years <= 40) {
            if (item.sex === 'MALE') {
                data['3'].male += 1;
            }
            else {
                data['3'].female += 1
            }
        }
        if (years >= 41 && years <= 50) {
            if (item.sex === 'MALE') {
                data['4'].male += 1;
            }
            else {
                data['4'].female += 1
            }
        }
        if (years >= 51 && years <= 60) {
            if (item.sex === 'MALE') {
                data['5'].male += 1;
            }
            else {
                data['5'].female += 1
            }
        }
        if (years >= 61 && years <= 70) {
            if (item.sex === 'MALE') {
                data['6'].male += 1;
            }
            else {
                data['6'].female += 1
            }
        }
        if (years >= 71 && years <= 80) {
            if (item.sex === 'MALE') {
                data['7'].male += 1;
            }
            else {
                data['7'].female += 1
            }
        }
        if (years >= 81 && years <= 90) {
            if (item.sex === 'MALE') {
                data['8'].male += 1;
            }
            else {
                data['8'].female += 1
            }
        }
        if (years >= 91 && years <= 100) {
            if (item.sex === 'MALE') {
                data['9'].male += 1;
            }
            else {
                data['9'].female += 1
            }
        }
    })

    var dataArray = [
        {
            "male": data['0'].male,
            "female": data['0'].female,
            "age": "1-10 ปี"
        },
        {
            "male": data['1'].male,
            "female": data['1'].female,
            "age": "11-20 ปี"
        },
        {
            "male": data['2'].male,
            "female": data['2'].female,
            "age": "21-30 ปี"
        },
        {
            "male": data['3'].male,
            "female": data['3'].male,
            "age": "31-40 ปี"
        },
        {
            "male": data['4'].male,
            "female": data['4'].female,
            "age": "41-50 ปีี"
        },
        {
            "male": data['5'].male,
            "female": data['5'].female,
            "age": "51-60 ปี"
        },
        {
            "male": data['6'].male,
            "female": data['6'].female,
            "age": "61-70 ปี"
        },
        {
            "male": data['7'].male,
            "female": data['7'].female,
            "age": "71-80 ปี"
        },
        {
            "male": data['8'].male,
            "female": data['8'].female,
            "age": "81-90 ปี"
        },
        {
            "male": data['9'].male,
            "female": data['9'].female,
            "age": "91-100 ปีขึ้นไป"
        },
    ]
    return dataArray;
}