import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { ReactiveVar } from 'meteor/reactive-var';

import { showLoginForm } from './LoginButtons.js';

Template.loginForm.onCreated(function () {
  this.error = new ReactiveVar('');
});

Template.loginForm.helpers({
  loginError() {
    return Template.instance().error.get();
  },
});

Template.loginForm.events({
  'submit .login-form'(event, instance) {
    event.preventDefault();

    const target = event.target;
    const username = target.username.value.trim();
    const password = target.password.value;
    const submitter = event.submitter && event.submitter.name; // 'login' or 'signup'

    if (!username || !password) {
      instance.error.set('Please enter a username and password.');
      return;
    }

    const onResult = (err) => {
      if (err) {
        instance.error.set(err.reason || 'Something went wrong.');
      } else {
        instance.error.set('');
        showLoginForm.set(false);
      }
    };

    if (submitter === 'signup') {
      Accounts.createUser({ username, password }, onResult);
    } else {
      Meteor.loginWithPassword(username, password, onResult);
    }
  },

  'click .cancel-login'() {
    showLoginForm.set(false);
  },
});
