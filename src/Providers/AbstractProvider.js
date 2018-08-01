const Hashes = require('jshashes')
const expect = require('chai').expect

class AbstractProvider {

  constructor(config) {
    this._config = config
  }

  _getStaticParameters() {
    var config = this._config

    return Object.keys(config).reduce((result, key) => {
          if (key !== 'MerPassword') {
              result[key] = config[key];
          }

          return result;
    }, {})

  }

  _validateConfig() {
    var config = this._config
    const configRules = this._rules
    const defaultRules = this._defaults

    for (var key in configRules) {
      if(!(key in config)) {
        if(configRules[key] === true) {
          throw new Error('Required setting missing')
        }
        config[key] = defaultRules[key]
      }
    }

  }

  _formatTransactionAmount(value) {
    value = parseFloat(value)
    var formatted = value.toFixed(this._config['PurchaseCurrencyExponent'])
    formatted = formatted.replace('.', '')
    formatted = formatted.padStart(12, '0')
    return formatted
  }


  _generateHash(data) {
    return new Hashes.SHA1().b64(data)
  }


  _generateRequestSignature(transactionRequest) {
    var signingString = this._config['MerPassword'].concat(
      transactionRequest['MerID'],
      transactionRequest['AcqID'],
      transactionRequest['OrderID'],
      transactionRequest['PurchaseAmt'],
      transactionRequest['PurchaseCurrency']
    )

    return this._generateHash(signingString)
  }

  _generateResponseSignature(transactionId, response) {
    throw new Error('Child class must implement method')
  }

  generateTransactionRequest(value, transactionId) {
    var transactionRequest = this._getStaticParameters()
    transactionRequest['PurchaseAmt'] = this._formatTransactionAmount(value)
    transactionRequest['OrderID'] = transactionId
    transactionRequest['Signature'] = this._generateRequestSignature(transactionRequest)

    return transactionRequest
  }

  verifyResponseSignature(transactionId, response) {
    var expectedSignature = this._generateResponseSignature(transactionId, response)
    var candidateSignature = response['Signature']

    try {
      expect(candidateSignature).to.equal(expectedSignature)
      return true
    } catch (err) {
      return false
    }

  }

}

module.exports = AbstractProvider
