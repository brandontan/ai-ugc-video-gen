#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \.
"/opt/homebrew/opt/nvm/nvm.sh"
nvm use 18.18.0
npm run dev
