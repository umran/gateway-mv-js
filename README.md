# Javascript Payment Gateway API for BML and MIB

### This is an approximate javascript port of [this](https://github.com/aharen/Pay) library by [Ahmed Khusaam](https://github.com/aharen), written in PHP.

This library provides a class with methods to generate transaction requests to the bank's endpoint and parse subsequent responses from the bank posted to the merchant's callback url.

## Warning

Although this is a javascript library, it is meant to be used on the server-side, specifically in a node js environment. Please do NOT attempt to use this in a client-side application as it would expose the shared secret between you and the bank to the client.

## Installation

```sh
npm install gateway-mv-js
```

## Usage

### Configuration and Instantiation

The main class can be imported by simply requiring the package. The class can be instantiated by calling it with the `new` operator. The constructor expects two arguments. The first argument is a string that represents the bank, which can be either 'BML' for the Bank of Maldives endpoint, or 'MIB' for the Maldives Islamic Bank endpoint. The second argument is a configuration object.

```sh
const Gateway = require('gateway-mv-js')

const config = {
  // Required Fields
  Host: 'bml.com.mv',
  MerRespURL: 'https://thebackdoor.ca/response',
  AcqID: '0123',
  MerID: '3210',
  MerPassword: 'some password',

  // Optional Fields Set to Defaults
  PurchaseCurrency: '462',
  PurchaseCurrencyExponent: '2',
  Version: '1.1', // for MIB the default is '1'
  SignatureMethod: 'SHA1'
}

let gateway = new Gateway('BML', config)
```

### Preparing a New Transaction Request

A new transaction request can be generated by calling `generateTransactionRequest`. It expects the first argument to be the value of the transaction in the currency that was set in the configuration step. The second argument is a unique transaction ID. The transaction ID should never be repeated, even for transactions that are being retried. The function returns an object containing the POST parameters that should be included in the POST request to the bank's endpoint

```sh
const transaction = gateway.generateTransactionRequest(150.99, 'XD09928')
```

### Verifying the bank's response to a given transaction

The verification method, `verifyResponseSignature` is called once the bank calls back with its response to a particular transaction request. The first argument is the relevant transaction id. The second argument is an object containing POST parameters sent back by the bank to the callback url. The function returns a boolean; true if the signature sent by the bank checks out, false if not.

```sh
const verified = gateway.verifyResponseSignature('XD09928', response)
```
