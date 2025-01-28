import { store } from './store.js';

const BASE_URL = '/api';
const JSON_TYPE = 'application/json';

export const service = {
	postUser: async function(user) {
		await sendRequest('POST', '/users', user);
	},
	getTodos: async function() {
		let response = await sendRequest('GET', '/todos');
		return response.json();
	},
	postTodo: async function(todo) {
		let response = await sendRequest('POST', '/todos', todo);
		return response.json();
	},
	putTodo: async function(todo) {
		let response = await sendRequest('PUT', `/todos/${todo.id}`, todo);
		return response.json();
	},
	deleteTodo: async function(id) {
		await sendRequest('DELETE', `/todos/${id}`);
	}
};

async function sendRequest(method, path, data = null) {
	let url = BASE_URL + path;
	let options = { method, headers: getHeaders(method) };
	if (data) options.body = JSON.stringify(data);
	console.log(`Send ${options.method} request to ${url}`);
	let response = await fetch(url, options);
	if (!response.ok) throw response;
	return response;
}

function getHeaders(method) {
	let headers = {};
	headers['Accept'] = JSON_TYPE;
	if (method === 'POST' || method === 'PUT') headers['Content-Type'] = JSON_TYPE;
	let user = store.getUser();
	if (user) headers['Authorization'] = 'Basic ' + btoa(user.name + ':' + user.password);
	return headers;
}
