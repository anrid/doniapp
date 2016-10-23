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
  return fetch(req)
  .then(resp => {
    if (resp.ok) {
      return resp.json()
    }
    return resp.json().then(json => {
      const e = new Error(resp.statusText)
      e.json = json
      throw e
    })
  })
}

module.exports = {
  fetchJson
}
