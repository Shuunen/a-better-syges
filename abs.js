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
    setInterval(_ => {
      this.getContext()
      if (this.context !== this.lastContext) {
        this.updateContext()
      }
      this.lastContext = this.context
    }, 1000)
  }
  getContext() {
    let pageId = window._PU_
    if (!pageId) {
      return PAGES.error
    }
    let context = PAGES.unknown
    if (pageId.indexOf('IDENTIFICATION') !== -1) {
      context = PAGES.login
    } else if (pageId.indexOf('SYW_ME_MENUV14') !== -1) {
      context = PAGES.home
    } else if (pageId.indexOf('CNG_14_SAISIECONGES') !== -1) {
      context = PAGES.holiday
    }
    this.context = context
  }
  updateContext() {
    this.log('updating context : ' + this.context)
    document.body.classList.add('abs')
    document.body.classList.add('abs-' + this.context)

    if (this.context === PAGES.home) {
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
    if (this.context === PAGES.home) {
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
    this.addClickListeners()
  }
  addClickListeners() {
    document.querySelector('.abs-icon-close').addEventListener('click', e => {
      this.log('clicked on close icon')
      this.hideMask()
    })
    if (this.context === PAGES.home) {
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
