const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;
const connection = require("../db/connection");

const noteSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  tag: {
    type: String,
  },
  isPinned: {
    type: Boolean,
  },
  isArchieved: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Number,
    default: 1,
  },
  color: {
    type: String,
  },
  created_at: {
    type: Date,
  },
  last_modified: {
    type: Date,
  },
});

noteSchema.pre("save", function (next) {
  const note = this;
  note.created_at = note.last_modified = moment().unix() * 1000;

  next();
});

const Note = mongoose.model("Note", noteSchema); //table

module.exports = Note;
