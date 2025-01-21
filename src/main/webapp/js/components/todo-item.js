import { router } from '../router.js';
import { service } from '../service.js';
import { store } from '../store.js';
import { util } from '../util.js';

export class TodoItem extends HTMLElement {

	todo = {};

	async connectedCallback() {
		this.innerHTML = await util.loadTemplate('todo-item');
		let id = this.getAttribute('id');
		if (!id) throw new Error('Missing todo id');
		this.todo = store.getTodo(id);
		if (!this.todo) throw new Error(`Todo with id ${id} not found`);
		util.interpolate(this);
		this.querySelector('#delete').onclick = () => this.#deleteTodo();
	}

	async #deleteTodo() {
		await service.deleteTodo(this.todo.id);
		store.removeTodo(this.todo.id);
		router.navigate('todo-list');
	}
}
