const mysql = require("mysql2/promise");
require("dotenv").config();


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
            `SELECT NroProcessoDepre, Natureza, DataProtocolo, Devedora, Ano, Requisitado, PrincipalBruto, 
            PrincipalLiquido, JurosMoratorio, Vara, Assunto, Foro, AdvogadoPrincipal FROM Precatorios WHERE 
            REPLACE(REPLACE(NroAutos, "-", ""), ".", "") = ? AND (FlgStatus != ? AND FlgStatus != ?)`,
            [processo.toString(), 3, 99]
        );

        return resultado[0][0];
    }

    async getPrecatorio(processo, precatorio) {
        const resultado = await this.connection.query(
            "SELECT pd.NomeArquivo, pd.Documento, pd.TipoDocumento, pd.DataNascimento, pd.NumeroDepre, pd.Ordem, pd.Requisitado, pd.PrincipalBruto, pd.PrincipalLiquido, pd.JurosMoratorio, pd.NomeRequisitante, pd.dataOficio, pd.`dataBase`, pd.Ano, pd.flgApagar, ps.Nome AS StatusApagar FROM PrecatorioDocumentos pd LEFT JOIN Precatorios p ON pd.PrecatorioId = p.Id LEFT JOIN PrecatorioDocumentosStatus ps ON pd.flgApagar = ps.CodStatus WHERE REPLACE(REPLACE(p.NroAutos, '-', ''), '.', '') = ? AND p.FlgStatus != ? AND p.FlgStatus != ? AND LOWER(pd.NomeArquivo) = ?",
            [processo, 3, 99, precatorio]
        );

        return resultado[0][0];
    }

    async getPrecatorios(processo) {
        const resultado = await this.connection.query(
            `SELECT TRIM(SUBSTRING_INDEX(NomeArquivo, '-', -1)) AS Precatorio FROM PrecatorioDocumentos WHERE 
            PrecatorioId IN (SELECT Id FROM Precatorios WHERE REPLACE(REPLACE(NroAutos, "-", ""), ".", "") = ? 
            AND FlgStatus != ? AND FlgStatus != ?) AND LOWER(NomeArquivo) LIKE ? ORDER BY NomeArquivo`,
            [processo, 3, 99, "precatório%"]
        )

        return resultado[0];
    }

    async close() {
        await this.connection.end();
    }
}


module.exports = ManageMySQL;