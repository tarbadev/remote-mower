const Application = require('spectron').Application
const electronPath = require('electron')
const path = require('path')
const NodeEnvironment = require('jest-environment-node')

class CustomEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup()

    const appPath = process.env.APP_PATH ? process.env.APP_PATH : electronPath

    console.log(`Application path: ${appPath}`)

    this.app = new Application({
      args: [path.join(__dirname, '..')],
      path: appPath,
    })
    await this.app.start()

    this.global.client = this.app.client

    this.screenshotPath = './screenshots/'
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
}

module.exports = CustomEnvironment