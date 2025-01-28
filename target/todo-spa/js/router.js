import { UserLogin } from './components/user-login.js';
import { TodoList } from './components/todo-list.js';
import { TodoItem } from './components/todo-item.js';
import { NewTodo } from './components/new-todo.js';
import { EditTodo } from './components/edit-todo.js';
import { UserLogout } from './components/user-logout.js';
import { store } from './store.js';

customElements.define('user-login', UserLogin);
customElements.define('todo-list', TodoList);
customElements.define('todo-item', TodoItem);
customElements.define('new-todo', NewTodo);
customElements.define('edit-todo', EditTodo);
customElements.define('user-logout', UserLogout);

export const router = {
	navigate: function(uri) {
		if (uri === location.hash.replace('#', ''))
			navigate(uri);
		else location.hash = uri;
	}
};

window.onhashchange = () => navigate(location.hash.replace('#', ''));

function navigate(uri) {
	console.log(`Navigate to ${uri}`);
	let component = createComponent(uri);
	if (component.protected && !store.getUser()) {
		router.navigate('user-login?uri=' + encodeURIComponent(uri));
	} else {
		showComponent(component);
	}
}

/* Create a component from a URI such as 'name?x=a&y=b' and set the attributes according to the query parameters */
function createComponent(uri) {
	let [name, query] = uri.split('?');
	let component = document.createElement(name);
	if (query) {
		query.split('&').forEach(parameter => {
			let [name, value] = parameter.split('=');
			component.setAttribute(name, value);
		});
	}
	return component;
}

function showComponent(component) {
	document.querySelector('main').replaceChildren(component);
	document.querySelector('footer').innerHTML = '';
	let nav = document.querySelector('nav');
	if (component instanceof UserLogin)
		nav.innerHTML = '';
	else if (component instanceof UserLogout)
		nav.innerHTML = '<a href="#user-login">Home</a>';
	else nav.innerHTML = `User ${store.getUser().name} | <a href="#user-logout">Logout</a>`;
}
