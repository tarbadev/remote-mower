const Application = require('spectron').Application
const electronPath = require('electron')
const path = require('path')
const NodeEnvironment = require('jest-environment-node')

class CustomEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
    this.app = null
  }
  async setup() {
    await super.setup()

    const appPath = process.env.APP_PATH ? process.env.APP_PATH : electronPath
    this.app = new Application({
      args: [path.join(__dirname, '..')],
      path: appPath,
    })
    await this.app.start()

    this.global.client = this.app.client
    this.global.appUrl = 'http://localhost:3000'
  }

  async teardown() {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  }
}

module.exports = CustomEnvironment