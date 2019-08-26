const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const _ = require('lodash');

const api = supertest(app);

const initialBlogs = [
  {
    title: 'title1',
    author: 'adsf',
    url: 'fdf-tgdfgiimi.fi',
    likes: 5
  },
  {
    title: 'title2',
    author: 'adsf',
    url: 'fdf-tgdfgiimi.fi',
    likes: 15
  }
];

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('identifying field is id instead of _id', async () => {
  const response = await api.get('/api/blogs');
  _.forEach(response.body, blog => {
    expect(blog.id).toBeDefined();
  });
});

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'new blog',
    author: 'fdsa',
    url: 'fdf-tfgiimi.fi',
    likes: 3
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');

  const titles = response.body.map(r => r.title);

  expect(response.body.length).toBe(initialBlogs.length + 1);
  expect(titles).toContain('new blog');
});

test('if likes is undefined set zero likes', async () => {
  const newBlog = {
    title: 'new blog without likes',
    author: 'sdfdfgdfg',
    url: 'fdf-adfdf.fi'
  };

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  expect(response.body.likes).toBe(0);
});

test('blog without title and url is not added', async () => {
  const newBlog = {
    author: 'sdfssdf',
    likes: 3
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400);

  const response = await api.get('/api/blogs');
  expect(response.body.length).toBe(initialBlogs.length);
});

test('deletion succeeds with status code 204', async () => {
  const response = await api.get('/api/blogs');
  const blogsAtStart = response.body;
  const blogToDelete = blogsAtStart[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const response2 = await api.get('/api/blogs');
  const blogsAtEnd = response2.body;

  expect(blogsAtEnd.length).toBe(initialBlogs.length - 1);

  const titles = blogsAtEnd.map(r => r.title);

  expect(titles).not.toContain(blogToDelete.title);
});

afterAll(() => {
  mongoose.connection.close();
});
