import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '/imports/api/TasksCollection';
import '/imports/api/tasksMethods';
import '/imports/api/tasksPublications';

const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';

async function insertTask(taskText, user, category = 'Personal', order = 0) {
  await TasksCollection.insertAsync({
    text: taskText,
    category,
    order,
    createdAt: new Date(),
    userId: user._id,
    username: user.username,
    checked: false,
    private: false,
  });
}

Meteor.startup(async () => {
  // If there are no users, create one for local testing/demo purposes,
  // and seed a handful of tasks with different categories so the
  // category and drag-and-drop features are visible immediately.
  if ((await Meteor.users.find().countAsync()) === 0) {
    await Accounts.createUserAsync({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }

  if ((await TasksCollection.find().countAsync()) === 0) {
    const user = await Meteor.users.findOneAsync({ username: SEED_USERNAME });

    await insertTask('First Task', user, 'Work', 0);
    await insertTask('Second Task', user, 'Personal', 1);
    await insertTask('Third Task', user, 'Urgent', 2);
    await insertTask('Fourth Task', user, 'Work', 3);
    await insertTask('Fifth Task', user, 'Personal', 4);
    await insertTask('Sixth Task', user, 'Urgent', 5);
    await insertTask('Seventh Task', user, 'Work', 6);
  }
});
