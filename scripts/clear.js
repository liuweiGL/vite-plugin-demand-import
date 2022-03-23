const fs = require('fs')
const path = require('path')

const tsconfig = require('../tsconfig.build.json')

const outdir = path.resolve(__dirname, '..', tsconfig.compilerOptions.outDir)

if (fs.existsSync(outdir)) {
  fs.rmSync(outdir, {
    recursive: true
  })
}
