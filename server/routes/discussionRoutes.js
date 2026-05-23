const express = require('express');
const router = express.Router();
const {
  getPosts, addPost, likePost,
  dislikePost, addReply, deletePost
} = require('../controllers/discussionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:trackId', protect, getPosts);
router.post('/:trackId', protect, addPost);
router.put('/:id/like', protect, likePost);
router.put('/:id/dislike', protect, dislikePost);
router.post('/:id/reply', protect, addReply);
router.delete('/:id', protect, deletePost);

module.exports = router;