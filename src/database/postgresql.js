require("dotenv").config();
const { Client } = require("pg");


class ManagePostgreSQL {
    constructor() {
        this.client = new Client({
            user: process.env.POSTGRE_USER, 
            password: process.env.POSTGRE_PASS.toString(),
            host: process.env.POSTGRE_HOST, 
            port: process.env.POSTGRE_PORT,
            database: process.env.POSTGRE_DATABASE
        });
    }

    async connect() {
        await this.client.connect();
    }

    async createTable() {
        await this.client.query(`
            CREATE TABLE IF NOT EXISTS Contatos
            (
                Nome VARCHAR(100),
                Telefone VARCHAR(50) NOT NULL,
                IdCliente VARCHAR(100) NOT NULL,
                Status VARCHAR(10),
                Grupo VARCHAR(20),
                CriadoEm TIMESTAMP,
                AlteradoEm TIMESTAMP,
                IdMensagem VARCHAR(100) NOT NULL,
                UltProcesso VARCHAR(50)
            )
        `);
    }

    async insertOne(
        nome, telefone, idcliente, status, grupo, criadoem, alteradoem, idmensagem
    ) {
        await this.client.query(
            `INSERT INTO Contatos 
            (Nome, Telefone, IdCliente, Status, Grupo, CriadoEm, AlteradoEm, 
            IdMensagem) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [nome, telefone, idcliente, status, grupo, criadoem, alteradoem, idmensagem]
        );
    }

    async updateOne(nome, status, grupo, alteradoem, idmensagem, telefone) {
        await this.client.query(
            `UPDATE Contatos SET Nome = $1, Status = $2, Grupo = $3, AlteradoEm = $4, 
            IdMensagem = $5 WHERE Telefone = $6`,
            [nome, status, grupo, alteradoem, idmensagem, telefone]
        );
    }

    async deleteOne(telefone) {
        await this.client.query(
            `DELETE FROM Contatos WHERE Telefone = $1`,
            [telefone]
        );
    }

    async updateLastProcess(ultproc, telefone) {
        await this.client.query(
            `UPDATE Contatos SET UltProcesso = $1 WHERE Telefone = $2`,
            [ultproc, telefone]
        );
    }

    async selectOne(telefone) {
        const result = await this.client.query(
            `SELECT IdCliente FROM Contatos WHERE Telefone = $1`, [telefone]
        );
        if (result.rows.length != 0) {
            return true;
        }else {
            return false;
        }
    }

    async selectAll() {
        const result = await this.client.query(`SELECT * FROM Contatos`);
        return result.rows;
    }

    async selectProcess(telefone) {
        const result = await this.client.query(
            `SELECT UltProcesso FROM Contatos WHERE Telefone = $1`, [telefone]
        );
        return result.rows[0].ultprocesso;
    }

    async close() {
        await this.client.end();
    }
}


module.exports = ManagePostgreSQL;