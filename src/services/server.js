const ManagePostgreSQL = require("./src/database/postgresql");


async function main() {
    const db = new ManagePostgreSQL();
    await db.connect();
    await db.createTable();

    // await db.deleteOne("5511963262552");

    console.log(await db.selectAll());
    await db.close();
}


main();