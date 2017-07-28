#!/bin/bash
#
# Usage: chmod +x ./generate.sh && ./generate.sh

function log {
    printf "\n  ${1}\n"
}

function not_installed {
    # set to 1 (false) initially
    local return_=1
    # set to 0 (true) if not found
    # type $1 >/dev/null 2>&1 || { local return_=0; }
    dpkg -s "$1" >/dev/null 2>&1 || { local return_=0; }
    # return value
    return "$return_"
}

if not_installed "sslfie" ; then
    log "please install sslfie (https://github.com/mkropat/sslfie)"
    exit 1;
fi

sslfie -o server.crt -k server.key a-better-syges.io

if not_installed "libnss3-tools" ; then
    log "please install libnss3-tools (apt install libnss3-tools)"
    exit 1;
fi

certutil -d sql:$HOME/.pki/nssdb -A -t P -n "ABetterSyges" -i server.crt

log "don't forget to : "
log "  1 : add   127.0.0.1 a-better-syges.io   to your host file "
log "  2 : restart your browser so the newly local ssl cert will be used \n"
