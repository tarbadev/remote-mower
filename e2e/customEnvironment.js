const MockServer = require('mockserver-node')
const mockServerClient = require('mockserver-client').mockServerClient

const Application = require('spectron').Application
const electronPath = require('electron')
const path = require('path')
const NodeEnvironment = require('jest-environment-node')

class CustomEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup()

    await this.setupMockServers()

    this.app = this.getApplication()

    await this.app.start()
    await this.waitForClientLoaded()

    await this.app.client.setTimeout({ 'implicit': 500 })

    this.global.restart = () => this.restart()
    this.global.client = this.app.client

    this.screenshotPath = './screenshots/'
  }

  getAppPath() {
    return process.env.APP_PATH ? process.env.APP_PATH : electronPath
  }

  getApplication() {
    const appPath = this.getAppPath()

    console.log(`Application path: ${appPath}`)

    return new Application({
      args: [path.join(__dirname, '..')],
      path: appPath,
      quitTimeout: 5000,
    })
  }

  async teardown() {
    await MockServer.stop_mockserver({ serverPort: 8080 })
        .catch(err => console.error(err))

    if (this.app && this.app.isRunning()) {
      await this.app.stop()
        .catch(err => console.error(err))
    }
  }

  async handleTestEvent(event, state) {
    if (event.name === 'test_fn_failure') {
      const fullTestName = this.getTestName(event.test)
      const filePath = this.screenshotPath + fullTestName + '.png'
      await this.app.client.saveScreenshot(filePath)
          .catch(err => console.error(err))
    }
  }

  getTestName(test) {
    return `${this.cleanUpString(test.parent.name)}-${this.cleanUpString(test.name)}`
  }

  cleanUpString(stringToClean) {
    return encodeURIComponent(stringToClean.replace(/\s+/g, '-'))
  }

  async waitForClientLoaded() {
    let root = await this.app.client.$('div#root')
    await root.waitForExist({ timeout: 20000 })
  }

  async restart() {
    await this.app.restart()
    await this.waitForClientLoaded()
    this.global.client = this.app.client
  }

  async setupMockServers() {
    await MockServer.start_mockserver({
      serverPort: 8080,
      initializationJsonPath: path.join(__dirname, './apiServerMocks.json'),
      trace: false,
      verbose: false,
    })

    this.global.apiMockServer = mockServerClient('localhost', 8080)
  }
}

module.exports = CustomEnvironment