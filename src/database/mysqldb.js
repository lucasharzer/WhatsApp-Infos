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
            `SELECT CASE WHEN LENGTH(NroProcessoDepre) = 0 THEN "Não informado" ELSE NroProcessoDepre END AS NroProcessoDepre, 
            CASE WHEN LENGTH(Natureza) = 0 THEN "Não informado" ELSE Natureza END AS Natureza, DataProtocolo, 
            CASE WHEN LENGTH(Devedora) = 0 THEN "Não informado" ELSE Devedora END AS Devedora, Ano, Requisitado, PrincipalBruto, 
            PrincipalLiquido, JurosMoratorio, Vara, CASE WHEN LENGTH(Assunto) = 0 THEN "Não informado" ELSE Assunto END AS Assunto, 
            CASE WHEN LENGTH(Foro) = 0 THEN "Não informado" ELSE Foro END AS Foro, CASE WHEN LENGTH(AdvogadoPrincipal) = 0 THEN "Não informado" ELSE AdvogadoPrincipal END AS AdvogadoPrincipal 
            FROM Precatorios WHERE TRIM(REPLACE(REPLACE(NroAutos, "-", ""), ".", "")) = ? AND (FlgStatus != ? AND FlgStatus != ?) ORDER BY DataUltimaAtualizacao DESC`,
            [processo.toString(), 3, 99]
        );

        return resultado[0][0];
    }

    async getPrecatorio(processo, precatorio) {
        const resultado = await this.connection.query(
            "SELECT pd.NomeArquivo, CASE WHEN LENGTH(pd.Documento) = 0 THEN 'Não informado' ELSE pd.Documento END AS Documento, CASE WHEN LENGTH(pd.TipoDocumento) = 0 THEN 'Não informado' ELSE pd.TipoDocumento END AS TipoDocumento, pd.DataNascimento, CASE WHEN LENGTH(pd.NumeroDepre) = 0 THEN 'Não informado' ELSE pd.NumeroDepre END AS NumeroDepre, CASE WHEN LENGTH(pd.Ordem) = 0 THEN 'Não informado' ELSE pd.Ordem END AS Ordem, pd.Requisitado, pd.PrincipalBruto, pd.PrincipalLiquido, pd.JurosMoratorio, CASE WHEN LENGTH(pd.NomeRequisitante) = 0 THEN 'Não informado' ELSE pd.NomeRequisitante END AS NomeRequisitante, pd.dataOficio, pd.`dataBase`, pd.Ano, pd.flgApagar, ps.Nome AS StatusApagar FROM PrecatorioDocumentos pd LEFT JOIN Precatorios p ON pd.PrecatorioId = p.Id LEFT JOIN PrecatorioDocumentosStatus ps ON pd.flgApagar = ps.CodStatus WHERE TRIM(REPLACE(REPLACE(p.NroAutos, '-', ''), '.', '')) = ? AND p.FlgStatus != ? AND p.FlgStatus != ? AND LOWER(pd.NomeArquivo) = ? ORDER BY pd.DataUltimaAtualizacao DESC",
            [processo, 3, 99, precatorio]
        );

        return resultado[0][0];
    }

    async getPrecatorios(processo) {
        const resultado = await this.connection.query(
            `SELECT TRIM(SUBSTRING_INDEX(NomeArquivo, '-', -1)) AS Precatorio FROM PrecatorioDocumentos WHERE 
            PrecatorioId IN (SELECT Id FROM Precatorios WHERE TRIM(REPLACE(REPLACE(NroAutos, "-", ""), ".", "")) = ? 
            AND FlgStatus != ? AND FlgStatus != ?) AND LOWER(NomeArquivo) LIKE ? GROUP BY NomeArquivo ORDER 
            BY NomeArquivo`,
            [processo, 3, 99, "precatório%"]
        )

        return resultado[0];
    }

    async getProcessosPrecatorios(documento) {
        const resultado = await this.connection.query(
            `SELECT DISTINCT TRIM(p.NroAutos) AS NroAutos, TRIM(LOWER(pd.NomeArquivo)) AS NomeArquivo FROM PrecatorioDocumentos pd INNER JOIN Precatorios p ON 
            pd.PrecatorioId = p.Id WHERE REPLACE(REPLACE(REPLACE(pd.Documento, ".", ""), "-", ""), "/", "") = ? AND LOWER(pd.NomeArquivo) LIKE ? 
            AND p.FlgStatus != ? AND p.FlgStatus != ? ORDER BY TRIM(p.NroAutos) ASC, TRIM(LOWER(pd.NomeArquivo)) ASC`,
            [documento, "precatório%", 3, 99]
        );

        return resultado[0];
    }

    async close() {
        await this.connection.end();
    }
}


module.exports = ManageMySQL;