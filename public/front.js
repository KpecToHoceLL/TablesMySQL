let data = [];

async function updateLS() {
    let response = await fetch('/create', {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify(data)

    });
}

const chMonthNext = () => {
    chosenDate.setMonth(chosenDate.getMonth() + 1);
    loadTables();
};
const chMonthPrew = () => {
    chosenDate.setMonth(chosenDate.getMonth() - 1);
    loadTables();
};
const monthNames = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
];
const loadTables = async function () {
    let year = chosenDate.getFullYear();
    let month = chosenDate.getMonth();
    let chosenMonth;
    async function loadData() {
        let url = `/${year}/${month}`
        let response = await fetch(url, {
            method: "GET",
            headers: { "Accept": "application/json" }
        });
        let loadedData = await response.json();
        return loadedData;
    }
    data = await loadData();
    let sumObj = {
        sumAll: +0,
        sumFood: +0,
        sumLife: +0,
        sumEntert: +0,
    };
    async function addBuy() {
        let newBuy = {
            year: year,
            month:month,
            date:dateInput.value,
            name:buyInput.value,
            cost:sumInput.value,
            type:targetInput.value};
        console.log(newBuy);
        let response = await fetch('/updateMonth', {
            method: 'POST',
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify(newBuy)
        });
        await loadTables();
    };
    const deleteBuy = function (key) {
        delete data[year][month][key];
        updateLS();
        loadTables();
    };
    document.body.innerHTML = "";
    let h1 = document.createElement("h1");
    document.body.appendChild(h1);
    let buttonMoPr = document.createElement("input");
    buttonMoPr.value = "\u{23EA}";
    buttonMoPr.type = "button";
    buttonMoPr.addEventListener("click", chMonthPrew);
    h1.appendChild(buttonMoPr);
    let monthName = document.createTextNode(monthNames[month]);
    h1.appendChild(monthName);
    let buttonMoNe = document.createElement("input");
    buttonMoNe.value = "\u{23E9}";
    buttonMoNe.type = "button";
    buttonMoNe.addEventListener("click", chMonthNext);
    h1.appendChild(buttonMoNe);
    {
        let firstTable = document.createElement("table");
        firstTable.id = "firstTable";
        document.body.appendChild(firstTable);
        let tr = document.createElement("tr");
        firstTable.appendChild(tr);
        ["Дата", "Покупка", "Сумма", "Назначение"].forEach(function (item) {
            let th = document.createElement("th");
            th.innerHTML = item;
            tr.appendChild(th);
        });
    }
    {
        let secondTable = document.createElement("table");
        secondTable.id = "secondTable";
        document.body.appendChild(secondTable);
        let tr = document.createElement("tr");
        secondTable.appendChild(tr);
        ["Всего", "Продукты", "Быт", "Досуг"].forEach(function (item) {
            let th = document.createElement("th");
            th.innerHTML = item;
            tr.appendChild(th);
        });
    }
    if (data) {
        data.forEach(item => {
            let trArray = [item.date, item.name, item.cost, item.type];
            let tr = document.createElement("tr");
            firstTable.appendChild(tr);
            trArray.forEach(function (item) {
                let td = document.createElement("td");
                td.innerHTML = item;
                tr.appendChild(td);
            });
            let td = document.createElement("td");
            td.id = "inputButton";
            tr.appendChild(td);
            let inputOnclick = document.createElement("input");
            inputOnclick.value = "\u{274C}";
            inputOnclick.type = "button";
            inputOnclick.addEventListener("click", () => deleteBuy(key));
            td.appendChild(inputOnclick);
            switch (trArray[3]) {
                case "Еда":
                    sumObj.sumFood += trArray[2];
                    break;
                case "Быт":
                    sumObj.sumLife += trArray[2];
                    break;
                case "Развлечения":
                    sumObj.sumEntert += trArray[2];
                    break;
                default:
                    break;
            }
            sumObj.sumAll += trArray[2];
        });
    };
    let tr = document.createElement("tr");
    firstTable.appendChild(tr);
    ["date", "buy", "sum"].forEach(function (item) {
        let th = document.createElement("th");
        tr.appendChild(th);
        let input = document.createElement("input");
        input.id = item + "Input";
        input.type = "text";
        if (item === 'date') {
            input.value = (new Date).getDate()
        }

        th.appendChild(input);
    });
    let thTargetInput = document.createElement("th");
    tr.appendChild(thTargetInput);
    let targetInput = document.createElement("select");
    targetInput.id = "targetInput";
    targetInput.type = "text";
    thTargetInput.appendChild(targetInput);
    ["Еда", "Быт", "Развлечения"].forEach(function (item) {
        let option = document.createElement("option");
        option.value = item;
        option.innerHTML = item;
        targetInput.appendChild(option);
    });
    let buttonAddBuy = document.createElement("input");
    buttonAddBuy.value = "\u{2705}";
    buttonAddBuy.type = "button";
    buttonAddBuy.addEventListener("click", addBuy);
    tr.appendChild(buttonAddBuy);
    {
        let tr = document.createElement("tr");
        secondTable.appendChild(tr);
        Object.keys(sumObj).forEach((key) => {
            let th = document.createElement("th");
            th.innerHTML = sumObj[key];
            tr.appendChild(th);
        });
    }
};

let chosenDate = new Date();
loadTables();
