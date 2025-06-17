import { LightningElement, api } from "lwc";
/**
 * @class
 * @alias uswds-accordion-container
 * @description A container component for managing multiple accordion sections.
 *              Handles the expansion and collapse of sections, and applies styles dynamically.
 * @extends LightningElement
 * @author Mark Vogelgesang <movogelgesang@gmail.com>
 * @since 1.0.0
 */
export default class UswdsAccordionContainer extends LightningElement {
  /**
   * @api
   * @type {string}
   * @default ""
   * @description Custom CSS class to be applied to the container.
   */
  @api customClass = "";

  /**
   * @api
   * @type {boolean}
   * @default false
   * @description Determines if multiple sections can be open simultaneously.
   */
  @api allowMultipleSelectable = false;

  /**
   * @api
   * @type {string}
   * @default "Borderless"
   * @description Determines the styling type of the accordion (e.g., "Borderless" or "Bordered").
   */
  @api accordionType = "Borderless";

  /**
   * @private
   * @type {boolean}
   * @default false
   * @description Internal flag to ensure renderedCallback runs only once.
   */
  hasRendered = false;

  /**
   * @lifecycle
   * @description Runs after the component has been inserted into the DOM.
   *              Adds a top margin to all child sections except the first one.
   */
  renderedCallback() {
    // If it has already run, do nothing.
    if (this.hasRendered) {
      return;
    }
    this.hasRendered = true;

    // Find all the child sections that have been passed into the slot
    const sections = this.querySelectorAll("c-uswds-accordion-section");

    if (sections.length > 1) {
      // Loop through the sections, starting from the SECOND one (index 1)
      for (let i = 1; i < sections.length; i++) {
        // Set the public property on the child component instance
        sections[i].applyTopMargin = true;
      }
    }
  }
  /**
   * @event
   * @param {CustomEvent} event - The event object containing details of the toggled section.
   * @description Handles the toggle event of a section.
   *              Toggles the clicked section and closes others if multiple selection is not allowed.
   */
  handleSectionToggle(event) {
    const toggledSectionId = event.detail.id;

    // Find sections using the template
    const sections = this.template.querySelectorAll(
      "c-uswds-accordion-section"
    );

    sections.forEach((section) => {
      if (section.sectionId === toggledSectionId) {
        // Toggle the one that was clicked
        section.toggle();
      } else if (!this.allowMultipleSelectable) {
        // If only one can be open, close all others
        section.toggle(false);
      }
    });
  }

  /**
   * @getter
   * @return {string} - The class string for the container element.
   * @description Dynamically generates the class string for the container based on properties.
   */
  get containerClasses() {
    return (
      "usa-accordion" +
      (this.accordionType === "Bordered" ? " usa-accordion--bordered" : "") +
      (this.allowMultipleSelectable ? " usa-accordion--multiselectable" : "")
    );
  }
}
