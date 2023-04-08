const jsonServer = require('json-server');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const fs = require('fs');

const PORT = 3500;

server.use(middlewares);
server.use(jsonServer.bodyParser);

let db = require('./data/db.json');

server.get('/todos', (req, res) => {  
  res.json(db.todos);
});

server.patch('/todos/toggle_all', (req, res) => {
  db.todos.forEach((todo) => {
    todo.completed = !req.body.completed;
  });

  fs.writeFileSync('./data/db.json', JSON.stringify(db));

  res.json(db.todos);
});

server.patch('/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    const todoIndex = db.todos.findIndex((todo) => todo.id === todoId);
  
    if (todoIndex !== -1) {
      
      db.todos[todoIndex] = { ...db.todos[todoIndex], completed:!db.todos[todoIndex].completed};
      fs.writeFileSync('./data/db.json', JSON.stringify(db));
      res.json(db.todos[todoIndex]);
    } else {
      res.status(404).json({ message: 'Todo not found' });
    }
  });
  
  server.delete('/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    const todoIndex = db.todos.findIndex((todo) => todo.id === todoId);
  
    if (todoIndex !== -1) {
      db.todos.splice(todoIndex, 1);
      fs.writeFileSync('./data/db.json', JSON.stringify(db));
      res.json(db.todos);
    } else {
      res.status(404).json({ message: 'Todo not found' });
    }
  });
  
  server.post('/todos', (req, res) => {
    const newTodo = { ...req.body,id: db.todos.length + 1, };
    db.todos.push(newTodo);
    fs.writeFileSync('./data/db.json', JSON.stringify(db));
    res.json(newTodo);
  });

  server.delete('/todos', (req, res) => {
    db.todos = [];
    fs.writeFileSync('./data/db.json', JSON.stringify(db));
    res.json(db.todos);
  });

server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
});
