const Video = require("../models/videoModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");

//create video--Admin

exports.createVideo = catchAsyncErrors(async (req, res, next) => {
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }
  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "videos",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;
  const video = await Video.create(req.body);
  res.status(201).json({ success: true, video });
});
// get all videos
exports.getAllVideos = catchAsyncErrors(async (req, res) => {
  const resultPerPage = 8;
  const videosCount = await Video.countDocuments();
  const apiFeature = new ApiFeatures(Video.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const videos = await apiFeature.query;
  res.status(200).json({
    success: true,
    videos,
    videosCount,
  });
});

// get video detail
exports.getVideoDetails = catchAsyncErrors(async (req, res, next) => {
  const video = await Video.findById(req.params.id);
  if (!video) {
    return next(new ErrorHandler("video not found", 404));
  }
  res.status(200).json({
    status: true,
    video,
  });
});

//update video --Admin

exports.updateVideo = catchAsyncErrors(async (req, res, next) => {
  let video = Video.findById(req.params.id);
  if (!video) {
    return next(new ErrorHandler("video not found", 404));
  }
  video = await Video.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });
  res.status(200).json({
    success: true,
    video,
  });
});

// Delete a video --admin
exports.deleteVideo = catchAsyncErrors(async (req, res, next) => {
  const video = await Video.findById(req.params.id);
  if (!video) {
    return next(new ErrorHandler("video not found", 404));
  }
  await video.remove();
  res.status(200).json({
    status: true,
    message: "video deleted",
  });
});
// Create New Review or Update the review
exports.createVideoReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, videoId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const video = await Video.findById(videoId);

  const isReviewed = video.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    video.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    video.reviews.push(review);
    video.numOfReviews = video.reviews.length;
  }

  let avg = 0;

  video.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  video.ratings = avg / video.reviews.length;

  await video.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});
//get all video reviews
exports.getVideoReviews = catchAsyncErrors(async (req, res, next) => {
  const video = await Video.findById(req.query.id);
  if (!video) {
    return next(new ErrorHandler("Video not found", 400));
  }
  res.status(200).json({
    success: true,
    reviews: video.reviews,
  });
});

//delete review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const video = await Video.findById(req.query.videoId);

  if (!video) {
    return next(new ErrorHandler("video not found", 404));
  }

  const reviews = video.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Video.findByIdAndUpdate(
    req.query.videoId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});

// Get All Video --(Admin)
exports.getAdminVideos = catchAsyncErrors(async (req, res, next) => {
  const videos = await Video.find();

  res.status(200).json({
    success: true,
    videos,
  });
});
