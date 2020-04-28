const NodeEnvironment = require('jest-environment-node')

class CustomEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup()

    this.global.client = global.app.client
    this.global.appUrl = 'http://localhost:3000'
  }
}

module.exports = CustomEnvironment