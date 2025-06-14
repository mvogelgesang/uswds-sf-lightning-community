import { LightningElement, api } from "lwc";

export default class UswdsAccordionContainer extends LightningElement {
  @api customClass = "";
  @api allowMultipleSelectable = false;
  @api accordionType = "Borderless";
  hasRendered = false;
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
  get containerClasses() {
    return (
      "usa-accordion" +
      (this.accordionType === "Bordered" ? " usa-accordion--bordered" : "") +
      (this.allowMultipleSelectable ? " usa-accordion--multiselectable" : "")
    );
  }
}
