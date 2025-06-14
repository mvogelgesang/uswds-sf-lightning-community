import { createElement } from "@lwc/engine-dom";

import UswdsAccordionSection from "c/uswdsAccordionSection";
import UswdsAccordionContainer from "c/uswdsAccordionContainer";

describe("c-uswds-accordion-section", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("Displays the accordion section with default properties", () => {
    const element = createElement("c-uswds-accordion-section", {
      is: UswdsAccordionSection
    });
    element.header = "Default Header";
    element.sectionId = "default-id";
    document.body.appendChild(element);

    // Check header text
    const header = element.shadowRoot.querySelector("h2");
    expect(header.textContent).toBe("Default Header");

    // Check sectionId
    const content = element.shadowRoot.querySelector(".usa-accordion__content");
    expect(content.id).toContain("default-id");

    // Check default classes
    expect(header.className).toBe("usa-accordion__heading");
  });

  it("Displays the accordion section with custom properties", () => {
    const element = createElement("c-uswds-accordion-section", {
      is: UswdsAccordionSection
    });
    element.header = "Custom Header";
    element.sectionId = "custom-id";
    element.applyTopMargin = true;
    document.body.appendChild(element);

    // Check header text
    const header = element.shadowRoot.querySelector("h2");
    expect(header.textContent).toBe("Custom Header");

    // Check sectionId - it is not an exact match because it is a generated id
    const content = element.shadowRoot.querySelector(".usa-accordion__content");
    expect(content.id).toContain("custom-id");

    // Check custom classes
    expect(header.className).toBe("usa-accordion__heading add-margin-top");
  });

  it("Toggles the accordion section visibility when toggle() is called", async () => {
    const element = createElement("c-uswds-accordion-container", {
      is: UswdsAccordionContainer
    });
    const section1 = createElement("c-uswds-accordion-section", {
      is: UswdsAccordionSection
    });
    section1.header = "Test Header";
    section1.sectionId = "test-id";
    element.appendChild(section1);
    document.body.appendChild(element);
    // Wait for component to be rendered
    await Promise.resolve();

    // Initially, isExpanded should be false
    expect(section1.isExpanded).toBe(false);
    const container = element.shadowRoot.querySelector(".usa-accordion");

    // Act
    const toggleEvent = new CustomEvent("sectiontoggle", {
      bubbles: true,
      composed: true,
      detail: { id: "test-id" }
    });
    container.dispatchEvent(toggleEvent);

    // Wait for the event to be handled
    await Promise.resolve();

    expect(section1.isExpanded).toBe(true);

    // Check hidden attribute on content div
    const content = section1.shadowRoot.querySelector(
      ".usa-accordion__content"
    );
    // hidden is not set, hence null
    expect(content.getAttribute("hidden")).toBe(null);

    // Call toggle() to collapse
    container.dispatchEvent(toggleEvent);

    // Wait for the event to be handled
    await Promise.resolve();
    expect(section1.isExpanded).toBe(false);
    // hidden lacks a value, hence ""
    expect(content.getAttribute("hidden")).toBe("");
  });

  it("Fires a sectiontoggle event when the header is clicked", () => {
    const element = createElement("c-uswds-accordion-section", {
      is: UswdsAccordionSection
    });
    element.header = "Test Header";
    element.sectionId = "test-id";
    document.body.appendChild(element);

    // Add event listener for sectiontoggle
    const handler = jest.fn();
    element.addEventListener("sectiontoggle", handler);

    // Click the header button
    const button = element.shadowRoot.querySelector(".usa-accordion__button");
    button.click();

    // Check if the event was fired with the correct detail
    expect(handler).toHaveBeenCalled();
    expect(handler.mock.calls[0][0].detail).toEqual({
      id: "test-id",
      isExpanded: false
    });
  });

  it("Respects the applyTopMargin property and updates the headingClasses accordingly", () => {
    // Test with applyTopMargin = true
    const elementTrue = createElement("c-uswds-accordion-section", {
      is: UswdsAccordionSection
    });
    elementTrue.header = "Test Header";
    elementTrue.sectionId = "test-id";
    elementTrue.applyTopMargin = true;
    document.body.appendChild(elementTrue);

    let heading = elementTrue.shadowRoot.querySelector("h2");
    expect(heading.className).toContain("add-margin-top");

    // Test with applyTopMargin = false
    const elementFalse = createElement("c-uswds-accordion-section", {
      is: UswdsAccordionSection
    });
    elementFalse.header = "Test Header";
    elementFalse.sectionId = "test-id";
    elementFalse.applyTopMargin = false;
    document.body.appendChild(elementFalse);

    heading = elementFalse.shadowRoot.querySelector("h2");
    expect(heading.className).not.toContain("add-margin-top");
  });
});
