const data = {};

export const store = {
	setUser: function(user) {
		console.log('Set user in store');
		data.user = user;
	},
	getUser: function() {
		console.log('Get user from store');
		return data.user;
	},
	setTodos: function(todos) {
		console.log('Set todos in store');
		data.todos = todos;
	},
	getTodos: function() {
		console.log('Get todos from store');
		return data.todos;
	},
	getTodo: function(id) {
		console.log(`Get todo ${id} from store`);
		return data.todos && data.todos.find(todo => todo.id == id);
	},
	addTodo: function(todo) {
		console.log(`Add todo ${todo.id} to store`);
		data.todos.push(todo);
	},
	updateTodo: function(todo) {
		console.log(`Update todo ${todo.id} in store`);
		Object.assign(this.getTodo(todo.id), todo);
	},
	removeTodo: function(id) {
		console.log(`Remove todo ${id} from store`);
		data.todos = data.todos.filter(todo => todo.id != id);
	},
	clear: function() {
		console.log('Clear store');
		Object.keys(data).forEach(key => delete data[key]);
	}
};
