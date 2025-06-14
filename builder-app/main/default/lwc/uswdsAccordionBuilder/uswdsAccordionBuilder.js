import { LightningElement, api } from "lwc";
import { loadStyle, loadScript } from "lightning/platformResourceLoader";
import USWDS_ASSETS from "@salesforce/resourceUrl/uswds_assets"; // Name of your static resource

/**
 * @slot content1 - The content for the first accordion section
 * @slot content2 - The content for the second accordion section
 */
export default class UswdsAccordionBuilder extends LightningElement {
  @api accordionTitle1 = "First Accordion Heading";
  @api accordionTitle2 = "Second Accordion Heading";
  @api accordionTitle3 = "";
  @api accordionTitle4 = "";
  @api accordionTitle5 = "";
  @api accordionTitle6 = "";
  @api accordionTitle7 = "";
  @api accordionTitle8 = "";
  @api accordionTitle9 = "";
  @api accordionTitle10 = "";

  @api accordionType = "Borderless"; // Default"
  @api allowMultipleSelectable = false;
  uswdsInitialized = false;

  get hideAccordion1() {
    return this.isEmptyString(this.accordionTitle1);
  }
  get hideAccordion2() {
    return this.isEmptyString(this.accordionTitle2);
  }
  get hideAccordion3() {
    return this.isEmptyString(this.accordionTitle3);
  }
  get hideAccordion4() {
    return this.isEmptyString(this.accordionTitle4);
  }
  get hideAccordion5() {
    return this.isEmptyString(this.accordionTitle5);
  }
  get hideAccordion6() {
    return this.isEmptyString(this.accordionTitle6);
  }
  get hideAccordion7() {
    return this.isEmptyString(this.accordionTitle7);
  }
  get hideAccordion8() {
    return this.isEmptyString(this.accordionTitle8);
  }
  get hideAccordion9() {
    return this.isEmptyString(this.accordionTitle9);
  }
  get hideAccordion10() {
    return this.isEmptyString(this.accordionTitle10);
  }

  isEmptyString(value) {
    return value === "";
  }

  renderedCallback() {
    if (this.uswdsInitialized) {
      return;
    }
    this.uswdsInitialized = true;

    Promise.all([
      loadStyle(this, USWDS_ASSETS + "/css/theme.min.css"),
      loadScript(this, USWDS_ASSETS + "/js/uswds-initializer.min.js")
    ])
      .then(() => {
        if (
          window.uswdsComponentInitializer &&
          typeof window.uswdsComponentInitializer.initializeAccordions ===
            "function"
        ) {
          // Pass `this.template` to scope the initialization to this component's shadow DOM
          window.uswdsComponentInitializer.initializeAccordions(this.template);
        } else {
          console.error(
            "USWDS Initializer not found or initializeAccordions is not a function."
          );
        }
      })
      .catch((error) => {
        console.error("Error loading USWDS assets:", error);
      });
  }
}
