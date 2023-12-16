import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Person from './Person';
import { Hono } from 'hono';

type Bindings = {
	SUPABASE_URL: string;
	SUPABASE_ANON_KEY: string;
};

type Variables = {
	supabaseClient: SupabaseClient;
};

const api = new Hono<{ Bindings: Bindings; Variables: Variables }>();
// middleware to initialise supabase client
api.use('*', async (c, next) => {
	const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);
	c.set('supabaseClient', supabase);
	await next();
});
// create new user
api.post('/user', async (c) => {
	const { fullName, age } = await c.req.json<Omit<Person, 'id'>>();
	const { data, error } = await c.var.supabaseClient.from('person').insert({ full_name: fullName, age }).select();
	c.status(201)
	return c.json(data);
});
// update user
api.put('/user', async (c) => {
	const { id,fullName, age } = await c.req.json<Omit<Person, 'key'>>();

	const { data,error } = await c.var.supabaseClient.from('person').update({ full_name: fullName, age }).eq('id', id).select();
	c.status(201)
	return c.json(data);
});
// select all users
api.get('/users', async (c) => {
	const { data, error } = await c.var.supabaseClient.from('person').select();
	return c.json(data);
});
// select user by id
api.get('/user/:id', async (c) => {
	const id = c.req.param('id');
	const { data, error } = await c.var.supabaseClient.from('person').select().filter('id', 'eq', id);
	return c.json(data);
});
// delete user by id
api.delete('/user/:id', async (c, next) => {
	const id = c.req.param('id');
	const { data,error } = await c.var.supabaseClient.from('person').delete().eq('id', id);
	return c.json({'id':id},200);
});

export default api;
