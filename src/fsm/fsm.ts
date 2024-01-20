import { cloneDeep } from "../utils/utils";

export const createMachine = (config) => {
  const stateChangeSubscribers = config.stateChangeSubscribers || [];
  let context = config.context || {};
  let value = config.initialState;

  const assign = (newContext) => {
    context = { ...config.context, ...newContext };
    stateChangeSubscribers.forEach((subscriber) => subscriber());
  };

  const machine = {
    transition(currentState, event) {
      const currentStateDefinition = config.states[currentState];
      const destinationTransition = currentStateDefinition.transitions?.[event];

      if (!destinationTransition) {
        console.error(`Invalid event: ${event} for state: ${currentState}`);
        return value;
      }

      const destinationState = destinationTransition.onProcessTarget || destinationTransition.target;
      const destinationStateDefinition = config.states[destinationState];

      if (destinationTransition.onProcessTarget) {
        destinationTransition.action()!.then((data) => {
          value = destinationTransition.target;
          destinationTransition.onDone!({ assign, context, data });

          destinationStateDefinition.actions && destinationStateDefinition.actions.onExit && destinationStateDefinition.actions.onExit();
          const targetState = config.states[value];
          targetState.actions && targetState.actions.onEnter && targetState.actions.onEnter();
        });
      } else {
        destinationTransition.action();
      }

      currentStateDefinition.actions && currentStateDefinition.actions.onExit && currentStateDefinition.actions.onExit();
      destinationStateDefinition.actions && destinationStateDefinition.actions.onEnter && destinationStateDefinition.actions.onEnter();

      value = destinationState;
      return value;
    },
    action(currentState, event, data) {
      const currentStateDefinition = config.states[currentState];
      if (currentStateDefinition.actions) {
        const { action } = currentStateDefinition.actions[event];
        action && action({ assign, context, data });
      }
    },
    subscribeToStateChanges(callback) {
      stateChangeSubscribers.push(callback);
    },
    getContext: () => cloneDeep(context),
    getValue: () => value,
  };

  return machine;
};

export default createMachine;
