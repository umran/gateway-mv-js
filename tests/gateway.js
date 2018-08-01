const Gateway = require('../src/Gateway')

var config = {
  Host: 'bml.com.mv',
  MerRespURL: 'https://thebackdoor.ca/response',
  AcqID: '0123',
  MerID: '3210',
  MerPassword: 'some password'
}

let gateway = new Gateway('BML', config)

var request = gateway.generateTransactionRequest("2319", "XKCDS19882")
console.log(request)

var response = {
  'ResponseCode': '2',
  'ReasonCode': '18',
  'Signature': 'gDsQ5luf0QVLmapGAOqhnpROhcI='
}

var result = gateway.verifyResponseSignature('XKCDS19882', response)
console.log(result)
