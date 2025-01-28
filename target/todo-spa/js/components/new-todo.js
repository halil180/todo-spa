import { router } from '../router.js';
import { service } from '../service.js';
import { store } from '../store.js';
import { util } from '../util.js';

export class NewTodo extends HTMLElement {

	protected = true;
	todo = {};

	async connectedCallback() {
		this.innerHTML = await util.loadTemplate('new-todo');
		util.bindData(this);
		this.querySelector('#save').onclick = () => this.#addTodo();
	}

	async #addTodo() {
		let form = this.querySelector('form');
		if (!form.reportValidity()) return;
		this.todo = await service.postTodo(this.todo);
		store.addTodo(this.todo);
		router.navigate('todo-list');
	}
}
