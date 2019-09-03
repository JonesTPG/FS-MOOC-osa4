const jwt = require('jsonwebtoken');
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', (request, response, next) => {
  Blog.find({})
    .populate('user', { username: 1, name: 1 })
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
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' });
    }

    const user = await User.findById(decodedToken.id);
    blog.user = user._id;

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog.toJSON());
  } catch (e) {
    next(e);
  }
});

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' });
    }

    const blog = await Blog.findById(request.params.id);

    if (blog == null) {
      return response.status(404).json({ error: 'blog was not found' });
    }

    if (decodedToken.id !== blog.user.toString()) {
      return response
        .status(401)
        .json({ error: 'you do not have permissions to delete this blog' });
    }

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
