import { Hono } from 'hono';
import api from './personController';
import { cors } from 'hono/cors'
const app = new Hono()
app.use('/api/*', cors())
app.get('/', (c) => {
  return c.text('Application to manage persons');
});


app.route('/api', api)
export default app;
