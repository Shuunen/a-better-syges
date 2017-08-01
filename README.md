# A Better Syges

Hello there :)

This is a work in progress but feel free to open issues for bugs & feature requests.

# What ?

A Better Syges (abs) aim to improve Syges UI & UX

# Why ?

Because, in my opinion, Syges UI ugly & bloatered.

Here is how it looks like with ABS actually :

![ABS Screenshot](http://i.imgur.com/qqcoQup.png)

# How ?

Abs will enhance Syges while you are browsing [https://sygesweb.niji.fr/](https://sygesweb.niji.fr/SYGESWEB/)

First, install [TamperMonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) or an alternative

Then the [ABS user script](https://greasyfork.org/fr/scripts/31837-a-better-syges) will do the customization for you.

# Develop locally

By default, [ABS user script](https://greasyfork.org/fr/scripts/31837-a-better-syges) will get the ABS files hosted on this repo.

You can by-pass this behaviour by setting this in your browser : `localStorage.absLocal = true`

This will inform [ABS user script](https://greasyfork.org/fr/scripts/31837-a-better-syges) to use files hosted on https://a-better-syges.io:8880 instead.

Create an entry in your host file with `a-better-syges.io   127.0.0.1`

Then generate some certificates in the cert folder, I made a script to do it for you. It will generates certs & install it on your local machine so your browser won't throw you an invalid https cert error.

Then you can `yarn` & `yarn start` and this will serve abs.js & abs.css files over https (which is required because Syges is also over https).

# Thanks

- Icons : https://www.iconfinder.com/iconsets/audio-controls-ui-icons
