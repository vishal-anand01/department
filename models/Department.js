// models/Department.js
import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  department: String,
  websiteUrl: String,
  createdDate: Date,
  budget: Number,
});

const Department = mongoose.model("Department", departmentSchema);
export default Department;
