import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';

import { TasksCollection } from '/imports/api/TasksCollection';

import './App.html';
import './LoginButtons.js';
import { showLoginForm } from './LoginButtons.js';
import './LoginForm.js';
import './TaskForm.js';
import './Task.js';
import './DragDrop.js';

Template.mainContainer.onCreated(function () {
  // Reactive flag for the "hide completed" filter. Stored on the template
  // instance so each instance of mainContainer keeps its own state.
  this.state = new ReactiveVar(true);

  this.subscribe('tasks');
});

Template.mainContainer.helpers({
  tasks() {
    const instance = Template.instance();
    const hideCompleted = instance.state.get();

    const filter = hideCompleted ? { checked: { $ne: true } } : {};

    return TasksCollection.find(filter, { sort: { order: 1 } });
  },

  incompleteCount() {
    return TasksCollection.find({ checked: { $ne: true } }).count();
  },

  hideCompletedFilter() {
    return Template.instance().state.get();
  },

  showLoginForm() {
    return showLoginForm.get();
  },
});

Template.mainContainer.events({
  'change #hide-completed-checkbox'(event, instance) {
    instance.state.set(event.target.checked);
  },
});
