const { readdirSync, readFileSync, writeFileSync, statSync } = require('fs')
const { resolve } = require('path')
const decompress = require('brotli').decompress
const cwd = process.cwd()

const parser = () => {
    let years = (readdirSync(cwd)).filter(s => s.startsWith('20'))
    for (year of years) {
        for (month of readdirSync(cwd + '/' + year)) {
            for (let day of readdirSync([cwd, year, month].join('/'))) {
                for (let filename of readdirSync([cwd, year, month, day].join('/'))) {
                    let f = [cwd, year, month, day, filename].join('/')
                    f = resolve(f)
                    if (filename.endsWith('.br')) {
                        console.log(f)
                        let s = statSync(f)
                        if (s && s.isFile() && s.size > 0) {
                            let raw = decompress(readFileSync(f))
                            writeFileSync([cwd, 'data', filename.substr(0, filename.length - 3)].join('/'), Buffer.from(raw).toString('utf8'))
                        }
                    }
                }
            }
        }
    }
}

parser()