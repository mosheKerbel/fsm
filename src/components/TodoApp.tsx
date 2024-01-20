/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Button, Container, List, TextField, Typography } from '@material-ui/core';
import TodoItem from './TodoItem';
import { DataTestIds } from '../consts.ts';
import useMachine from '../useMachine.tsx';
import { Todo } from '../types.js';

import { createTodoMachine } from '../todosMachine.ts';
import { generateUniqueId } from '../utils/utils.ts';


const TodoApp: React.FC = () => {
  const {matches, context, transition, action} = useMachine(createTodoMachine);
  const [newTask, setNewTask] = useState<string>('');
  useEffect(() => {
    transition('loadTodos');
  }, []);

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      action('addTodo', {id: generateUniqueId(), task: newTask, isDone: false});
      setNewTask('');
    }
  };

  const handleRemoveTask = (todo: Todo) => {
    action('removeTodo', todo);
  };

  const handleToggleComplete = (todo: Todo) => {
    action('toggleCompleteTodo', todo);
  };

  const { todos } = context as any;
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Todo App
      </Typography>
      {matches('loaded') && (
      <>
        <TextField
          data-testid={DataTestIds.NEW_TASK_INPUT}
          label="New Task"
          variant="outlined"
          fullWidth
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <Button data-testid={DataTestIds.ADD_TASK} variant="contained" color="primary" onClick={handleAddTask} style={{ marginTop: 10 }}>
          Add Task
        </Button>
        <List style={{ marginTop: 20 }}>
          {todos.map((todo: Todo, index: number) => (
            <TodoItem
              key={index}
              todo={todo}
              onToggleComplete={() => handleToggleComplete(todo)}
              onRemoveTask={() => handleRemoveTask(todo)}
            />
          ))}
        </List>
      </>)}
    </Container>
  );
};

export default TodoApp;
