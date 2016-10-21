'use strict'

const P = require('bluebird')
const Assert = require('assert')
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID

Assert(process.env.DONIAPP_MONGO_DB_URL, 'Missing env `DONIAPP_MONGO_DB_URL`')

let _db
function query (func, args) {
  if (_db) {
    return P.coroutine(func)(_db, args)
  }
  return connect().then(() => P.coroutine(func)(_db, args))
}

function connect (_url) {
  // mongodb://[username:password@]host1[:port1][/[database]
  const url = _url || process.env.DONIAPP_MONGO_DB_URL
  return MongoClient.connect(url)
  .then(db => {
    _db = db
    console.log('Connected to MongoDB:', _db.s.databaseName)
    return _db
  })
}

function close () {
  if (_db) {
    console.log('Closing MongoDB connection.')
    _db.close()
  }
}

function * sanityTest (db) {
  const r1 = yield db.collection('testing').insertOne({ a: 1 })
  console.log(`Inserted ${r1.result.n} document.`)

  const r2 = yield db.collection('testing')
  .find({ a: 1 })
  .sort({ _id: -1 })
  .limit(10)
  .toArray()
  console.log(`Found ${r2.length} documents.`)

  const r3 = yield db.collection('testing').deleteMany({ a: 1 })
  console.log(`Deleted ${r3.result.n} documents.`)
}

function getObjectId (str) {
  return new ObjectID(str)
}

module.exports = {
  connect,
  query,
  close,
  sanityTest,
  getObjectId
}
