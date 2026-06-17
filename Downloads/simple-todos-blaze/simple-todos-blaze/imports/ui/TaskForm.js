import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.taskForm.events({
  'submit .task-form'(event) {
    event.preventDefault();

    const target = event.target;
    const text = target.text.value.trim();
    const category = target.category.value;
    const isPrivate = target.private.checked;

    if (!text) return;

    Meteor.call('tasks.insert', text, category, isPrivate, (err) => {
      if (err) {
        alert(err.reason || 'Could not add task.');
      }
    });

    target.text.value = '';
    target.private.checked = false;
  },
});
