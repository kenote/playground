const fs = require('fs')
const path = require('path')

const filename = path.resolve(__dirname, '.output/server/chunks/nitro/node-server.mjs')

let filestr = fs.readFileSync(filename, 'utf8')
filestr = filestr.replace(/\"apiBase\"\:[\s\S]{1}\"?[a-z\:\/\d]{0,}\"/, '"apiBase": process.env.NUXT_PUBLIC_API_BASE')
fs.writeFileSync(filename, filestr, 'utf8')
