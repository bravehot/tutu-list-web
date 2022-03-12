#!/bin/sh
# 前端应用存在NPM依赖时的默认编译脚本
npm install nvm
nvm install 14
nvm use 14
npm install
npm run build