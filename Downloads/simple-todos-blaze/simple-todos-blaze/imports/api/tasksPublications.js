import { Meteor } from 'meteor/meteor';
import { TasksCollection } from './TasksCollection';

Meteor.publish('tasks', function publishTasks() {
  // Publish only tasks that are public, or private tasks owned by the
  // currently logged-in user. Sorted by `order` so drag-and-drop position
  // is preserved across reloads.
  return TasksCollection.find(
    {
      $or: [{ private: { $ne: true } }, { userId: this.userId }],
    },
    { sort: { order: 1 } }
  );
});
