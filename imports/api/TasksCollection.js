import { Mongo } from 'meteor/mongo';

// Each task document looks like:
// {
//   _id: String,
//   text: String,
//   createdAt: Date,
//   userId: String,        // who created the task
//   username: String,      // denormalized for easy display
//   checked: Boolean,       // completed or not
//   private: Boolean,       // only visible to its owner if true
//   category: String,       // 'Work' | 'Personal' | 'Urgent'
//   order: Number,          // controls drag-and-drop position
// }
export const TasksCollection = new Mongo.Collection('tasks');
