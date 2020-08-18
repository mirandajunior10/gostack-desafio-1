const express = require('express');
const cors = require('cors');
const uuid = require('uuid');

// const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid.v4(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(repository);
  return response.json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const id = request.params.id;

  const repository = repositories.find((repository) => repository.id === id);

  if (!repository) {
    return response.status(400).json({ message: 'Repository not found' });
  }
  const { title, url, techs } = request.body;

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const id = request.params.id;

  let index = repositories.findIndex((repository) => repository.id === id);

  if (index >= 0) {
    repositories.splice(index, 1);
    return response.status(204).json({ message: 'Repository deleted.' });
  } else return response.status(400).json({ message: 'Repository not found.' });
});

app.post('/repositories/:id/like', (request, response) => {
  const id = request.params.id;
  let index = repositories.findIndex((repository) => repository.id === id);

  if (index < 0) {
    return response.status(400).json({ message: 'Repository not found' });
  }
  const repository = repositories[index];

  repository.likes += 1;
  repositories[index] = repository;

  return response.json(repository);
});

module.exports = app;
