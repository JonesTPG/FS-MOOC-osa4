const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', (request, response, next) => {
  Blog.find({})
    .then(blogs => {
      response.json(blogs.map(blog => blog.toJSON()));
    })
    .catch(error => next(error));
});

blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body);
  if (blog.likes == undefined) {
    blog.likes = 0;
  }
  if (blog.title == undefined || blog.url == undefined) {
    response.status(400).send({ error: 'malformatted blog' });
    return;
  }
  try {
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog.toJSON());
  } catch (e) {
    next(e);
  }
});

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.put('/:id', async (request, response, next) => {
  const { body } = request;
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  };

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true
    });
    response.json(updatedBlog.toJSON());
  } catch (e) {
    next(e);
  }
});

module.exports = blogsRouter;
