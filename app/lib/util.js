/* global Headers, Request, fetch */
'use strict'

function fetchJson (_url, body = { }, method = 'POST') {
  const url = _url.includes('http') ? _url : window.Config.API_URL + _url

  const headers = new Headers()
  headers.append('Content-Type', 'application/json')
  const opts = {
    method,
    headers,
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify(body)
  }
  const req = new Request(url, opts)
  console.log('req.bodyUsed', req.bodyUsed, 'body:', body)
  return fetch(req).then(resp => resp.json())
}

module.exports = {
  fetchJson
}
