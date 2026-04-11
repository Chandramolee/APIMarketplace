const Api = require('../models/Api');
const Review = require('../models/Review');

const getApis = async (req, res) => {
  const { keyword, category, rating, sort } = req.query;
  
  let query = {};
  
  // Search using $text or regex if $text doesn't work well with partials
  if (keyword) {
    query.$text = { $search: keyword };
  }
  
  if (category && category !== 'All') {
    query.category = category;
  }
  
  try {
    // We need to aggregate to compute avg rating
    const aggregatePipeline = [];
    
    if (Object.keys(query).length > 0) {
      aggregatePipeline.push({ $match: query });
    }
    
    // Lookup reviews
    aggregatePipeline.push({
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'api',
        as: 'reviews'
      }
    });

    aggregatePipeline.push({
      $addFields: {
        avgRating: { 
          $ifNull: [{ $avg: "$reviews.rating" }, 0] 
        },
        reviewCount: { $size: "$reviews" }
      }
    });

    if (rating) {
      aggregatePipeline.push({ $match: { avgRating: { $gte: Number(rating) } } });
    }

    // Sort logic
    let sortObj = { createdAt: -1 }; // newest
    if (sort === 'top_rated') {
      sortObj = { avgRating: -1, reviewCount: -1 };
    } else if (sort === 'most_reviewed') {
      sortObj = { reviewCount: -1, avgRating: -1 };
    }

    aggregatePipeline.push({ $sort: sortObj });

    // We still need creator info populated. $lookup creator
    aggregatePipeline.push({
      $lookup: {
        from: 'users',
        localField: 'creator',
        foreignField: '_id',
        as: 'creatorInfo'
      }
    });
    
    aggregatePipeline.push({
      $addFields: {
        creator: { $arrayElemAt: ["$creatorInfo", 0] }
      }
    });

    // Clean up unnecessary fields
    aggregatePipeline.push({
      $project: {
        reviews: 0,
        creatorInfo: 0,
        "creator.password": 0,
        "creator.email": 0
      }
    });

    const apis = await Api.aggregate(aggregatePipeline);
    res.json(apis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getApiById = async (req, res) => {
  try {
    const api = await Api.findById(req.params.id).populate('creator', 'name');

    if (api) {
      // Let's compute avg rating just for this one
      const reviews = await Review.find({ api: api._id });
      const avgRating = reviews.length > 0 
        ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length 
        : 0;
        
      res.json({ ...api.toObject(), avgRating, reviewCount: reviews.length });
    } else {
      res.status(404).json({ message: 'API not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createApi = async (req, res) => {
  const { name, description, category, endpoint, exampleRequest, exampleResponse, tags, docsLink } = req.body;

  try {
    const api = new Api({
      name,
      description,
      category,
      endpoint,
      creator: req.user._id,
      exampleRequest,
      exampleResponse,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      docsLink,
      status: 'pending' // Submissions from users are pending
    });

    const createdApi = await api.save();
    res.status(201).json(createdApi);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getApis, getApiById, createApi };
