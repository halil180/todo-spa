import { router } from '../router.js';
import { service } from '../service.js';
import { store } from '../store.js';
import { util } from '../util.js';

export class UserLogin extends HTMLElement {

	user = {};

	async connectedCallback() {
		this.innerHTML = await util.loadTemplate('user-login');
		util.bindData(this);
		this.querySelector('#login').onclick = () => this.#loginUser();
		this.querySelector('#register').onclick = () => this.#registerUser();
	}

	async #loginUser() {
		let form = this.querySelector('form');
		if (!form.reportValidity()) return;
		try {
			store.setUser(this.user);
			let todos = await service.getTodos();
			store.setTodos(todos);
			let uri = this.getAttribute('uri');
			router.navigate(uri ? decodeURIComponent(uri) : 'todo-list');
		} catch (error) {
			store.clear();
			if (error.status === 401)
				document.querySelector('footer').innerHTML = 'Invalid credentials';
			else throw error;
		}
	}

	async #registerUser() {
		let form = this.querySelector('form');
		if (!form.reportValidity()) return;
		try {
			await service.postUser(this.user);
			store.setUser(this.user);
			store.setTodos([]);
			router.navigate('todo-list');
		} catch (error) {
			if (error.status === 409)
				document.querySelector('footer').innerHTML = 'User already exists';
			else throw error;
		}
	}
}
