const express = require("express");
const {
  getAllVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  getVideoDetails,
  createVideoReview,
  getVideoReviews,
  deleteReview,
  getAdminVideos,
} = require("../controllers/videoController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/videos").get(getAllVideos);
router.route("/admin/videos").get(isAuthenticatedUser, getAdminVideos);
router
  .route("/video/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createVideo);
router
  .route("/video/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateVideo)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteVideo);

router.route("/video/:id").get(getVideoDetails);
router.route("/review").put(isAuthenticatedUser, createVideoReview);
router
  .route("/reviews")
  .get(getVideoReviews)
  .delete(isAuthenticatedUser, deleteReview);

module.exports = router;
