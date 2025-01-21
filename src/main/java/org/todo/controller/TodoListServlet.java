package org.todo.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.todo.model.todo.Todo;
import org.todo.model.todo.TodoList;
import org.todo.model.todo.TodoNotFoundException;
import org.todo.model.user.User;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet("/api/todos/*")
public class TodoListServlet extends HttpServlet {

	private static final String JSON_MEDIA_TYPE = "application/json";
	private static final ObjectMapper objectMapper = ObjectMapperFactory.createObjectMapper();

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		TodoList todoList = ((User) request.getAttribute("user")).getTodoList();

		// evaluate request path
		String pathInfo = request.getPathInfo();
		if (pathInfo == null || pathInfo.equals("/")) {
			String category = request.getParameter("category");
			List<Todo> todos = category == null ? todoList.getTodos() : todoList.getTodos(category);
			response.setStatus(HttpServletResponse.SC_OK);
			response.setContentType(JSON_MEDIA_TYPE);
			objectMapper.writeValue(response.getOutputStream(), todos);
		} else try {
			int id = Integer.parseInt(pathInfo.substring(1));
			Todo todo = todoList.findTodo(id);
			response.setStatus(HttpServletResponse.SC_OK);
			response.setContentType(JSON_MEDIA_TYPE);
			objectMapper.writeValue(response.getOutputStream(), todo);
		} catch (NumberFormatException | TodoNotFoundException ex) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
		}
	}

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
		TodoList todoList = ((User) request.getAttribute("user")).getTodoList();

		// verify request path
		if (request.getPathInfo() != null && !request.getPathInfo().equals("/")) {
			response.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
			return;
		}
		try {
			// parse and validate todo
			Todo todo = objectMapper.readValue(request.getInputStream(), Todo.class);
			if (todo.getId() != null || todo.getTitle() == null || todo.getTitle().isEmpty()) {
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				return;
			}
			todoList.addTodo(todo);
			response.setStatus(HttpServletResponse.SC_CREATED);
			response.setHeader("Location", request.getRequestURI() + "/" + todo.getId());
			response.setContentType(JSON_MEDIA_TYPE);
			objectMapper.writeValue(response.getOutputStream(), todo);
		} catch (JsonProcessingException ex) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
		}
	}

	@Override
	public void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
		TodoList todoList = ((User) request.getAttribute("user")).getTodoList();
		try {
			// get path parameter
			String pathInfo = request.getPathInfo();
			if (pathInfo == null || pathInfo.equals("/")) {
				response.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
				return;
			}
			int id = Integer.parseInt(pathInfo.substring(1));

			// parse and validate todo
			Todo todo = objectMapper.readValue(request.getInputStream(), Todo.class);
			if (todo.getId() == null || todo.getId() != id || todo.getTitle() == null || todo.getTitle().isEmpty()) {
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				return;
			}
			todoList.updateTodo(todo);
			response.setStatus(HttpServletResponse.SC_OK);
			response.setContentType(JSON_MEDIA_TYPE);
			objectMapper.writeValue(response.getOutputStream(), todo);
		} catch (JsonProcessingException ex) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
		} catch (NumberFormatException | TodoNotFoundException ex) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
		}
	}

	@Override
	public void doDelete(HttpServletRequest request, HttpServletResponse response) {
		TodoList todoList = ((User) request.getAttribute("user")).getTodoList();
		try {
			// get path parameter
			String pathInfo = request.getPathInfo();
			if (pathInfo == null || pathInfo.equals("/")) {
				response.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
				return;
			}
			int id = Integer.parseInt(pathInfo.substring(1));
			todoList.removeTodo(id);
			response.setStatus(HttpServletResponse.SC_NO_CONTENT);
		} catch (NumberFormatException | TodoNotFoundException ex) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
		}
	}
}
