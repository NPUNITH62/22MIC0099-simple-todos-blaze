import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { TasksCollection } from './TasksCollection';

// All task categories the assessment requires.
export const TASK_CATEGORIES = ['Work', 'Personal', 'Urgent'];

Meteor.methods({
  async 'tasks.insert'(text, category, isPrivate) {
    check(text, String);
    check(category, String);
    check(isPrivate, Boolean);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    if (!TASK_CATEGORIES.includes(category)) {
      throw new Meteor.Error('Invalid category.');
    }

    const lowestOrderTask = await TasksCollection.findOneAsync(
      { userId: this.userId },
      { sort: { order: 1 } }
    );

    const newOrder = lowestOrderTask ? lowestOrderTask.order - 1 : 0;

    const user = await Meteor.users.findOneAsync(this.userId);

    return TasksCollection.insertAsync({
      text,
      category,
      private: isPrivate,
      createdAt: new Date(),
      userId: this.userId,
      username: user?.username,
      checked: false,
      order: newOrder,
    });
  },

  async 'tasks.remove'(taskId) {
    check(taskId, String);

    const task = await TasksCollection.findOneAsync(taskId);

    if (task.private && task.userId !== this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    await TasksCollection.removeAsync(taskId);
  },

  async 'tasks.setChecked'(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);

    const task = await TasksCollection.findOneAsync(taskId);

    if (task.private && task.userId !== this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    return TasksCollection.updateAsync(taskId, {
      $set: { checked: setChecked },
    });
  },

  async 'tasks.setPrivate'(taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, Boolean);

    const task = await TasksCollection.findOneAsync(taskId);

    if (task.userId !== this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    return TasksCollection.updateAsync(taskId, {
      $set: { private: setToPrivate },
    });
  },

  async 'tasks.setCategory'(taskId, category) {
    check(taskId, String);
    check(category, String);

    if (!TASK_CATEGORIES.includes(category)) {
      throw new Meteor.Error('Invalid category.');
    }

    const task = await TasksCollection.findOneAsync(taskId);

    if (task.private && task.userId !== this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    return TasksCollection.updateAsync(taskId, {
      $set: { category },
    });
  },

  async 'tasks.reorder'(orderedTaskIds) {
    check(orderedTaskIds, [String]);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    await Promise.all(
      orderedTaskIds.map((taskId, index) =>
        TasksCollection.updateAsync(
          { _id: taskId, userId: this.userId },
          { $set: { order: index } }
        )
      )
    );
  },
});