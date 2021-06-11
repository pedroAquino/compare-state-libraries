/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import { v4 as uuidv4 } from 'uuid';
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to api!' });
});

app.get('/api/columns', async (req, res) => {
  const db =  new JsonDB(new Config("data", true, false, '/'));
  const columns = db.getData('/data/columns');
  res.send(columns);
});

app.get('/api/columns/:id/tasks', (req, res) => {
  const columnId = req.params.id;
  const db =  new JsonDB(new Config('data', true, false, '/'));
  const tasks = db
    .getData('/data/tasks')
    .filter(task => task.columnId === columnId);
  res.send(tasks);
});

app.post('/api/columns/:id/tasks', (req, res) => {
  const columnId = req.params.id;
  const task  = req.body;
  task.columnId = columnId;
  task.id = uuidv4();
  const db =  new JsonDB(new Config('data', true, false, '/'));
  db.push('/data/tasks[]', task, true);
  res.send(task);
});

app.put('/api/columns/:id/tasks/:taskId', (req, res) => {
  const id = req.params.taskId;
  const columnId = req.params.id;
  const task  = req.body;
  task.columnId = columnId;
  task.id = id;
  const db =  new JsonDB(new Config('data', true, false, '/'));
  const index = db.getIndex('/data/tasks', id);
  db.push('/data/tasks[]', task, true);
  db.delete(`/data/tasks[${index}]`);
  res.send(task);
});

app.delete('/api/columns/:id/tasks/:taskId', (req, res) => {
  const id = req.params.taskId;
  const db =  new JsonDB(new Config('data', true, false, '/'));
  const index = db.getIndex('/data/tasks', id);
  const task = db.getData('/data/tasks').find(task => task.id === id);
  db.delete(`/data/tasks[${index}]`);
  db.save();
  res.send(task);
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
