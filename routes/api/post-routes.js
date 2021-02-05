const router = require('express').Router();
const { Post, User, Vote, Comment } = require('../../models');
const sequelize = require('../../config/connection');

// get all posts
router.get('/', (req, res) =>
{
  Post.findAll(
  {
    attributes:
    [
      'id', 'post_url', 'title', 'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
    order: [['created_at', 'DESC']],
    include:
    [
      { model: User, attributes: ['username'] },
      {
        model: Comment,
        atrributes: ['id', 'comment_text', 'post_id', 'user_id', 'creaetd_at'],
        include: { model: User, attributes: ['username'] }
      }
    ]
  })
  .then(dbPostData => res.json(dbPostData))
  .catch(err => { console.log(err); res.status(500).json(err); });
});

// create a post
router.post('/', (req, res) =>
{
  // expects {title: 'A B C!', post_url: 'https://w.com/a', user_id: 1}
  Post.create({ title: req.body.title, post_url: req.body.post_url, user_id: req.body.user_id })
  .then(dbPostData => res.json(dbPostData))
  .catch(err => { console.log(err); res.status(500).json(err); });
})

// upvote a post
router.put('/upvote', (req, res) =>
{
  Post.upvote(req.body, { Vote })
  .then(updatedPostData => res.json(updatedPostData))
  .catch(err => { console.log(err); res.status(400).json(err); });
});

// get a single post
router.get('/:id', (req, res) =>
{
  Post.findOne(
  {
    where: { id: req.params.id },
    attributes:
    [
      'id', 'post_url', 'title', 'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
    include: [{ model: User, attributes: ['username'] }]
  })
  .then(dbPostData =>
  {
    if (!dbPostData) { res.status(404).json({ message: 'No post found with this id' }); return; }

    res.json(dbPostData);
  })
  .catch(err => { console.log(err); res.status(500).json(err); });
});

// update a post's title
router.put('/:id', (req, res) =>
{
  Post.update({ title: req.body.title }, { where: { id: req.params.id } })
  .then(dbPostData =>
  {
    if (!dbPostData) { res.status(404).json({ message: 'No post found with this id' }); return; }

    res.json(dbPostData);
  })
  .catch(err => { console.log(err); res.status(500).json(err); });
});

// delete a post
router.delete('/:id', (req, res) =>
{
  Post.destroy({ where: { id: req.params.id } })
  .then(dbPostData =>
  {
    if (!dbPostData) { res.status(404).json({ message: 'No post found with this id' }); return; }

    res.json(dbPostData)
  })
  .catch(err => { console.log(err); res.status(500).json(err); });
});

module.exports = router;
