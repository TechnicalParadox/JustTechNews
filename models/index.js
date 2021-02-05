const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');
const Comment = require('./Comment');

// Create associations

// User to User's Posts association
User.hasMany(Post,
{
  foreignKey: 'user_id'
});
Post.belongsTo(User,
{
  foreignKey: 'user_id'
});

// User <- Vote -> Post association
User.belongsToMany(Post, { through: Vote, as: 'voted_posts', foreignKey: 'user_id' }); // Users link to Post IF Votes.post_id = Posts.id AND Votes.user_id = Users.id
Post.belongsToMany(User, { through: Vote, as: 'voted_posts', foreignKey: 'post_id' }); // Posts link to User IF Votes.user_id = Users.id AND Votes.post_id = Posts.id

// Vote associations
Vote.belongsTo(User, { foreignKey: 'user_id' }); // votes belong to user with id that matches vote.user_id
Vote.belongsTo(Post, { foreignKey: 'post_id' }); // votes belong to post with id that matches vote.post_id
User.hasMany(Vote, { foreignKey: 'user_id' }); // user has many votes where vote.user_id = user.id
Post.hasMany(Vote, { foreignKey: 'post_id' }); // post has many votes where vote.post_id = post.id

// Comment associations
Comment.belongsTo(User, { foreignKey: 'user_id' }); // comments belong to user with id that matches comment.user_id
Comment.belongsTo(Post, { foreignKey: 'post_id' }); // comments belong to post with id that matches comment.post_id
User.hasMany(Comment, { foreignKey: 'user_id' }); // user has many comments where comment.user_id = user.id
Post.hasMany(Comment, { foreignKey: 'post_id' }); // post has many comments where comment.post_id = post.id

module.exports = { User, Post, Vote, Comment };
