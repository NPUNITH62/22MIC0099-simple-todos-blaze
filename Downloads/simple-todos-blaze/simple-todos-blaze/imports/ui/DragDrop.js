import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import Sortable from 'sortablejs';

// --- Feature 2: Drag-and-Drop Reordering -------------------------------
//
// We attach SortableJS to the <ul id="tasks-list"> element once it exists
// in the DOM, and tear it down when the template is destroyed (e.g. on
// hot reload) to avoid duplicate listeners.
//
// Whenever the user drops a task in a new position, we read the resulting
// DOM order of `data-id` attributes and send that full ordered list to
// the server via the `tasks.reorder` Method, which rewrites each task's
// `order` field to match.

Template.mainContainer.onRendered(function () {
  const listElement = this.find('#tasks-list');
  if (!listElement) return;

  this.sortable = Sortable.create(listElement, {
    handle: '.drag-handle', // only the drag handle should start a drag
    animation: 150,
    onEnd: () => {
      const orderedIds = Array.from(
        listElement.querySelectorAll('.task')
      ).map((el) => el.dataset.id);

      Meteor.call('tasks.reorder', orderedIds, (err) => {
        if (err) {
          alert('Could not save the new order: ' + (err.reason || err.message));
        }
      });
    },
  });
});

Template.mainContainer.onDestroyed(function () {
  if (this.sortable) {
    this.sortable.destroy();
  }
});
