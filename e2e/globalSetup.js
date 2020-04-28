const Application = require('spectron').Application
const electronPath = require('electron')
const path = require('path')

module.exports = async function globalSetup() {
  this.app = new Application({
    args: [path.join(__dirname, '..')],
    path: electronPath,
  })
  return this.app.start()
}