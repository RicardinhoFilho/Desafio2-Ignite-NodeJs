const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

//middlewares
function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  //console.log(username);
  const userExist = users.find((user) => user.username === username);

  if (!userExist) {
    return response.status(400).json({ error: "Invalid User!" });
  }

  request.user = userExist;

  return next();
}

function checksCreateTodosAvailability(request, response, next) {
  const { user } = request;

  if (user.account == false) {
    let cont = 0;

    if (user.todos.length >= 10) {
      return response
        .status(401)
        .json({ error: "Para criar mais Todos você deve aumentar seu plano!" });
    }
  }
  request.user = user;
  return next();
}

function findById(request, response, next) {
  const { id } = request.headers;
  console.log(id);
  const userExist = users.find((user) => user.id === id);

  if (!userExist) {
    return response.status(400).json({ error: "Invalid User!" });
  }

  request.user = userExist;

  return next();
}

function checksTodoExists(request, response, next) {
  const { username } = request.headers;
  const { id } = request.params;
  //console.log(username);
  const userExist = users.find((user) => user.username === username);

  if (!userExist) {
    return response.status(400).json({ error: "Invalid User!" });
  }

  if (id.length < 32) {
    return response.status(400).json({ error: "Invalid Id!" });
  }

  const checksTodoExists = userExist.todos.find((todo) => todo.id == id);

  if (!checksTodoExists) {
    return response.status(400).json({ error: `Todo ${id} don't exist!` });
  }

  request.todo = checksTodoExists;

  return next();
}

/*--------------------------------------------------------------------------------------------------- */
app.post("/users", (request, response) => {
  const { name, username, account } = request.body;
  const userExist = users.find((user) => user.username === username);

  if (userExist) {
    return response.status(400).json({ error: "User already exist" });
  }

  const id = uuidv4();

  users.push({
    username,
    name,
    id,
    account,
    todos: [],
  });

  console.log(users);
  return response.status(201).json("User Created!");
});

app.get("/todos", findById, (request, response) => {
  const { user } = request;
  const todos = user.todos;

  response.status(200).json(todos);
});

app.get("/todos/:id", checksTodoExists, (request, response) => {
  
  const {todo} = request;

  response.status(200).json(todo);
});

app.post(
  "/todos",
  checksExistsUserAccount,
  checksCreateTodosAvailability,
  (request, response) => {
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
  }
);

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
  const { id } = request.params;
  const { user } = request;

  console.log(id);

  const filterTodo = user.todos.filter((todo) => todo.id == id);
  user.todos.splice(filterTodo, 1);
  return response.status(200).json(user.todos);
});

module.exports = app;
