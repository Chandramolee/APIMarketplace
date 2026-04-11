const Review = require('../models/Review');
const Api = require('../models/Api');

const addReview = async (req, res) => {
  const { apiId, rating, comment } = req.body;

  try {
    const api = await Api.findById(apiId);

    if (!api) {
      return res.status(404).json({ message: 'API not found' });
    }

    const review = new Review({
      api: apiId,
      user: req.user._id,
      rating: Number(rating),
      comment,
    });

    const createdReview = await review.save();
    const populatedReview = await Review.findById(createdReview._id).populate('user', 'name');
    
    res.status(201).json(populatedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getReviewsForApi = async (req, res) => {
  try {
    const reviews = await Review.find({ api: req.params.apiId }).populate('user', 'name').sort('-createdAt');
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

    review.rating = Number(rating) || review.rating;
    review.comment = comment || review.comment;

    const updatedReview = await review.save();
    res.json(updatedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

    await review.deleteOne();
    res.json({ message: 'Review removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addReview, getReviewsForApi, updateReview, deleteReview };
