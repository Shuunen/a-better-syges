'use strict';

class Abs {
  constructor() {
    this.log('init')
    window.absInjected = true
    this.injectAlertify()
      .then(_ => {
        this.toast('A Better Syges started :)')
        this.startCron()
      })
  }
  log(str) {
    console.log(str)
  }
  toast(str) {
    alertify.notify(str)
  }
  injectAlertify() {
    return new Promise((resolve, reject) => {
      if (typeof alertify !== 'undefined') {
        resolve('already loaded')
      }
      this.log('adding alertify...')
      let script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = 'https://cdn.jsdelivr.net/alertifyjs/1.9.0/alertify.min.js'
      document.body.appendChild(script)
      script.onload = _ => resolve('alertify loaded')
      let link = document.createElement('link')
      link.setAttribute('rel', 'stylesheet')
      link.setAttribute('type', 'text/css')
      link.setAttribute('href', 'https://cdn.jsdelivr.net/alertifyjs/1.9.0/css/alertify.min.css')
      document.getElementsByTagName('head')[0].appendChild(link)
      link = document.createElement('link')
      link.setAttribute('rel', 'stylesheet')
      link.setAttribute('type', 'text/css')
      link.setAttribute('href', 'https://cdn.jsdelivr.net/alertifyjs/1.9.0/css/themes/default.min.css')
      document.getElementsByTagName('head')[0].appendChild(link)
    })
  }
  startCron() {
    let lastContext = ''
    setInterval(_ => {
      let context = this.getContext()
      if (context !== lastContext) {
        this.toast('Detected context : ' + context)
      }
      lastContext = context
    }, 1000)
  }
  getContext() {
    let pageId = window._PU_
    if (!pageId) {
      return 'error-page'
    }
    let context = 'unknown'
    if (pageId.indexOf('IDENTIFICATION') !== -1) {
      context = 'login-page'
    }
    return context
  }
}

let abs = new Abs();
