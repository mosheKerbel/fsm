

import { Button, Checkbox, ListItem, Typography } from '@material-ui/core';
import { TodoItemProps } from '../types';
import { DataTestIds } from '../consts';

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onRemoveTask }) => (
  <ListItem dense button data-testid  ={DataTestIds.TODO_ITEM}>
    <Checkbox data-testid={DataTestIds.TODO_ITEM_CHECKBOX} checked={todo.isDone} onChange={onToggleComplete} color="primary" />
    <Typography
      variant="body1"
      style={{ textDecoration: todo.isDone ? 'line-through' : 'none', marginLeft: 10 }}
    >
      {todo.task}
    </Typography>
    <Button
      variant="outlined"
      color="secondary"
      data-testid={DataTestIds.REMOVE_BUTTON}
      onClick={onRemoveTask}
      style={{ marginLeft: 'auto' }}
    >
      Remove
    </Button>
  </ListItem>
);

export default TodoItem;