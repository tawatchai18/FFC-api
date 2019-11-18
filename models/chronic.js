Chronics = function (persons) {
    this.persons = persons;
};

Chronics.prototype.persons = {};

Chronics.prototype.topChronic = function (top) {
    let listCount = [];
    let nameIcd10 = [];
    this.persons.forEach((person) => {
        person.chronics.forEach((chronic) => {
            const icd10 = chronic.disease.icd10;
            var find = listCount.find(value => value.name === icd10);

            if (find === undefined) {
                find = {
                    name: icd10,
                    sum: 0
                };
                listCount.push(find);
                nameIcd10[icd10] = chronic.disease.translation.th;
            }
            find.sum++;
        })
    });

    const output = {
        other: 0,
        total: 0,
        byIcd10: []
    };

    listCount.sort((a, b) => b.sum - a.sum).forEach((value, index) => {
        if (index < 5) {
            output.byIcd10.push(
                {
                    name: nameIcd10[value.name],
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
