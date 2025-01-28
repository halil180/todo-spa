import { TodoItem } from './todo-item.js';
import { service } from '../service.js';
import { store } from '../store.js';

export class TodoList extends HTMLElement {

	static #template = `
		<h1>Todo List</h1>
		<div id="list"></div>
		<a href="#new-todo" class="button primary">New Todo</a>
	`;

	protected = true;

	async connectedCallback() {
		this.innerHTML = TodoList.#template;
		let todos = store.getTodos();
		if (!todos) {
			todos = await service.getTodos();
			store.setTodos(todos);
		}
		this.#renderTodos(todos);
	}

	#renderTodos(todos) {
		let list = this.querySelector('#list');
		list.innerHTML = todos.length === 0  ? 'Nothing to do!' : todos.map(todo => `<todo-item id="${todo.id}"></todo-item>`).join('');
	}

}
