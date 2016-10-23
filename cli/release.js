'use strict'

const AWS = require('aws-sdk')
const P = require('bluebird')
const Zlib = require('zlib')
const Fs = require('fs')
const Path = require('path')
const Mimer = require('mimer')
const Assert = require('assert')

Assert(process.env.DONIAPP_AWS_BUCKET, 'Missing env `DONIAPP_AWS_BUCKET`')
Assert(process.env.DONIAPP_AWS_REGION, 'Missing env `DONIAPP_AWS_REGION`')
Assert(process.env.DONIAPP_AWS_KEY, 'Missing env `DONIAPP_AWS_KEY`')
Assert(process.env.DONIAPP_AWS_SECRET, 'Missing env `DONIAPP_AWS_SECRET`')
Assert(process.env.DONIAPP_AWS_PREFIX, 'Missing env `DONIAPP_AWS_PREFIX`')

AWS.config.region = process.env.DONIAPP_AWS_REGION
const S3 = new AWS.S3({
  accessKeyId: process.env.DONIAPP_AWS_KEY,
  secretAccessKey: process.env.DONIAPP_AWS_SECRET
})
P.promisifyAll(S3)

function syncAssets (dir) {
  return P.try(() => {
    console.log('Syncing assets in dir:', dir)
    const manifest = require(Path.join(dir, 'manifest.json'))
    Assert(manifest, 'Missing manifest file')
    // console.log('Manifest:', manifest)
    const files = Object.keys(manifest).map(x => Path.join(dir, manifest[x]))
    const items = createItems(files, process.env.DONIAPP_AWS_PREFIX)

    // Check if items are already on our CDN.
    return checkItems(items)
    .then((newItems) => {
      if (!newItems.length) {
        console.log('Everything’s already up there.')
        return
      }
      console.log(`Will upload the following items:\n`, newItems)
      return s3Uploader(newItems)
    })
  })
  .then(() => console.log('It’s a Done Deal.'))
}

const checkItems = P.coroutine(function * (items) {
  const newItems = []
  for (const item of items) {
    const md = yield getMetadata(item.key)
    if (md === false) {
      newItems.push(item)
    } else {
      const info = `${md.LastModified} / ${md.ContentType} / ${md.ContentLength}`
      console.log('Found:', info)
    }
  }
  return newItems
})

function getMetadata (key) {
  const params = {
    Bucket: process.env.DONIAPP_AWS_BUCKET,
    Key: key
  }
  console.log(`Fetching metadata -> ${params.Bucket}:${params.Key}`)
  return S3.headObjectAsync(params)
  .catch(() => false)
}

// S3 uploader.
const s3Uploader = P.coroutine(function * _co (items) {
  let promises = []
  for (const item of items) {
    promises.push(_uploadItem(item))
    if (promises.length >= 5) {
      // Wait a bit.
      yield P.all(promises)
      promises = []
    }
  }

  if (promises.length) {
    // Wait for any remaining promises to fulfill.
    console.log(`Waiting for ${promises.length} last uploads to complete ..`)
    yield P.all(promises)
  }
  return 'OK'
})

function _uploadItem (item) {
  return P.try(() => {
    const gzip = Zlib.createGzip({ level: 9 })
    const params = {
      Bucket: item.bucket,
      Key: item.key,
      Body: Fs.createReadStream(item.path).pipe(gzip),
      StorageClass: 'REDUCED_REDUNDANCY',
      ACL: 'public-read',
      ContentEncoding: 'gzip',
      ContentType: Mimer(item.key)
    }
    console.log(`Uploading -> ${params.Bucket}:${params.Key}`)
    return S3.uploadAsync(params)
  })
}

function createItems (files, prefix) {
  return files.map((file) => {
    const stats = Fs.statSync(file)
    if (!stats.size) {
      throw Error('File is empty: ' + file)
    }
    return createItem(file, stats.size, prefix)
  })
}

function createItem (file, size, prefix) {
  return {
    bucket: process.env.DONIAPP_AWS_BUCKET,
    key: `${prefix}/${Path.basename(file)}`,
    path: file,
    size
  }
}

if (require.main === module) {
  syncAssets(Path.join(__dirname, '..', 'build'))
}
