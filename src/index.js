const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers

  if (!users.some(user => user.username === username)) {
    return response.status(400).json({ error: 'User not found.' })
  }

  request.username = username

  return next()
}

app.post('/users', (request, response) => {
  const { name, username } = request.body

  if (!name || !username) {
    return response.status(400).json({ error: 'Missing data.' })
  }

  if (users.some(user => user.name === name)) {
    return response.status(400).json({ error: 'User already exists.' })
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user)

  return response.status(201).send()
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request

  const user = users.find(user => user.username === username)

  return response.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body
  const { username } = request

  const todo = { 
    id: uuidv4(),
    title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date()
  }

  const user = users.find(user => user.username === username)

  user.todos.push(todo)

  return response.status(201).send()
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;