import { createMachine } from './fsm';

describe('createMachine', () => {
  let machine;
  const mockFunctions = {
    onExitInitialState: jest.fn(),
    onEnterNextState: jest.fn(),
    onEnterProcessingState: jest.fn(),
    onEnterFinalState: jest.fn(),
    nextStateOnDone: jest.fn(),
    event2Action: jest.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve('someData');
        }, 300);
      });
    }),
  };

  beforeEach(() => {
    machine = createMachine({
      initialState: 'initialState',
      context: { key: 'value' },
      states: {
        initialState: {
          transitions: {
            event1: {
              target: 'nextState',
              action: jest.fn(),
            },
          },
          actions: {
            onExit: mockFunctions.onExitInitialState,
          },
        },
        nextState: {
          transitions: {
            event2: {
              target: 'finalState',
              action: mockFunctions.event2Action,
              onProcessTarget: 'processingState',
              onDone: mockFunctions.nextStateOnDone,
            },
          },
          actions: {
            onEnter: mockFunctions.onEnterNextState,
          },
        },
        processingState: {
          actions: {
            onEnter: mockFunctions.onEnterProcessingState,
          },
        },
        finalState: {
          actions: {
            onEnter: mockFunctions.onEnterFinalState,
          },
        },
      },
      stateChangeSubscribers: [jest.fn()],
    });
  });

  test('should transition to the next state on valid event and call actions', async () => {
    const newState = machine.transition('initialState', 'event1');
    expect(newState).toBe('nextState');
    expect(machine.getValue()).toBe('nextState');
    expect(machine.getContext()).toEqual({ key: 'value' });
    expect(mockFunctions.onExitInitialState).toHaveBeenCalled();
    expect(mockFunctions.onEnterNextState).toHaveBeenCalled();
  });

  test('should handle an invalid event and log an error', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const newState = machine.transition('initialState', 'invalidEvent');
    expect(newState).toBe('initialState');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Invalid event: invalidEvent for state: initialState'
    );
    consoleErrorSpy.mockRestore();
  });

  test('should call the action on a valid event with data and handle async transitions', async () => {
    const newState = machine.transition('initialState', 'event1');
    expect(newState).toBe('nextState');
    await machine.transition('nextState', 'event2');
    expect(mockFunctions.event2Action).toHaveBeenCalled();
    expect(machine.getValue()).toBe('processingState');
    expect(mockFunctions.onEnterProcessingState).toHaveBeenCalled();

    // Simulate the asynchronous action completion
    await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(machine.getValue()).toBe('finalState');
    expect(mockFunctions.onEnterFinalState).toHaveBeenCalled();
    expect(mockFunctions.nextStateOnDone).toHaveBeenCalledWith({
      assign: expect.any(Function),
      context: { key: 'value' },
      data: 'someData',
    });
  });
});
