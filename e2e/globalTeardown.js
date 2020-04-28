module.exports = async function globalTeardown() {
  if (this.app && this.app.isRunning()) {
    return this.app.stop()
  }
}