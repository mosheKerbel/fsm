import { createMachine } from './fsm/fsm';
import fetchTodos from './services/fetchTodos';
import { Todo } from './types';

export const createTodoMachine = () => createMachine({
  initialState: 'preloading',
  context: {todos: []},
  states: {
    preloading: {
      transitions: {
        loadTodos: {
          target: 'loaded',
          onProcessTarget: 'loading',
          action: async () => {
            return fetchTodos();
          },
          onDone: ({assign, data}) => {
            assign({
              todos: data.todos
            });
          }
        },    
      },
    },
    loaded: {
      actions: {
        addTodo: {
          action: ({assign, context, data}) => {
            assign({
              todos: [...context.todos, data]
            });
          }
        },
        removeTodo: {
          action: ({assign, context, data}) => {
            const updatedTodos = context.todos.filter((todo: Todo)=>todo.id !== data.id)
            assign({
              todos: updatedTodos
            });
          }
        }, 
        toggleCompleteTodo: {
          action: ({assign, context, data}) => {
            const updatedTodos = context.todos.map((todo: Todo)=>{
              if (todo.id !== data.id) {
                return todo;
              } else {
                return {...todo, isDone: !todo.isDone};
              }
            })
            assign({
              todos: updatedTodos
            });
          }
        },                
      },      
    },
    loading: {},          
  },
});
