const { format } = require("date-fns");
const moment = require("moment");


class ManageDate {
    constructor() {
        this.date = "DD/MM/YYYY";
        this.datetime = "DD/MM/YYYY HH:mm:ss";
        this.datetimeDB = "yyyy-MM-dd HH:mm:ss";
    }

    generateDate() {
        return format(new Date(), this.datetimeDB);
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