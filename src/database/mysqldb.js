require("dotenv").config();
const mysql = require("mysql2/promise");


class ManageMySQL {
    constructor() {
        this.host = process.env.MYSQL_HOST;
        this.database = process.env.MYSQL_DATABASE;
        this.user = process.env.MYSQL_USER;
        this.pass = process.env.MYSQL_PASS;
        this.port = process.env.MYSQL_PORT;
    }

    async getConnection() {
        this.connection = await mysql.createConnection(
            `mysql://${this.user}:${this.pass}@${this.host}:${this.port}/${this.database}`
        );
    }

    async connect() {
        await this.connection.connect();
    }

    async getProcesso(processo) {
        const resultado = await this.connection.query(
            `SELECT NroProcessoDepre, Natureza, DataProtocolo, Devedora, Ano, 
            Requisitado, PrincipalBruto, Vara, Assunto, Foro, AdvogadoPrincipal 
            FROM Precatorios WHERE NroAutos = ? AND (FlgStatus != ? AND FlgStatus != ?)`,
            [processo.toString(), 3, 99]
        );

        return resultado[0][0];
    }

    async getPrecatorio(processo, precatorio) {
        const resultado = await this.connection.query(
            "SELECT NomeArquivo, Documento, TipoDocumento, DataNascimento, NumeroDepre, Ordem, Requisitado, PrincipalBruto, NomeRequisitante, dataOficio, `dataBase`, Ano, flgApagar FROM PrecatorioDocumentos WHERE PrecatorioId IN (SELECT Id FROM Precatorios WHERE NroAutos = ? AND FlgStatus != ? AND FlgStatus != ?) AND LOWER(NomeArquivo) = ?",
            [processo, 3, 99, precatorio]
        );

        return resultado[0][0];
    }

    async getPrecatorios(processo) {
        const resultado = await this.connection.query(
            `SELECT TRIM(SUBSTRING_INDEX(NomeArquivo, '-', -1)) AS Precatorio FROM PrecatorioDocumentos WHERE 
            PrecatorioId IN (SELECT Id FROM Precatorios WHERE NroAutos = ? AND FlgStatus != ? AND 
            FlgStatus != ?) AND LOWER(NomeArquivo) LIKE ? ORDER BY NomeArquivo`,
            [processo, 3, 99, "precatório%"]
        )

        return resultado[0];
    }

    async close() {
        await this.connection.end();
    }
}


module.exports = ManageMySQL;