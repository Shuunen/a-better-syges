'use strict';

const PAGES = {
  error: 'error-page',
  unknown: 'unknown-page',
  home: 'home-page',
  holiday: 'holiday-page',
  activity: 'activity-page',
  fees: 'fees-page',
  login: 'login-page',
  logout: 'logout-page'
}

const SERVICES = {
  holiday: {
    title: 'congés',
    page: PAGES.holiday,
    help: 'merci de saisir votre demande 2 mois avant la date de début.',
    image: 'https://sygesweb.niji.fr/SYGESWEB_WEB/SYW_IMAG/S14_IMABTG/SYW_B14_MENABS.PNG'
  },
  activity: {
    title: 'activité',
    page: PAGES.activity,
    help: 'merci de saisir votre activité 3 jours minimum avant la fin du mois.',
    image: 'https://sygesweb.niji.fr/SYGESWEB_WEB/SYW_IMAG/S14_IMABTG/SYW_B14_MENACT.PNG'
  },
  fees: {
    title: 'frais',
    page: PAGES.fees,
    help: 'merci d\'envoyer les justificatifs à votre assistante avant le 4ième jour ouvré du mois suivant.',
    image: 'https://sygesweb.niji.fr/SYGESWEB_WEB/SYW_IMAG/S14_IMABTG/SYW_B14_MENFRS.PNG'
  }
}

