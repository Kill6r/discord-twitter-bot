const { readdirSync } = require("fs");
const ascii = require("ascii-table");
let table = new ascii("Comandos");
table.setHeading("Comando", "Estado");
module.exports = (client, config) => {
  try{
    readdirSync("./comandos/").forEach((dir) => {
        const commands = readdirSync(`./comandos/${dir}/`).filter((file) => file.endsWith(".js"));
        for (let file of commands) {
            let pull = require(`../comandos/${dir}/${file}`);
            if (pull.name) {
                client.comandos.set(pull.name, pull);
                client.Commands.push(pull.name);
                table.addRow(file, "✅");
            } else {
                table.addRow(file, `❌ -> help.name`);
                continue;
            }
        }
    });
/*     console.log(table.toString().cyan); */
  }catch (e){
    /* console.log(String(e.stack).bgRed) */
  }
};