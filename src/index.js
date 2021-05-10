const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  console.log(username);
  const userExist = users.find((user) => user.username === username);

  if (!userExist) {
    return response.status(400).json({ error: "Invalid User!" });
  }

  request.user = userExist;

  return next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;
  const userExist = users.find((user) => user.username === username);

  if (userExist) {
    return response.status(400).json({ error: "User already exist" });
  }

  const id = uuidv4();

  users.push({
    username,
    name,
    id,
    todos: [],
  });

  console.log(users);
  return response.status(201).json("User Created!");
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const todos = user.todos;

  response.status(200).json(todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { title } = request.body;
  const { user } = request;

  const todo = {
    title,
    done: false,
    deadline: new Date(),
    created_at: new Date(),
    id: uuidv4(),
  };
  user.todos.push(todo);

  return response.status(201).json(user);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { title } = request.body;
  const id = request.params.id;
  const { user } = request;

  const updatedTodo = user.todos.map((todo) => {
    if (todo.id == id) {
      todo.deadline = new Date();
      todo.title = title;

      return response.status(201).json(todo);
    }
  });

  return response.status(400).json({ error: "invalid operation" });
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;
  const finalizeTodo = user.todos.map((todo) => {
    if (todo.id == id) {
      todo.deadline = new Date();
      todo.done = true;

      return response.status(201).json(todo);
    }
  });

  return response.status(400).json({ error: "Invalid Operation" });
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
    const {id} = request.params;
    const {user} = request;

    console.log(id)

    const filterTodo = user.todos.filter((todo)=> todo.id == id);
    user.todos.splice(filterTodo,1)
    return response.status(200).json(user.todos);
});

module.exports = app;
