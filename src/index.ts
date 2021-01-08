import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as logger from 'koa-logger'
import * as json from 'koa-json'
import * as crypto from 'crypto'
import {rejects} from "assert";

const app = new Koa()
const router = new Router()
const users: any = {}

router.get('/newUser', (ctx) => {
    let username = ctx.query.username || ''
    const password = ctx.query.password || ''
    username = username.replace(/[!@#$%^&*]/g, '')

    if (!username || !password || users.username) {
        ctx.code = 400
        ctx.body = 'error'
    }

    const salt = crypto.randomBytes(128).toString('base64')
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512')

    users[username] = { salt, hash }
    console.log(username, password, users)
    ctx.body = 'ok'
})


router.get('/auth/v1', (ctx) => {
    console.log(users)
    let username = ctx.query.username || ''
    const password = ctx.query.password || ''
    username = username.replace(/[!@#$%^&*]/g, '')

    if (!username || !password || !users[username]) {
        return ctx.code = 400
    }

    const { salt, hash } = users[username]
    const encryptHash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512')

    if (crypto.timingSafeEqual(hash, encryptHash)) {
        ctx.code = 200
        ctx.body = 'ok'
    } else {
        ctx.code = 401
        ctx.body = 'fail'
    }
})

router.get('/auth/v2', async (ctx) => {
    console.log(users)
    let username = ctx.query.username || ''
    const password = ctx.query.password || ''
    username = username.replace(/[!@#$%^&*]/g, '')

    if (!username || !password || !users[username]) {
        ctx.code = 400
        ctx.body = 'error'
    }
    ctx.body = await valid(username, password)
})

function valid (username, password) {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, users[username].salt, 10000, 512, 'sha512', (err, hash) => {
            if (err) {
                reject(err)
            }
            if (users[username].hash.toString() === hash.toString()) {
                resolve('ok')
            } else {
                reject(new Error('valid fail'))
            }
        })
    })
}

app
    .use(json())
    .use(logger())
    .use(router.routes())
    .use(router.allowedMethods())

app.listen(8080, () => {
    console.log('koa started')
})