import koa from 'koa';
const app = new koa();
import logger from 'koa-logger';
import json from 'koa-json';
// import views from 'koa-views';
import bodyparser from 'koa-bodyparser';
import onerror from 'koa-onerror';

// 爬虫
import { crawler } from './crawler'
crawler.crawler();


// 路由
let index = require('./routes/index');
let users = require('./routes/users');

// error handler
onerror(app);

// middlewares
app.use(bodyparser);
app.use(json());
app.use(logger());

// logger
app.use(async(ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

// routes definition
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

module.exports = app;
