const { format } = require("date-fns");
const moment = require("moment");


class ManageDate {
    constructor() {
        this.date = "DD/MM/YYYY";
        this.datetime = `${this.date} HH:mm:ss`;
    }

    generateDate() {
        return format(new Date(), this.datetime);
    }

    convertDate(data, opcao) {
        let formato;
        if (opcao == "data e hora") {
            formato = this.datetime;
        } else {
            formato = this.date;
        }

        return moment(data).format(formato);
    }
}


module.exports = ManageDate;