import { router } from '../router.js';
import { service } from '../service.js';
import { store } from '../store.js';
import { util } from '../util.js';

export class EditTodo extends HTMLElement {

	protected = true;
	todo = {};

	async connectedCallback() {
		this.innerHTML = await util.loadTemplate('edit-todo');
		let id = this.getAttribute('id');
		if (!id) throw new Error('Missing todo id');
		let todo = store.getTodo(id);
		if (!todo) throw new Error(`Todo with id ${id} not found`);
		Object.assign(this.todo, todo);
		util.bindData(this);
		this.querySelector('#save').onclick = () => this.#updateTodo();
	}

	async #updateTodo() {
		let form = this.querySelector('form');
		if (!form.reportValidity()) return;
		this.todo = await service.putTodo(this.todo);
		store.updateTodo(this.todo);
		router.navigate('todo-list');
	}
}
