const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true,
    maxlength: [100, 'Lesson title cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Lesson content is required']
  },
  videoUrl: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional field
        return /^https?:\/\//.test(v);
      },
      message: 'Video URL must be a valid URL'
    }
  },
  duration: {
    type: Number,
    min: [1, 'Duration must be at least 1 minute']
  },
  order: {
    type: Number,
    required: true,
    min: 1
  },
  isPreview: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [200, 'Course title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    trim: true,
    maxlength: [2000, 'Course description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    trim: true,
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },
  thumbnail: {
    type: String,
    required: [true, 'Course thumbnail is required']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Instructor is required']
  },
  category: {
    type: String,
    required: [true, 'Course category is required'],
    enum: {
      values: [
        'Programming',
        'Data Science',
        'Web Development',
        'Mobile Development',
        'DevOps',
        'Cybersecurity',
        'AI/ML',
        'Design',
        'Business',
        'Marketing',
        'Other'
      ],
      message: 'Please select a valid category'
    }
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: {
      values: ['Beginner', 'Intermediate', 'Advanced'],
      message: 'Please select a valid difficulty level'
    }
  },
  price: {
    type: Number,
    required: [true, 'Course price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    validate: {
      validator: function(v) {
        return !v || v >= this.price;
      },
      message: 'Original price must be greater than or equal to current price'
    }
  },
  lessons: [lessonSchema],
  tags: [{
    type: String,
    trim: true
  }],
  requirements: [{
    type: String,
    trim: true
  }],
  whatYouWillLearn: [{
    type: String,
    trim: true
  }],
  language: {
    type: String,
    default: 'English'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  enrollmentCount: {
    type: Number,
    default: 0,
    min: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: [500, 'Review comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total duration
courseSchema.virtual('totalDuration').get(function() {
  return this.lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0);
});

// Virtual for lesson count
courseSchema.virtual('lessonCount').get(function() {
  return this.lessons.length;
});

// Virtual for discount percentage
courseSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Update lastUpdated before saving
courseSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastUpdated = new Date();
  }
  next();
});

// Calculate average rating when reviews change
courseSchema.pre('save', function(next) {
  if (this.isModified('reviews') && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating.average = (totalRating / this.reviews.length).toFixed(1);
    this.rating.count = this.reviews.length;
  }
  next();
});

// Indexes for search and filtering
courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ category: 1 });
courseSchema.index({ difficulty: 1 });
courseSchema.index({ price: 1 });
courseSchema.index({ 'rating.average': -1 });
courseSchema.index({ enrollmentCount: -1 });
courseSchema.index({ instructor: 1 });

module.exports = mongoose.model('Course', courseSchema);