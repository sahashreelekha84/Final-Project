const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bannerSchema = new Schema(
  {
    // Main title & subtitle
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },

    // Background image & overlay

      image: {
        type: String,
        required: true,
      },
      overlay: {
        type: Boolean,
        default: true,
      },
 

    // Video section
    video: {
      href: {
        type: String,
        required: false,
      },
      text: {
        type: String,
        default: "See Workout Video",
      },
      iconClass: {
        type: String,
        default: "fa fa-play",
      },
    },


    // Boxes (array of services/features)
    boxes: [
      {
        icon: { type: String, required: true },
        title: { type: String, required: true },
        text: { type: String, required: true },
        link: { type: String, default: "#" },
      },
    ],

    // Soft delete flag
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const BannerModel = mongoose.model("Banner", bannerSchema);
module.exports = BannerModel;
