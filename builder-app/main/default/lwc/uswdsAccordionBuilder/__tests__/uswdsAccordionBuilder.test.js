import { createElement } from "@lwc/engine-dom";
import UswdsAccordionBuilder from "c/uswdsAccordionBuilder";
// Mock the static resource
jest.mock(
  "@salesforce/resourceUrl/uswds_assets",
  () => ({
    __esModule: true,
    default: "uswds_assets"
  }),
  { virtual: true }
);

// Mock the platform resource loader
const mockLoadStyle = jest.fn(() => Promise.resolve());
const mockLoadScript = jest.fn(() => Promise.resolve());
jest.mock("lightning/platformResourceLoader", () => ({
  loadStyle: (context, url) => mockLoadStyle(context, url),
  loadScript: (context, url) => mockLoadScript(context, url)
}));

describe("c-uswds-accordion-builder", () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockLoadStyle.mockClear();
    mockLoadScript.mockClear();

    // Mock the USWDS initializer
    window.uswdsComponentInitializer = {
      initializeAccordions: jest.fn()
    };
  });

  afterEach(() => {
    // Clean up after each test
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    delete window.uswdsComponentInitializer;
  });

  it("should load USWDS assets and initialize accordions", async () => {
    // Arrange
    const element = createElement("c-uswds-accordion-builder", {
      is: UswdsAccordionBuilder
    });

    // Act
    document.body.appendChild(element);

    // Wait for the component to render and load resources
    await Promise.resolve();

    // Assert
    expect(mockLoadStyle).toHaveBeenCalledWith(
      expect.any(Object),
      "uswds_assets/css/theme.min.css"
    );
    expect(mockLoadScript).toHaveBeenCalledWith(
      expect.any(Object),
      "uswds_assets/js/uswds-initializer.min.js"
    );

    // Wait for the script to be loaded and executed
    await Promise.resolve();
    expect(
      window.uswdsComponentInitializer.initializeAccordions
    ).toHaveBeenCalledWith(element.shadowRoot);
  });

  it("should render accordion sections based on provided titles", async () => {
    // Arrange
    const element = createElement("c-uswds-accordion-builder", {
      is: UswdsAccordionBuilder
    });
    element.accordionTitle1 = "First Section";
    element.accordionTitle2 = "Second Section";

    // Act
    document.body.appendChild(element);
    await Promise.resolve();

    // Assert
    const sections = element.shadowRoot.querySelectorAll(
      "c-uswds-accordion-section"
    );
    expect(sections.length).toBe(2);
    expect(sections[0].header).toBe("First Section");
    expect(sections[1].header).toBe("Second Section");
  });

  it("should not render sections with empty titles", async () => {
    // Arrange
    const element = createElement("c-uswds-accordion-builder", {
      is: UswdsAccordionBuilder
    });
    element.accordionTitle1 = "First Section";
    element.accordionTitle2 = ""; // Empty title

    // Act
    document.body.appendChild(element);
    await Promise.resolve();

    // Assert
    const sections = element.shadowRoot.querySelectorAll(
      "c-uswds-accordion-section"
    );
    expect(sections.length).toBe(1);
    expect(sections[0].header).toBe("First Section");
  });

  it("should apply the correct accordion type class", async () => {
    // Arrange
    const element = createElement("c-uswds-accordion-builder", {
      is: UswdsAccordionBuilder
    });
    element.accordionType = "Bordered";

    // Act
    document.body.appendChild(element);
    await Promise.resolve();

    // Assert
    const container = element.shadowRoot.querySelector(
      "c-uswds-accordion-container"
    );
    expect(container.accordionType).toBe("Bordered");
  });

  it("should handle multiple selectable property", async () => {
    // Arrange
    const element = createElement("c-uswds-accordion-builder", {
      is: UswdsAccordionBuilder
    });
    element.allowMultipleSelectable = true;

    // Act
    document.body.appendChild(element);
    await Promise.resolve();

    // Assert
    const container = element.shadowRoot.querySelector(
      "c-uswds-accordion-container"
    );
    expect(container.allowMultipleSelectable).toBe(true);
  });
});
