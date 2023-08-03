const Router = require('koa-router');
const { v4 } = require('uuid');
const users = require('../../database/database')
const { streamEvents } = require('http-event-stream');

const router = new Router();

router.get('/sse', async (ctx) => {
    // streamEvents(ctx.req, ctx.res, {
    //     async fetch(lastEventId) {
    //         console.log(lastEventId);
    //         return [];
    //     },

    //     async stream(sse) {
    //         users.listen(item =>{
    //             sse.sendEvent({
    //                 id: v4(),
    //                 data: JSON.stringify(item),
    //             });
    //         })
            
    //         return () => {};
    //     }
    // });
    // ctx.respond = false;
})

module.exports = router;