import { TodoList } from "../types";

const fetchTodos = async (): Promise<TodoList> => {
  try {
    const response = await fetch('https://run.mocky.io/v3/3d987fad-4188-47b4-bd62-880635228e68');
    return response.json();
  } catch (error) {
    console.error('Error fetching initial todo list:', error);
    return {todos: []};
  }
};
  
  export default fetchTodos;
  