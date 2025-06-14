import { LightningElement, api } from "lwc";

export default class UswdsAccordionSection extends LightningElement {
  @api header;
  @api sectionId;
  @api applyTopMargin = false;
  // Internal state management
  @api isExpanded = false;

  // 2. Create a getter to dynamically build the class string.
  get headingClasses() {
    // Start with the base class
    let classes = "usa-accordion__heading";

    // Add the margin class only if the parent tells it to
    if (this.applyTopMargin) {
      classes += " add-margin-top";
    }

    return classes;
  }

  get isContentHidden() {
    return !this.isExpanded;
  }

  // Public method that can be called by a parent container
  @api
  toggle(expand) {
    this.isExpanded = typeof expand === "boolean" ? expand : !this.isExpanded;
  }

  // Notifies a parent container that this section's header was clicked
  handleHeaderClick() {
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
