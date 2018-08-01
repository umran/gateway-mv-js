const AbstractProvider = require("./AbstractProvider")

class MIBProvider extends AbstractProvider {
  constructor(config) {
    super(config)

    this._rules = {
      Host: true,
      MerRespURL: true,
      PurchaseCurrency: false,
      PurchaseCurrencyExponent: false,
      Version: false,
      SignatureMethod: false,
      AcqID: true,
      MerID: true,
      MerPassword: true
    }

    this._defaults = {
      PurchaseCurrency: '462',
      PurchaseCurrencyExponent: '2',
      Version: '1',
      SignatureMethod: 'SHA1'
    }

    this._validateConfig()
  }

  _generateResponseSignature(transactionId, response) {
    var signingString = this._config['MerPassword'].concat(
      this._config['MerID'],
      this._config['AcqID'],
      transactionId
    )

    return this._generateHash(signingString)
  }

}

module.exports = MIBProvider
