const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.findAll({
      include: [{
        attributes: ['id', "content", "title", "created_at"],
        order: [
          ['created_at', 'DESC']
        ],
        include: [{
          model: User,
          attributes: ['username']
        },
      {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: { model: User, attributes: ['username']},
      }]
      }],
    });

    res.status(200).json(dbPostData);
  } catch (err) {
    res.status(400).json(err);
  }
});
// get single post
router.get('/:id', async (req, res) => {
  try {
    const dbPostData = await Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: ['id', 'content', 'title', 'created_at'],
      include: [{
        model: User,
        attributes: ['username'],
      },
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        },
      }]
    });

    if (!dbPostData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(dbPostData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
