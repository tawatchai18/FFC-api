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
    personCount.sort((a, b) => b.sum - a.sum).forEach((item, index) => {
        if (index < top || top < 0) {
            data.push({
                name: item.name.substr(0, 3),
                id: item.name.substr(0, 3),
                down: [
                    [
                        nameIcd10[item.name] + " (" + item.name + ")",
                        item.sum
                    ]
                ],
                data: [{
                    name: nameIcd10[item.name] + " (" + item.name + ")",
                    id: item.sum
                }]
            })
        }
    })
    output.drilldown = _.groupBy(data, function (item) {
        return item.id;
    });

    let pp = Object.keys(output["drilldown"])
    console.log(pp, 'ppoopp');

    let outputArr = []
    pp.forEach(function (t) {
        let arr1 = []
        let arr2 = []
        output.drilldown[t].map((el) => {
            arr1.push(el["down"][0]);
            arr2.push(el["data"][0]);
        })

        outputArr.push({
            name: String(t),
            id: String(t),
            drilldown: arr1,
            data: arr2
        })
        console.log(arr2, 'ไก่จิกเด็กตายบนปากโอ่ง');

    })
    // pp.forEach(function (a) {
    //     let arr2 = []
    //     output.drilldown[a].map((el) => {
    //         arr2.push(el["data"][0]);
    //     })
    //     console.log(arr2,'lkjhgfd');
    // })

    var data2 = []
    personCount.sort((a, b) => b.sum - a.sum).forEach((item, index) => {
        if (index < top || top < 0) {
            data2.push({
                name: nameIcd10[item.name],
                id: item.name,
                y: item.sum,
                map: item.name.substr(0, 3)
            })
        }
    })

    output.group = _.groupBy(data2, function (item) {
        return item.map;
    });

    let dd = Object.keys(output["group"])
    let outputChro = []
    dd.forEach(function (e) {
        let arr2 = []
        let sum = []
        output.group[e].map((el) => {
            arr2.push(el.y)
        })
        sum = arr2.reduce((result, number) => result + number);
        // if (nameIcd10 === undefined ){
        if (nameIcd10[String(e)] !== undefined)
            outputChro.sort((a, b) => b.y - a.y).push({
                name: nameIcd10[String(e)] + " (" + String(e) + ")",
                // name: String(e),
                // name: nameIcd10[String(e)],
                y: sum,
                drilldown: String(e),
            })
        else
            outputChro.sort((a, b) => b.y - a.y).push({
                name: String(e),
                y: sum,
                drilldown: String(e),
            })
        // }
    })

    output.drilldown = outputArr
    output.group = outputChro

    return output;
};

module.exports = Chronicdilldown;


