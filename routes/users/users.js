const Router = require('koa-router');
const database = require('../../database/database')
const router = new Router();


// POST метод через  koa-router без использования app.use
router.post('/users', async (ctx) => {
  // console.log(ctx.request.body);
  const {name} = ctx.request.body;
  ctx.response.set('Access-Control-Allow-Origin', '*');
  if(database.data.some(sub => sub.name === name)){
    ctx.response.status = 400;
    ctx.response.body = {status: "name already use"};
    return;
  }
  database.add({name});
  // console.log(database.data);
  ctx.response.body = JSON.stringify({name});
})

// GET ALL USERS
router.get('/users', async (ctx) => {
  ctx.response.set('Access-Control-Allow-Origin', '*');
  ctx.response.body = JSON.stringify(database.data)
})


// DELETE (без query, через URL-params - /:phone - позволяет положить id в ctx.params) метод через koa-router без использования app.use
router.delete('/users/:name', async (ctx) => {
  // console.log(ctx.params);
  const {name} = ctx.params;
  ctx.response.set('Access-Control-Allow-Origin', '*');
  if(database.data.every(sub => sub.name !== name)){
    ctx.response.status = 400;
    ctx.response.body = {status: "user doesn\'t exists"};
    return;
  }
  database.data = database.data.filter(sub => sub.name !== name);
  ctx.response.body = JSON.stringify({status: "Ok"})
})


module.exports = router;