CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    team VARCHAR(100) NOT NULL,
    line_manager VARCHAR(100) NOT NULL,
    github_username VARCHAR(100) UNIQUE
);

CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    sprint VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_to INT REFERENCES employees(id)
);

INSERT INTO employees (first_name, last_name, team, line_manager) VALUES
('Alice', 'Johnson', 'Development', 'Bob Smith'),
('Charlie', 'Brown', 'Development', 'Bob Smith'),
('David', 'Wilson', 'QA', 'Eve Davis'),
('Fiona', 'Garcia', 'QA', 'Eve Davis');

INSERT INTO tickets (title, description, sprint, status, assigned_to) VALUES
('Implement login feature', 'Create a login page with authentication', 'Sprint 1', 'In Progress', 1),
('Fix bug in payment processing', 'Resolve the issue causing payment failures', 'Sprint 1', 'To Do', 2),
('Write unit tests for user module', 'Ensure all functions in user module are covered by tests', 'Sprint 1', 'In Review', 3),
('Update documentation for API', 'Add new endpoints to the API documentation', 'Sprint 1', 'Done', 4);
