import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';

// Shared flag (lives on the body-level template, so just use a simple
// module-level reactive var) controlling whether the login overlay shows.
export const showLoginForm = new ReactiveVar(false);

Template.loginButtons.events({
  'click .login'() {
    showLoginForm.set(true);
  },
  'click .logout'() {
    Meteor.logout();
  },
});
