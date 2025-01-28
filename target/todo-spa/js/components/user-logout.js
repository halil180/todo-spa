import { store } from '../store.js';

export class UserLogout extends HTMLElement {

	static #template = `
		<h1>Logout</h1>
		<p>You have successfully logged out</p>
	`;

	protected = true;

	connectedCallback() {
		this.innerHTML = UserLogout.#template;
		store.clear();
	}
}
