var _ = require('lodash');

const dummy = blogs => {
  return 1;
};

const totalLikes = blogs => {
  const reducer = (accumulator, blog) => accumulator + blog.likes;
  return blogs.reduce(reducer, 0);
};

const favoriteBlog = blogs => {
  let favorite;
  let maxLikes = 0;
  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].likes > maxLikes) {
      favorite = blogs[i];
      maxLikes = blogs[i].likes;
    }
  }

  let favoriteObject = {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  };

  return favoriteObject;
};

const authorWithMostBlogs = blogs => {
  var authorArray = _.map(blogs, 'author');
  var mostCommonAuthor = _.chain(authorArray)
    .countBy()
    .toPairs()
    .max(_.last)
    .head()
    .value();
  return mostCommonAuthor;
};

const favoriteBlogger = blogs => {
  let authorTotalLikeArray = [];
  _.forEach(_.groupBy(blogs, 'author'), (value, key) => {
    authorTotalLikeArray.push({
      author: key,
      likes: totalLikes(value)
    });
  });
  return _.orderBy(authorTotalLikeArray, ['likes'], ['desc'])[0];
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  authorWithMostBlogs,
  favoriteBlogger
};
