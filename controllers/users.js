const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');
const validate = require('../utils/validate');

usersRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body;

    if (!validate.validateUser(body.username, body.password)) {
      return response
        .status(400)
        .send({ message: 'username or password is too short.' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash
    });

    const savedUser = await user.save();

    response.json(savedUser);
  } catch (exception) {
    next(exception);
  }
});

usersRouter.get('/', async (request, response, next) => {
  User.find({})
    .populate('blogs')
    .then(users => {
      response.json(users.map(user => user.toJSON()));
    })
    .catch(error => next(error));
});

module.exports = usersRouter;
