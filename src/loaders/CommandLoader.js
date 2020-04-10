const FileUtils = require('../utils/FileUtils');

module.exports = class CommandLoader {
  constructor(client) {
    this.client = client;

    this.commands = [];
  }

  async load() {
    try {
      await this.initializeCommands();
      this.client.commands = this.commands;

      return true;
    } catch (err) {
      console.error(err);
    }
  }

  initializeCommands(dirPath = 'src/commands') {
    return FileUtils.requireDirectory(dirPath, NewCommand => {
      this.addCommand(NewCommand);
    });
  }

  addCommand(command) {
    this.commands.push(command);
  }
};