class Abs {
  constructor() {
    this.log('init')
    window.absInjected = true
    if (!localStorage.absAvoidNextMask) {
      this.showMask()
    } else {
      delete localStorage.absAvoidNextMask
    }
    this.startCron()
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
    this.lastContext = ''
    this.cron = setInterval(_ => {
      this.getContext()
      if (this.context !== this.lastContext) {
        this.log('context updated from "' + this.lastContext + '" to "' + this.context + '"')
        this.updateContext()
      }
      this.lastContext = this.context
    }, 1000)
  }
  getContext() {
    let pageId = window._PU_ || ''
    let context = PAGES.unknown

    if (pageId.indexOf('IDENTIFICATION') !== -1) {
      context = PAGES.login
    } else if (pageId.indexOf('SYW_ME_MENUV14') !== -1) {
      context = PAGES.home
    } else if (pageId.indexOf('CNG_14_SAISIECONGES') !== -1) {
      context = PAGES.holiday
    }

    if (context === PAGES.unknown) {
      let pageContent = document.body.textContent.trim().replace(/\s+/g, ' ')
      if (pageContent.indexOf('ERR_ALREADYCONNECTED') !== -1) {
        this.log('haha now you\'re lost into syges magic errors, you have to wait from few seconds to minutes, pray & reload the page.')
        this.log('may the pasta be with you !')
        clearInterval(this.cron)
      }
    }
    this.context = context
  }
  updateContext() {
    this.log('updating context : ' + this.context)
    document.body.classList.add('abs')
    document.body.classList.add('abs-' + this.context)

    if (this.context === PAGES.login) {
      this.showMask()
      this.tryPrefill()
    } else if (this.context === PAGES.home) {
      this.getPersonalData()
      this.showMask()
    } else {
      // if no mask created yet for the current context
      this.hideMask()
    }
  }
  goto(page) {
    this.log('going to page : ' + page)
    let event = null // event should be the mouseclick browser event
    // but syges doesn't care this to be null
    if (page === PAGES.home) {
      // these kind of weird code are stolen from the onclick= syges-web buttons
      clWDUtil.pfGetTraitement('BTG_RETMEN', 0, undefined)(event)
    } else if (page === PAGES.holiday) {
      localStorage.absAvoidNextMask = true
      _PAGE_.ZRP_MENPRI.value = 2
      clWDUtil.pfGetTraitement('BTG_ACTM01', 0, undefined)(event)
    } else if (page === PAGES.activity) {
      localStorage.absAvoidNextMask = true
      _PAGE_.ZRP_MENPRI.value = 3
      clWDUtil.pfGetTraitement('BTG_ACTM01', 0, undefined)(event)
    } else if (page === PAGES.fees) {
      localStorage.absAvoidNextMask = true
      _PAGE_.ZRP_MENPRI.value = 4
      clWDUtil.pfGetTraitement('BTG_ACTM01', 0, undefined)(event)
    } else if (page === PAGES.logout) {
      _PAGE_.ZRP_MENPRI.value = 1
      clWDUtil.pfGetTraitement('BTG_ACTM02', 0, undefined)(event)
    } else {
      this.log('cannot go to page "' + page + '" missing case')
    }
  }
  hideMask() {
    let existingMask = document.querySelector('.abs-mask')
    if (existingMask) {
      existingMask.classList.add('closing')
      setTimeout(_ => {
        existingMask.remove()
      }, 1000)
    }
  }
  showMask() {
    let html = ''
    let existingMask = document.querySelector('.abs-mask')
    // for all pages
    if (!existingMask) {
      html += '<div class="abs-title">A Better Syges</div>'
      html += '<div class="abs-icons">'
      html += '   <a class="abs-icon abs-icon-info" title="Github" href="https://github.com/Shuunen/a-better-syges" target="_blank"></a>'
      html += '   <div class="abs-icon abs-icon-close" title="Fermer"></div>'
      html += '</div>'
    }
    // per pages
    if (this.context === PAGES.login) {
      html += '<div class="abs-welcome">Bienvenue, merci de vous identifier.</div>'
      html += '<form id="absLoginForm" name="absLoginForm">'
      html += '   <div class="abs-line text"><input required id="absLogin" name="absLogin" /><label for="absLogin">Identifiant</label><span class="abs-bar"></span></div>'
      html += '   <div class="abs-line text"><input required type="password" id="absPass" name="absPass" /><label for="absPass">Mot de passe</label><span class="abs-bar"></span></div>'
      html += '   <div class="abs-line check"><label><input type="checkbox" ' + (localStorage.absLogin ? 'checked="checked"' : '') + ' id="absKeep" name="absKeep" /> mémoriser ?</label></div>'
      html += '   <button type="submit">Se connecter</button>'
      html += '</form>'
    } else if (this.context === PAGES.home) {
      html += '<div class="abs-welcome">Bonjour <span>' + this.firstName + '</span>.</div>'
      html += '<div class="abs-services">'
      for (var i in SERVICES) {
        html += '<button class="' + SERVICES[i].page + '" style="background-image: url(\'' + SERVICES[i].image + '\')"><span>' + SERVICES[i].title + '</span></button>'
      }
      html += '</div>'
    }
    // insert & listen
    if (!existingMask) {
      let mask = document.createElement('div')
      mask.classList.add('abs-mask')
      mask.innerHTML = html
      document.body.appendChild(mask)
    } else {
      existingMask.innerHTML += html
    }
    // un-hide syges
    document.body.removeAttribute('hidden')
    this.addListeners()
  }
  triggerChange(el) {
    el.dispatchEvent(new KeyboardEvent('change'))
  }
  addListeners() {
    document.querySelector('.abs-icon-close').addEventListener('click', e => {
      this.log('clicked on close icon')
      this.hideMask()
    })
    if (this.context === PAGES.login) {
      document.querySelector('#absLoginForm').addEventListener('submit', e => {
        e.preventDefault()
        let login = document.querySelector('#absLogin').value
        let pass = document.querySelector('#absPass').value
        let doKeep = document.querySelector('#absKeep').checked
        // update local storage
        if (doKeep) {
          localStorage.absLogin = login
          localStorage.absPass = pass
        } else {
          delete localStorage.absLogin
          delete localStorage.absPass
        }
        // fill syges fields
        let loginField = document.querySelector('#SIE_LOGACC')
        loginField.value = localStorage.absLogin
        this.triggerChange(loginField)
        let passField = document.querySelector('#SIE_MOTPAS')
        passField.value = localStorage.absPass
        this.triggerChange(passField)
        // push syges login button
        clWDUtil.pfGetTraitement('BTN_VALCNX', 0, undefined)(null)
      })
    } else if (this.context === PAGES.home) {
      document.querySelector('.abs-services button.' + PAGES.holiday).addEventListener('click', e => {
        this.goto(PAGES.holiday)
      })
      document.querySelector('.abs-services button.' + PAGES.activity).addEventListener('click', e => {
        this.goto(PAGES.activity)
      })
      document.querySelector('.abs-services button.' + PAGES.fees).addEventListener('click', e => {
        this.goto(PAGES.fees)
      })
    }
  }
  tryPrefill() {
    let login = document.querySelector('#absLogin')
    let pass = document.querySelector('#absPass')
    if (login && localStorage.absLogin) {
      login.value = localStorage.absLogin
    }
    if (pass && localStorage.absPass) {
      pass.value = localStorage.absPass
    }
  }
  getPersonalData() {
    this.name = 'Bel(lle) Inconnu(e)'
    this.location = 'inconnue'
    var data = document.querySelector('#zrl_1_AVA_INFMEN').textContent.trim().replace(/\s+/g, ' ').split(' Resp')[0].split(' (Agence: ')
    if (data && data.length === 2) {
      this.name = data[0]
      this.location = data[1]
    } else {
      this.log('failed at getting personal data in page')
    }
    // in : ALBERT DUPONT
    // out : Albert Dupont
    this.name = this.name.split(' ')
    this.firstName = this.firstCap(this.name[0], true)
    this.lastName = this.firstCap(this.name[1], true)
    this.name = this.firstName + ' ' + this.lastName
    this.log('user logged is : ' + this.name)
  }
  firstCap(str, doLower) {
    str = (str + '')
    if (doLower) {
      str = str.toLowerCase()
    }
    str = str[0].toUpperCase() + str.slice(1)
    return str
  }
}

window.abs = new Abs();
