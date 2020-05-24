import { removeAll } from '../utility/array'

export default function implementActionList(target) {
  target.actions= [];
  target.updateActions = updateActions;
  target.addAction = addAction;
  target.removeAction = removeAction;
}

function updateActions(t) {
  let isDirty = false;
  if (this.actions.length) {
    for (const action of this.actions) {
      action.update(t);
    }
    isDirty = true;
  }
  removeAll(this.actions, a => a.isDone);
  return isDirty;
}

function addAction(action) {
  this.actions.push(action);
  action.parent = this;
}

function removeAction(action) {
  removeAll(this.actions, a => a === action);
  action.parent = null;
}
