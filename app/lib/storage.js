'use strict'

const STORAGE_KEY = '@MyLocalStorage'

function hasLocalStorage () {
  if (typeof window === 'undefined' || !window.localStorage) {
    console.log('window.localStorage not present.')
    return false
  }
  return true
}

function get () {
  return new Promise(resolve => {
    let data = { }
    if (!hasLocalStorage()) {
      return resolve(data)
    }

    let json = window.localStorage.getItem(STORAGE_KEY)
    try {
      data = JSON.parse(json)
    } catch (exp) {
      console.log(`Could not parse localStorage data, ${STORAGE_KEY}='${json}'`)
    }
    resolve(data)
  })
}

function set (data) {
  return get()
  .then(existing => {
    const merged = Object.assign({ }, existing, data)
    if (hasLocalStorage()) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
    }
  })
}

export default {
  get,
  set
}
