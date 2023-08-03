const combineRouters = require('koa-combine-routers');
const users = require('./users/users');
const index = require('./index/index.js');
const sse = require('./sse/sse');

const router = combineRouters(
    users,
    index,
    sse,
)

module.exports = router;