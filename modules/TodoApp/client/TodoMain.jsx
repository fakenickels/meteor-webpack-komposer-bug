import React from 'react';
import { Link } from 'react-router';
import {composeWithTracker} from 'react-komposer';

import TodoHeader from './components/TodoHeader';
import TodoList from './components/TodoList';

import Tasks from 'TodoApp/collections/Tasks';
import style from './css/TodoApp.import.css';

const container = composeWithTracker(function(props, onData){
  const handle = Meteor.subscribe('tasks');

  if(handle.ready()){
    let taskFilter = {};

    const tasks = Tasks.find(taskFilter, {sort: {createdAt: -1}}).fetch();
    const incompleteCount = Tasks.find({checked: {$ne: true}}).count();

    onData(null, {
      tasks,
      incompleteCount,
      user: Meteor.user()
    });
  }
});

const TodoMain = React.createClass({
  getInitialState: () => ({
    hideCompleted: false
  }),

  handleToggleHideCompleted(e){
    this.setState({ hideCompleted: e.target.checked });
  },

  render() {
    return (
        <div className={style.container}>
          <Link to="/admin">Admin</Link>
          <TodoHeader
              incompleteCount={this.props.incompleteCount}
              hideCompleted={this.state.hideCompleted}
              toggleHideCompleted={this.handleToggleHideCompleted}
          />
          <TodoList tasks={this.props.tasks} />
        </div>
    );
  },
});

export default container(TodoMain);
