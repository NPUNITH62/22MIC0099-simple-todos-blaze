import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.task.helpers({
  isOwner() {
    return this.userId === Meteor.userId();
  },

  isCategory(categoryName) {
    return this.category === categoryName;
  },
});

Template.task.events({
  'change .toggle-checked'(event) {
    event.preventDefault();
    Meteor.call('tasks.setChecked', this._id, event.target.checked);
  },

  'click .delete'(event) {
    event.preventDefault();
    if (confirm('Delete this task?')) {
      Meteor.call('tasks.remove', this._id);
    }
  },

  'click .toggle-private'(event) {
    event.preventDefault();
    Meteor.call('tasks.setPrivate', this._id, !this.private);
  },

  // --- Feature 1: Task Categories -----------------------------------
  'change .category-select'(event) {
    event.preventDefault();
    Meteor.call('tasks.setCategory', this._id, event.target.value);
  },
});
