import { Hono } from 'hono';
import api from './personController';
const app = new Hono()


app.get('/', (c) => {
  return c.text('Application to manage persons');
});


app.route('/api', api)
export default app;
