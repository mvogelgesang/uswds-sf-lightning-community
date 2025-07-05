/**
 * @description A centralized navigation service for LWC.
 * This service abstracts the complexity of the NavigationMixin's PageReference
 * objects into a simpler, action-based API.
 */
import { NavigationMixin } from "lightning/navigation";

export const ActionTypes = {
  InternalLink: "InternalLink",
  Event: "Event",
  ExternalLink: "ExternalLink",
  // custom ActionType
  ComponentSwap: "ComponentSwap"
};

// Mapping of action values to their corresponding page reference configurations
const eventActionMappings = {
  "selfService:doLogin": {
    type: "comm_loginPage",
    attributes: { actionName: "login" }
  },
  "selfService:doLogout": {
    type: "comm_loginPage",
    attributes: { actionName: "logout" }
  },
  login: {
    type: "comm_loginPage",
    attributes: { actionName: "login" }
  },
  logout: {
    type: "comm_loginPage",
    attributes: { actionName: "logout" }
  }
};

const pageRefBuilders = {
  [ActionTypes.InternalLink]: (actionValue) => ({
    type: "standard__webPage",
    attributes: {
      url: actionValue
    }
  }),
  [ActionTypes.ExternalLink]: (actionValue) => ({
    type: "standard__webPage",
    attributes: {
      url: actionValue
    }
  }),
  [ActionTypes.Event]: (actionValue) => {
    // Check if we have a specific mapping for this action value
    if (eventActionMappings[actionValue]) {
      return eventActionMappings[actionValue];
    }

    // Fallback to default login behavior for unknown action values
    console.warn(
      `NavigationUtils: Unknown event action value "${actionValue}".`
    );
  }
};

/**
 * Performs navigation based on a simplified request object.
 * @param {object} componentContext - The `this` context from the calling LWC, required for NavigationMixin.
 * @param {object} navigationRequest - An object describing the desired navigation.
 * @param {string} navigationRequest.actionType - The type of navigation to perform (e.g., ActionTypes.VIEW_RECORD).
 * @param {object} navigationRequest.params - A payload of parameters needed for the navigation (e.g., { recordId: '...' }).
 */
const navigate = (componentContext, navigationRequest) => {
  const { actionType, actionValue, id } = navigationRequest;

  // Handle non-NavigationMixin actions first, like swapping components.
  if (actionType === ActionTypes.ComponentSwap) {
    const swapEvent = new CustomEvent("navigate", {
      detail: navigationRequest,
      bubbles: true,
      composed: true
    });
    componentContext.dispatchEvent(swapEvent);
    return;
  }

  // Get the correct builder function from our lookup object.
  const builder = pageRefBuilders[actionType];

  if (!builder) {
    console.error(
      `NavigationUtils: No handler found for actionType "${actionType}"`
    );
    return;
  }

  // Build the PageReference object.
  const pageRef = builder(actionValue);

  if (pageRef) {
    componentContext[NavigationMixin.Navigate](pageRef, false);
  }
};

export { navigate };
