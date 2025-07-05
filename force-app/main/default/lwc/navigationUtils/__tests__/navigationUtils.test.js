import { createElement } from "@lwc/engine-dom";
import NavigationUtils, { navigate, ActionTypes } from "c/navigationUtils";

jest.mock("lightning/navigation", () => ({
  NavigationMixin: {
    Navigate: "Navigate"
  }
}));

describe("c-navigation-utils", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("should navigate to an internal link", () => {
    const mockComponentContext = {
      Navigate: jest.fn()
    };

    const navigationRequest = {
      actionType: ActionTypes.InternalLink,
      actionValue: "/internal-link"
    };

    navigate(mockComponentContext, navigationRequest);

    expect(mockComponentContext["Navigate"]).toHaveBeenCalledWith(
      {
        type: "standard__webPage",
        attributes: {
          url: "/internal-link"
        }
      },
      false
    );
  });

  it("should navigate to an external link", () => {
    const mockComponentContext = {
      Navigate: jest.fn()
    };

    const navigationRequest = {
      actionType: ActionTypes.ExternalLink,
      actionValue: "https://example.com"
    };

    navigate(mockComponentContext, navigationRequest);

    expect(mockComponentContext["Navigate"]).toHaveBeenCalledWith(
      {
        type: "standard__webPage",
        attributes: {
          url: "https://example.com"
        }
      },
      false
    );
  });

  it("should handle an event action", () => {
    const mockComponentContext = {
      Navigate: jest.fn()
    };

    const navigationRequest = {
      actionType: ActionTypes.Event,
      actionValue: "login"
    };

    navigate(mockComponentContext, navigationRequest);

    expect(mockComponentContext["Navigate"]).toHaveBeenCalledWith(
      {
        type: "comm_loginPage",
        attributes: {
          actionName: "login"
        }
      },
      false
    );
  });

  it("should handle component swap action", () => {
    const mockComponentContext = {
      dispatchEvent: jest.fn()
    };

    const navigationRequest = {
      actionType: ActionTypes.ComponentSwap,
      actionValue: "swapComponent"
    };

    navigate(mockComponentContext, navigationRequest);
    expect(mockComponentContext.dispatchEvent).toHaveBeenCalled();

    expect(mockComponentContext.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "navigate",
        detail: navigationRequest,
        bubbles: true,
        composed: true
      })
    );
  });
});
