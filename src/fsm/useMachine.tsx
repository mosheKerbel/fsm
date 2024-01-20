import { useEffect, useState, useMemo } from 'react';
import { Action, Transition } from '../types';

const useMachine = (machineCreator: Function) => {
  const machine = useMemo(() => machineCreator(), []);
  const [currentState, setCurrentState] = useState(machine.getValue());
  const [context, setContext] = useState(machine.getContext());

  useEffect(() => {
    machine.subscribeToStateChanges(() => {
      setCurrentState(machine.getValue());
      setContext(machine.getContext());
    });
  }, [machine]);
  

  const transition: Transition = (event, data) => {
    const newState = machine.transition(currentState, event, data);
    setCurrentState(newState);
  };
  
  const action: Action = (event, data) => {
    machine.action(currentState, event, data);
  };

  const matches = (state: string) => {
    return currentState === state;
  };

  return { transition, matches, context, currentState, action };
};

export default useMachine;
