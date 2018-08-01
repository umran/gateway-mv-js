const BMLProvider = require('./Providers/BMLProvider')
const MIBProvider = require('./Providers/MIBProvider')

class Gateway {
  constructor(type, config) {
    if (type === 'BML') {
      this._provider = new BMLProvider(config)
    } else if (type === 'MIB') {
      this._provider = new MIBProvider(config)
    } else {
      throw new Error('Unrecognized provider type')
    }
  }

  generateTransactionRequest(value, transactionId) {
    return this._provider.generateTransactionRequest(value, transactionId)
  }

  verifyResponseSignature(transactionId, response) {
    return this._provider.verifyResponseSignature(transactionId, response)
  }
}

module.exports = Gateway
