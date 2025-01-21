package org.todo.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebFilter("/api/*")
public class MediaTypeFilter extends HttpFilter {

	private static final String JSON_MEDIA_TYPE = "application/json";

	@Override
	public void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		String header = request.getHeader("Accept");
		if (header != null && !header.contains("*/*") && !header.contains(JSON_MEDIA_TYPE)) {
			response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
			return;
		}
		if (request.getMethod().equals("POST") || request.getMethod().equals("PUT")) {
			if (request.getContentType() == null || !request.getContentType().contains(JSON_MEDIA_TYPE)) {
				response.setStatus(HttpServletResponse.SC_UNSUPPORTED_MEDIA_TYPE);
				return;
			}
		}
		chain.doFilter(request, response);
	}
}
