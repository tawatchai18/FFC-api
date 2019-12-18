const Chronicdilldown = function (persons) {
    this.persons = persons;
};

Chronicdilldown.prototype.persons = {};

/**
 * นับจำนวนคนที่เป็นโรคเรื้อรัง โดยคน 1 คนอาจเป็นหลายโรคก็ได้
 * เช่น เป็นทั้ง เบาหวาน และ ความดัน ผลจะแสดงออกมาว่า เบาหวาน:1 ความดัน:1
 * @param top หากระบุ -1 คือทั้งหมด, หากระบุจำนวนเต็มเอาเฉพาะอันดับที่มากที่สุด
 * @returns {{other: number, total: number, GroupbyIcd10: [], group:[], test:[] }}
 */
Chronicdilldown.prototype.topChronic = function (top) {
    var personCount = [];
    var nameIcd10 = [];
    this.persons.forEach((person) => {

        var groupChronicByIcd10 = [];
        person.chronics.forEach((chronic) => { // group by icd10
            var find = groupChronicByIcd10.find(value => value.disease.icd10 === chronic.disease.icd10);
            if (find === undefined) {
                groupChronicByIcd10.push(chronic)
            }
        });

        groupChronicByIcd10.forEach((chronic) => {
            const icd10 = chronic.disease.icd10;
            var findPersonCount = personCount.find(value => value.name === icd10);

            if (findPersonCount === undefined) { // ตรวจสอบว่าใน personCount มีการประกาศโรคไว้หรือยัง
                findPersonCount = {
                    name: icd10,
                    sum: 0
                };
                personCount.push(findPersonCount);
                nameIcd10[icd10] = chronic.disease.translation.th;
            }
            findPersonCount.sum++;
        })
    });

    const output = {
        group: [],
        drilldown: [],
    };
    var data = []
    let _ = require('lodash');
    personCount.forEach((item) => {
        data.push({
            name: item.name.substr(0, 3),
            id: item.name.substr(0, 3),
            down: [
                [
                    nameIcd10[item.name] + " (" + item.name + ")",
                    item.sum
                ]
            ]
        })
    })
    output.drilldown = _.groupBy(data, function (item) {
        return item.id;
    });

    let pp = Object.keys(output["drilldown"])
    let outputArr = []
    pp.forEach(function (t) {
        let arr1 = []
        output.drilldown[t].map((el) => {
            arr1.push(el["down"][0]);
        })
        console.log(arr1, 'oikjuh');

        outputArr.push({
            name: String(t),
            id: String(t),
            down: arr1
        })
    })


    var data2 = []
    personCount.forEach((item) => {
        data2.push({
            name: nameIcd10[item.name],
            id: item.name,
            y: item.sum,
            map: item.name.substr(0, 3)
        })
    })

    output.group = _.groupBy(data2, function (item) {
        return item.map;
    });
    // console.log(output.group, 'GroupGrap');

    let dd = Object.keys(output["group"])
    // console.log(dd, 'poikjhg');

    let outputChro = []
    dd.forEach(function (e) {
        let arr2 = []
        let sum = []
        output.group[e].map((el) => {
            arr2.push(el.y)
        })
        sum = arr2.reduce((result, number) => result + number);
        outputChro.push({
            name: String(e),
            y: sum,
            drilldown: String(e),
        })
    })

    output.drilldown = outputArr
    output.group = outputChro

    return output;
};

module.exports = Chronicdilldown;


