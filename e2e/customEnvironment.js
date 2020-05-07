const Application = require('spectron').Application
const electronPath = require('electron')
const path = require('path')
const NodeEnvironment = require('jest-environment-node')

class CustomEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup()

    const appPath = this.getAppPath()

    console.log(`Application path: ${appPath}`)

    this.app = this.getApplication(appPath)
    await this.app.start()
    await this.app.client.waitUntilWindowLoaded(20000)

    this.global.restart = () => this.restart()
    this.global.client = this.app.client

    this.screenshotPath = './screenshots/'
  }

  getAppPath() {
    return process.env.APP_PATH ? process.env.APP_PATH : electronPath
  }

  getApplication(appPath) {
    return new Application({
      args: [path.join(__dirname, '..')],
      path: appPath,
    })
  }

  async teardown() {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  }

  async handleTestEvent(event, state) {
    if (event.name === 'test_fn_failure') {
      const fullTestName = this.getTestName(event.test)
      const filePath = this.screenshotPath + fullTestName + '.png';
      this.app.client.saveScreenshot(filePath);
    }
  }

  getTestName(test) {
    return `${this.cleanUpString(test.parent.name)}-${this.cleanUpString(test.name)}`
  }

  cleanUpString(stringToClean) {
    return encodeURIComponent(stringToClean.replace(/\s+/g, '-'))
  }

  async restart() {
    await this.app.restart();
    this.global.client = this.app.client
  }
}

module.exports = CustomEnvironment