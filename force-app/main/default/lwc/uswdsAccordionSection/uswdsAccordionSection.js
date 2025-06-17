import { LightningElement, api } from "lwc";

/**
 * @class
 * @alias uswds-accordion-section
 * @description A section within an accordion component, managing its expanded state and content visibility.
 * @extends LightningElement
 * @author Mark Vogelgesang <movogelgesang@gmail.com>
 * @since 1.0.0
 */
export default class UswdsAccordionSection extends LightningElement {
  /**
   * @api
   * @type {string}
   * @description The header text displayed for this accordion section.
   */
  @api header;
  /**
   * @api
   * @type {string}
   * @description A unique identifier for this accordion section.
   */
  @api sectionId;

  /**
   * @api
   * @type {boolean}
   * @default false
   * @description Determines if the section should have a top margin applied.
   */
  @api applyTopMargin = false;

  /**
   * @api
   * @type {boolean}
   * @default false
   * @description Indicates whether the section is currently expanded.
   */
  @api isExpanded = false;

  /**
   * Getter method to dynamically build the class string for the accordion heading.
   * Adds a margin class if the `applyTopMargin` property is true.
   *
   * @return {string} - The class string for the accordion heading.
   */
  get headingClasses() {
    // Start with the base class
    let classes = "usa-accordion__heading";

    // Add the margin class only if the parent tells it to
    if (this.applyTopMargin) {
      classes += " add-margin-top";
    }

    return classes;
  }
  /**
   * Getter method to determine if the accordion content should be hidden.
   * Returns true if the accordion section is not expanded.
   *
   * @return {boolean} - True if the content should be hidden, false otherwise.
   */
  get isContentHidden() {
    return !this.isExpanded;
  }

  /**
   * Public method to toggle the expanded state of the accordion section.
   * If an argument is provided, it sets the expanded state to that value.
   * Otherwise, it toggles the current state.
   *
   * @param {boolean} expand - Optional. The desired expanded state.
   */ @api
  toggle(expand) {
    this.isExpanded = typeof expand === "boolean" ? expand : !this.isExpanded;
  }

  /**
   * Handles the click event on the accordion header.
   * Dispatches a custom event `sectiontoggle` with details about the section's state.
   */ handleHeaderClick() {
    const customEvent = new CustomEvent("sectiontoggle", {
      bubbles: true,
      composed: true,
      detail: {
        id: this.sectionId,
        isExpanded: this.isExpanded
      }
    });
    this.dispatchEvent(customEvent);
  }
}
