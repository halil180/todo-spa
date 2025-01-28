const TEMPLATES_ROOT = 'templates/';

export const util = {
	loadTemplate: async function(name) {
		let response = await fetch(TEMPLATES_ROOT + name + '.html');
		if (!response.ok) throw response;
		return response.text();
	},
	/* Bind the values of input elements with attributes such as 'data-model=x.y.z' to the referenced component properties */
	bindData: function(component) {
		component.querySelectorAll('input[data-model]').forEach(element => {
			let reference = element.getAttribute('data-model');
			let [object, key] = resolve(component, reference);
			if (object[key]) setInputValue(element, object[key]);
			element.oninput = () => object[key] = getInputValue(element);
		});
	},
	/* Replace placeholders such as '{{x.y.z}}' in the HTML with the values of the referenced component properties */
	interpolate: function(component) {
		component.innerHTML = component.innerHTML.replace(/{{([\w.]+)}}/g, (placeholder, reference) => {
			let [object, key] = resolve(component, reference);
			return object[key] || '';
		});
	}
}

/* Resolve a reference such as 'x.y.z' and return the object component[x][y] and the property key z */
function resolve(component, reference) {
	let keys = reference.split('.');
	let key = keys.pop();
	let object = component;
	keys.forEach(key => object = object[key] || {});
	return [object, key];
}

function getInputValue(element) {
	switch (element.type) {
		case 'number': return Number(element.value);
		case 'checkbox': return element.checked;
		default: return element.value;
	}
}

function setInputValue(element, value) {
	switch (element.type) {
		case 'checkbox': element.checked = value; break;
		case 'radio': element.checked = element.value == value; break;
		default: element.value = value;
	}
}
