const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

taskSchema.methods.toJSON = function () {
  const task = this;
  const taskObject = task.toObject();

  delete taskObject.password;
  // delete taskObject.tokens;

  return taskObject;
};

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;

// // Create a new task object
// const task = new Task({
//     title: "Do laundry",
//     description: "Wash the clothes and fold them",
//     completed: true,
//   });

//   // Save the task to the database
//   task
//     .save()
//     .then(() => console.log("Task saved to database"))
//     .catch((err) => console.error(err));
