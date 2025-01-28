import { router } from './router.js';

window.onerror = window.onunhandledrejection = event => {
	let error = event.reason || event;
	let message = error instanceof Response ? `Request failed (status ${error.status})` : error;
	document.querySelector('main').innerHTML = `<h1>Unexpected Error</h1><p>${message}</p>`;
};

if (location.hash) router.navigate(location.hash.replace('#', ''));
