// ==UserScript==
// @name         A Better Syges
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  for a better world!
// @author       Romain Racamier-Lafon
// @match        https://sygesweb.niji.fr/SYGESWEB/**
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  var endpoint = 'https://';

  if (typeof window.absLocal === 'undefined') {
    endpoint += 'rawgit.com/Shuunen/a-better-syges/master';
  } else {
    endpoint += 'a-better-syges.io:8880';
  }

  if (typeof window.absInjected === 'undefined') {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = endpoint + '/abs.js';
    document.body.appendChild(script);
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.type = 'text/css';
    link.href = endpoint + '/abs.css';
    document.getElementsByTagName('head')[0].appendChild(link);
  } else {
    console.log('A Better Syges already injected');
  }

})();