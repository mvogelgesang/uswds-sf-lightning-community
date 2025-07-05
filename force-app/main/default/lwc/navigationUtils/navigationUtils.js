/**

 * @description A centralized navigation service for LWC that abstracts the complexity of the NavigationMixin's PageReference
 * objects into a simpler, action-based API. Supports internal links, external links, events, and custom component swapping.
 * @author Mark Vogelgesang <movogelgesang@gmail.com>
 * @since 1.0.0
 */
import { NavigationMixin } from "lightning/navigation";

/**
 * @description Action types supported by the navigation service.
 * @type {Object}
 * @property {string} InternalLink - Navigation to internal pages within the application
 * @property {string} Event - Navigation to login/logout or other system events
 * @property {string} ExternalLink - Navigation to external URLs
 * @property {string} ComponentSwap - Custom action for swapping components without page navigation
 */
export const ActionTypes = {
  InternalLink: "InternalLink",
  Event: "Event",
  ExternalLink: "ExternalLink",
  // custom ActionType
  ComponentSwap: "ComponentSwap"
};

/**
 * @description Mapping of event action values to their corresponding page reference configurations.
 * @type {Object}
 * @private
 */
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

/**
 * @description Page reference builders for different action types.
 * @type {Object}
 * @private
 */
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

    console.warn(
      `NavigationUtils: Unknown event action value "${actionValue}".`
    );
  }
};

/**
 * @description Performs navigation based on a simplified request object.
 * Handles different action types including internal links, external links, events, and custom component swapping.
 * For component swaps, dispatches a custom event that bubbles up to parent components.
 * For other action types, uses the NavigationMixin to perform standard navigation.
 * @param {Object} componentContext - The `this` context from the calling LWC, required for NavigationMixin.
 * @param {Object} navigationRequest - An object describing the desired navigation.
 * @param {string} navigationRequest.actionType - The type of navigation to perform (e.g., ActionTypes.InternalLink).
 * @param {string} navigationRequest.actionValue - The value associated with the action (e.g., URL for links).
 * @param {string} navigationRequest.id - The unique identifier for the navigation item.
 * @param {Object} [navigationRequest.params] - Optional parameters for the navigation request.
 * @returns {void}
 * @private
 */
const navigate = (componentContext, navigationRequest) => {
  const { actionType, actionValue, id } = navigationRequest;

  // Handle non-NavigationMixin actions first, like swapping components.
  if (actionType === ActionTypes.ComponentSwap) {
    /**
     * @event navigate
     * @description Fired when a component swap action is requested.
     * The parent component can use this event to handle component swapping logic.
     * @param {Object} detail - The event payload.
     * @param {string} detail.actionType - The type of action (ComponentSwap).
     * @param {string} detail.actionValue - The action value.
     * @param {string} detail.id - The unique identifier for the navigation item.
     * @param {Object} [detail.params] - Optional parameters for the navigation request.
     * @example
     * // Parent component HTML:
     * // <c-child-component onnavigate={handleNavigation}></c-child-component>
     *
     * // Parent component JavaScript:
     * // handleNavigation(event) {
     * //   const { actionType, params } = event.detail;
     * //   if (actionType === 'ComponentSwap') {
     * //     this.currentView = params.view;
     * //   }
     * // }
     */
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
