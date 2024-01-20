export type Todo = {
  task: string;
  id: string;
  isDone: boolean;
};
  
export type TodoItemProps = {
  todo: Todo;
  onToggleComplete: () => void;
  onRemoveTask: () => void;
};  

export type TodoList = {
  todos: Todo[];
};

export type Transition = (event: string, data?: Record<string, any>) => void;
export type Action = (event: string, data?: Record<string, any>) => void;
