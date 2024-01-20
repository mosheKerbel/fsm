import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TodoApp from './TodoApp';
import { DataTestIds } from '../consts';

// @ts-expect-error - not a full implementation of fetch, but good enough for our needs
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        todos: [
          { id: 1, task: 'Task 1', isDone: false },
          { id: 2, task: 'Task 2', isDone: true },
        ],
      }),
  })
);

describe('TodoApp', () => {
  test('renders todo app with initial atasks', async () => {
    render(<TodoApp />);
    await waitFor(() => screen.getByText('Task 2'));

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  test('adds a new task', async () => {
    render(<TodoApp />);
    await waitFor(() => screen.getByText('Task 1'));

    const newTaskInput = screen.getByTestId(DataTestIds.NEW_TASK_INPUT).querySelector('input') as HTMLInputElement;
    const addButton = screen.getByTestId(DataTestIds.ADD_TASK);

    fireEvent.change(newTaskInput, { target: { value: 'New Task 3' } });
    
    fireEvent.click(addButton);

    expect(screen.getByText('New Task 3')).toBeInTheDocument();
  });

  test('marks a task as completed and reverts the completion', async () => {
    render(<TodoApp />);
    await waitFor(() => screen.getAllByTestId(DataTestIds.TODO_ITEM));

    const firstTaskCheckbox = screen.getAllByTestId(DataTestIds.TODO_ITEM_CHECKBOX)[0].querySelector('input') as HTMLInputElement;
    fireEvent.click(firstTaskCheckbox);

    expect(firstTaskCheckbox).toBeChecked();

    fireEvent.click(firstTaskCheckbox);

    expect(firstTaskCheckbox).not.toBeChecked();
  });

  test('removes a task', async () => {
    render(<TodoApp />);
    await waitFor(() => screen.getByText('Task 1'));

    const removeButton = screen.getAllByTestId(DataTestIds.REMOVE_BUTTON)[0];

    fireEvent.click(removeButton);

    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
  });
});
