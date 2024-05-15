const ManagePostgreSQL = require("../database/postgresql");
const ManageDate = require("./validation/date");
const express = require("express");
require("dotenv").config();


const app = express();
const port = process.env.SERVER_PORT;

app.get("/", async(req, res) => {
    try {
        // Conexão com PostgreSQL
        const date = new ManageDate();
        const db = new ManagePostgreSQL();
        await db.connect();
        await db.createTable();

        const contatos = await db.selectAll();
        console.log(contatos);
        await db.close();

        const html = `
            <html>
                <head>
                    <title>Conexões via WhatsApp</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 0;
                            background-color: #222; 
                            color: #fff;
                        }
                        
                        .container {
                            max-width: 800px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #333;
                            border-radius: 8px; 
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                        }
                        
                        h1, h3 {
                            text-align: center;
                            color: #fff; 
                            margin-top: 20px;
                        }
                        
                        table {
                            width: 96%;
                            heigth: 95%
                            border-collapse: collapse;
                            margin: 25px auto;
                        }
                        
                        table th, table td {
                            padding: 8px;
                            border: 1px solid #555; 
                        }
                        
                        table th {
                            background-color: #444;
                            color: #fff; 
                        }
                        
                        table tr:nth-child(even) {
                            background-color: #555;
                        }
                        
                        table tr:hover {
                            background-color: #666; 
                        }
                    </style>
                </head>
                <body>
                    <h1>Registro de Contatos</h1>
                    <h3>Veja as informações dos contatos que se envolveram com nosso Chatbot no WhatsApp:</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Telefone</th>
                                <th>Status</th>
                                <th>Grupo</th>
                                <th>Criado em</th>
                                <th>Alterado em</th>
                                <th>Última consulta</th>
                            </tr>
                        </thead>
                        <tbody>
                        ${contatos.map(registro => `
                            <tr>
                                <td>${registro.idcliente}</td>
                                <td>${registro.nome}</td>
                                <td>${registro.telefone.length == 13 ? registro.telefone.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, "+$1 $2 $3-$4") : registro.telefone.replace(/(\d{2})(\d{2})(\d{4})(\d{4})/, "+$1 $2 $3-$4")}</td>
                                <td>${registro.status}</td>
                                <td>${registro.grupo.length != 0 ? registro.grupo : "Nenhum"}</td>
                                <td>${date.convertDate(registro.criadoem, "data e hora")}</td>
                                <td>${date.convertDate(registro.alteradoem, "data e hora")}</td>
                                <td>${registro.ultconsulta != null ? registro.ultconsulta : "Nenhum"}</td>
                            </tr>
                        `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `;
        res.send(html);
    }catch(error) {
        console.error(error);
        res.status(500).send("Erro ao buscar contatos");
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
});
