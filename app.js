// app.js

const yargs = require("yargs");
const user = require("./user");


yargs
  .command({
    command: "add",
    describe: "Add a new language to the user languages list",
    builder: {
      title: {
        describe: "Language title",
        demandOption: true,
        type: "string",
      },
      level: {
        describe: 'Language level (e.g. "Junior", "Medium", "Senior")',
        demandOption: true,
        type: "string",
      },
    },
    handler: user.addLanguage,
  })
  .command({
    command: "remove",
    describe: "Remove a language from the user languages list",
    builder: {
      title: {
        describe: "Language title",
        demandOption: true,
        type: "string",
      },
    },
    handler: user.removeLanguage,
  })
  .command({
    command: "list",
    describe: "View the user languages list",
    handler: user.viewLanguages,
  })
  .command({
    command: "read",
    describe: "View the details of a particular language",
    builder: {
      title: {
        describe: "Language title",
        demandOption: true,
        type: "string",
      },
    },
    handler: user.getLanguage,
  })
  .demandCommand(1, "Please specify a command.")
  .help().argv;
