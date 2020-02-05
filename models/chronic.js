const Chronics = function (persons) {
    this.persons = persons;
};

Chronics.prototype.persons = {};

/**
 * นับจำนวนคนที่เป็นโรคเรื้อรัง โดยคน 1 คนอาจเป็นหลายโรคก็ได้
 * เช่น เป็นทั้ง เบาหวาน และ ความดัน ผลจะแสดงออกมาว่า เบาหวาน:1 ความดัน:1
 * @param top หากระบุ -1 คือทั้งหมด, หากระบุจำนวนเต็มเอาเฉพาะอันดับที่มากที่สุด
 * @returns {{other: number, total: number, byIcd10: []}}
 */
Chronics.prototype.topChronic = function (top) {
    var personCount = [];
    var nameIcd10 = [];
    this.persons.forEach((person) => {

        var groupChronicByIcd10 = [];
        person.chronics.forEach((chronic) => { 
            var find = groupChronicByIcd10.find(value => value.disease.icd10 === chronic.disease.icd10);
            if (find === undefined) {
                groupChronicByIcd10.push(chronic)
            }
        });

        groupChronicByIcd10.forEach((chronic) => {
            const icd10 = chronic.disease.icd10;
            var findPersonCount = personCount.find(value => value.name === icd10);

            if (findPersonCount === undefined) { 
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
        other: 0,
        total: 0,
        byIcd10: []
    };
    
    personCount.sort((a, b) => b.sum - a.sum).forEach((value, index) => {
        if (index < top || top < 0) {
            output.byIcd10.push(
                {
                    name: nameIcd10[value.name] + " (" + value.name + ")",
                    y: value.sum
                }
            )

        } else {
            output.other += value.sum;
        }
        output.total += value.sum;
    });
    return output;
};

module.exports = Chronics;
