package org.todo.model.todo;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.logging.Logger;

public class TodoList {

	private static final Logger logger = Logger.getLogger(TodoList.class.getName());
	private final List<Todo> todos = new ArrayList<>();
	private int lastId = 0;

	public List<Todo> getTodos() {
		return todos;
	}

	public List<Todo> getTodos(String category) {
		return todos.stream().filter(todo -> Objects.equals(todo.getCategory(), category)).toList();
	}

	public Todo findTodo(int id) throws TodoNotFoundException {
		return todos.stream().filter(todo -> Objects.equals(todo.getId(), id)).findFirst()
				.orElseThrow(TodoNotFoundException::new);
	}

	public void addTodo(Todo todo) {
		todo.setId(++lastId);
		todos.add(todo);
		logger.info("Todo " + todo.getId() + " added");
	}

	public void updateTodo(Todo todo) throws TodoNotFoundException {
		Todo oldTodo = findTodo(todo.getId());
		oldTodo.setTitle(todo.getTitle());
		oldTodo.setCategory(todo.getCategory());
		oldTodo.setDueDate(todo.getDueDate());
		oldTodo.setCompleted(todo.isCompleted());
		logger.info("Todo " + todo.getId() + " updated");
	}

	public void removeTodo(int id) throws TodoNotFoundException {
		Todo todo = findTodo(id);
		todos.remove(todo);
		logger.info("Todo " + todo.getId() + " removed");
	}
}
