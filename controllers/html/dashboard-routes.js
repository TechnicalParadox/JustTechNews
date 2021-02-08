const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', withAuth, (req, res) =>
{
  Post.findAll( // Find all Posts // TODO: replace with a Post function that finds all in descending order and takes in "where:" params
  {
    where: { user_id: req.session.user_id }, // Where Post.user_id matches req.session.user_id
    attributes: // We want the Post.id, .post_url, .title, .created_at, and vote_count
    [
      'id', 'post_url', 'title', 'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
    order: [['created_at', 'DESC']],
    include:
    [
      {
        // We want to JOIN in the Comments attached to the Post with their Comment.id, .comment_text, .post_id, .user_id, and .created_at
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: { model: User, attributes: ['username'] } // We want to JOIN in the User who made the Comment's User.username
      },
      {
        // We want to JOIN in the User.username of the post author
        model: User,
        attributes: ['username']
      }
    ]
  })
  .then(dbPostData =>
  {
    // Serialize the data before passing totemplate
    const posts = dbPostData.map(post => post.get({ plain: true }));
    res.render('dashboard', { posts, loggedIn: true });
  })
  .catch(err => { console.log(err); res.status(500).json(err); });
});

router.get('/edit/:id', withAuth, (req, res) =>
{
  Post.findOne(
  {
    where: { id: req.params.id },
    attributes:
    [
      'id',
      'post_url',
      'title',
      'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
    include:
    [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: { model: User, attributes: ['username'] }
      },
      {
        model: User,
        attributes: ['username']
      }
    ],
    order: [ [ Comment, 'created_at', 'DESC' ] ] // Order included Comments by created_at DESC
  })
  .then(dbPostData =>
  {
    if (!dbPostData) { res.status(404).json({ message: 'No post found with this id' }); return; }

    // Serialize the data
    const post = dbPostData.get({ plain: true });

    // Pass data to template
    res.render('edit-post', { post, loggedIn: req.session.loggedIn });
  })
  .catch(err =>
  {
    console.log(err);
    res.status(500).json(err);
  });
})

module.exports = router;
