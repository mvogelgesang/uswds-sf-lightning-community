import { createElement } from "@lwc/engine-dom";
import UswdsSideNavigation from "c/uswdsSideNavigation";

const navigationItems = [
  {
    id: "1",
    label: "Item 1",
    subMenuItems: [
      {
        id: "1.1",
        label: "Sub Item 1.1"
      },
      {
        id: "1.2",
        label: "Sub Item 1.2"
      }
    ]
  },
  {
    id: "2",
    label: "Item 2"
  }
];

const navigationItems2 = [
  {
    id: "1",
    label: "Item 1"
  },
  {
    id: "2",
    label: "Item 2"
  }
];

const navigationItems3 = [
  {
    id: "1",
    label: "Item 1"
  },
  {
    id: "2",
    label: "Item 2"
  }
];

const mockNavigate = jest.fn();

jest.mock(
  "@salesforce/navigation",
  () => {
    return {
      __esModule: true,
      NavigationMixin: {
        Navigate: jest.fn(() => {
          return "navigate";
        })
      }
    };
  },
  { virtual: true }
);

jest.mock("c/navigationUtils", () => {
  return {
    navigate: (that, item) => {
      mockNavigate(that, item);
    }
  };
});

describe("c-uswds-side-navigation", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("should render the component with default values", () => {
    const element = createElement("c-uswds-side-navigation", {
      is: UswdsSideNavigation
    });
    document.body.appendChild(element);
    expect(element).toMatchSnapshot();
  });

  it("should render the component with custom navigation label", () => {
    const element = createElement("c-uswds-side-navigation", {
      is: UswdsSideNavigation
    });
    element.navigationLabel = "Custom Navigation";
    document.body.appendChild(element);
    expect(element).toMatchSnapshot();
  });

  it("should render the component with navigation items", () => {
    const element = createElement("c-uswds-side-navigation", {
      is: UswdsSideNavigation
    });
    element.navigationItems = navigationItems2;
    document.body.appendChild(element);
    expect(element).toMatchSnapshot();
  });

  it("should render the component with sub menu items", () => {
    const element = createElement("c-uswds-side-navigation", {
      is: UswdsSideNavigation
    });
    element.navigationItems = navigationItems;
    document.body.appendChild(element);
    expect(element).toMatchSnapshot();
  });

  it("should set the first item as current if no initialNavId is provided", async () => {
    const element = createElement("c-uswds-side-navigation", {
      is: UswdsSideNavigation
    });
    element.navigationItems = navigationItems2;
    document.body.appendChild(element);
    await Promise.resolve();
    const firstItem = element.shadowRoot.querySelector(".usa-sidenav__item");
    expect(firstItem.classList.contains("usa-current")).toBe(true);
  });

  it("should set the initialNavId as current if provided", async () => {
    const element = createElement("c-uswds-side-navigation", {
      is: UswdsSideNavigation
    });
    element.navigationItems = navigationItems2;
    element.initialNavId = "2";
    document.body.appendChild(element);
    await Promise.resolve();
    const secondItem =
      element.shadowRoot.querySelectorAll(".usa-sidenav__item")[1];
    expect(secondItem.classList.contains("usa-current")).toBe(true);
  });

  it("should update the current item on click", async () => {
    const element = createElement("c-uswds-side-navigation", {
      is: UswdsSideNavigation
    });
    element.navigationItems = navigationItems3;
    document.body.appendChild(element);
    await Promise.resolve();

    // Simulate click on the second item
    const secondItem = element.shadowRoot.querySelectorAll(
      ".usa-sidenav__item a"
    )[1];
    secondItem.click();

    // Wait for the update to complete
    await Promise.resolve();

    // Check if the second item is now current
    const updatedSecondItem = element.shadowRoot.querySelectorAll(
      ".usa-sidenav__item.usa-current"
    )[0];
    expect(updatedSecondItem.textContent).toBe("Item 2");
  });

  it("should navigate to the correct page on item click", async () => {
    const element = createElement("c-uswds-side-navigation", {
      is: UswdsSideNavigation
    });
    element.navigationItems = navigationItems3;
    document.body.appendChild(element);
    await Promise.resolve();

    // Clear previous calls
    mockNavigate.mockClear();

    // Simulate click on the second item
    const secondItem = element.shadowRoot.querySelectorAll(
      ".usa-sidenav__item a"
    )[1];
    secondItem.click();

    // Wait for the update to complete
    await Promise.resolve();

    // Check if navigate was called with the correct parameters
    const lastCall =
      mockNavigate.mock.calls[mockNavigate.mock.calls.length - 1];
    expect(lastCall[1]).toEqual(
      expect.objectContaining({
        id: "2",
        label: "Item 2",
        isCurrent: true
      })
    );
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
