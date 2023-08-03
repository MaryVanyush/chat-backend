const http = require('http');
const Koa = require('koa');
const { koaBody } = require('koa-body');
const router = require('./routes/koa-combine-routers');
const app = new Koa();
const WS = require('ws')

// CORS
app.use(koaBody({
  urlencoded: true,
  multipart: true,
}));

app.use(async (ctx, next) => {
    const origin = ctx.request.get('Origin');
    if (!origin) {
      return await next();
    }
  
    const headers = { 'Access-Control-Allow-Origin': '*', };

      if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({...headers});
    try {
      return await next();
    } catch (e) {
      e.headers = {...e.headers, ...headers};
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }

    ctx.response.status = 204;
  }
});

app.use(router());

const port = process.env.PORT || 7070;

const server = http.createServer(app.callback());
server.listen(port);

const wsServer = new WS.Server({
  server
});


let senders = [];
let chat = [];

wsServer.on('connection', (ws) => {
  ws.on('message', (message) => {
    const eventData = JSON.parse(message);
    // console.log(eventData)
    if(eventData.closed){
      senders = senders.filter(sender => sender.senderName !== eventData.closed);
      Array.from(wsServer.clients)
      .filter(client => client.readyState === WS.OPEN)
      .forEach(client => client.send(JSON.stringify({closed: [eventData]})));
      return;
    } else if(eventData.senderName){
      senders.push(eventData);
      Array.from(wsServer.clients)
      .filter(client => client.readyState === WS.OPEN)
      .forEach(client => client.send(JSON.stringify({senders: [eventData]})));
      return;
    } else {
      chat.push(eventData);
      Array.from(wsServer.clients)
      .filter(client => client.readyState === WS.OPEN)
      .forEach(client => client.send(JSON.stringify({chat: [eventData]})));
    }
  })
  ws.send(JSON.stringify({chat}));
})
