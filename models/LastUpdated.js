import mongoose from "mongoose";

const LastUpdatedSchema = new mongoose.Schema({
  site_title: String,
  siteurl: String,
  data: {
    last_updated: {
      page: {
        date: String,
        link: String,
        title: String,
      },
      notice: {
        date: String,
        link: String,
        title: String,
      }
    }
  },
  fetchedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now  // Optional default
  }
});

export default mongoose.model("LastUpdated", LastUpdatedSchema);
