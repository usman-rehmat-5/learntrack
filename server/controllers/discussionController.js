const Discussion = require('../models/Discussion');

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Discussion.find({ trackId: req.params.trackId })
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add post
exports.addPost = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Discussion.create({
      trackId: req.params.trackId,
      userId: req.user.id,
      author: req.user.name,
      content
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Like post
exports.likePost = async (req, res) => {
  try {
    const post = await Discussion.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Dislike post
exports.dislikePost = async (req, res) => {
  try {
    const post = await Discussion.findByIdAndUpdate(
      req.params.id,
      { $inc: { dislikes: 1 } },
      { new: true }
    );
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add reply
exports.addReply = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Discussion.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.replies.push({
      userId: req.user.id,
      author: req.user.name,
      content
    });
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    await Discussion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};