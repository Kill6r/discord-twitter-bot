const fs = require("fs");
const ascii = require("ascii-table");
let table = new ascii("Eventos");
table.setHeading("Evento", "Estado");
const allevents = [];
module.exports = async (client, config) => {
  const load_dir = (dir) => {
    const event_files = fs.readdirSync(`./eventos/${dir}`).filter((file) => file.endsWith(".js"));
    for (const file of event_files) {
      const event = require(`../eventos/${dir}/${file}`)
      let eventName = file.split(".")[0];
      allevents.push(event.name);
      client.Events.push(event.name)
      client.on(event.name, (...args) => event.run(client, config, ...args));
    }
  }
  await ["client", "guild"].forEach(e => load_dir(e));
};