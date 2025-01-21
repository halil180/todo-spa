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
		if (todos.length === 0)
			list.innerHTML = 'Nothing to do!';
		else todos.forEach(todo => {
			let item = new TodoItem();
			item.setAttribute('id', todo.id);
			list.append(item);
		});
	}
}
