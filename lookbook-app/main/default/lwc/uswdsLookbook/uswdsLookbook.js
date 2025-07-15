import { LightningElement } from "lwc";
import { ActionTypes } from "c/navigationUtils";
import { loadStyle, loadScript } from "lightning/platformResourceLoader";
import USWDS_ASSETS from "@salesforce/resourceUrl/uswds_assets"; // Name of your static resource

export default class UswdsLookbook extends LightningElement {
  // This property holds the state of the current view.
  currentView = "buttonPreview"; // Set the default view
  uswdsInitialized = false;

  // This is the data structure that defines your side navigation.
  // It's configured to work with your navigationUtils service.
  navItems = [
    {
      id: "buttonPreview",
      label: "Buttons",
      actionType: ActionTypes.ComponentSwap,
      params: { view: "buttonPreview" } // The 'view' is the identifier we'll use
    },
    {
      id: "iconPreview",
      label: "Icons",
      actionType: ActionTypes.ComponentSwap,
      params: { view: "iconPreview" }
    },
    {
      id: "identifierPreview",
      label: "Identifier",
      actionType: ActionTypes.ComponentSwap,
      params: { view: "identifierPreview" }
    },
    {
      id: "sideNavigationPreview",
      label: "Side Navigation",
      actionType: ActionTypes.ComponentSwap,
      params: { view: "sideNavigationPreview" }
    }
  ];

  // This handler catches the 'navigate' event that bubbles up.
  handleNavigation(event) {
    const { actionType, params } = event.detail;
    // Ensure we only act on component swap requests
    if (actionType === ActionTypes.ComponentSwap) {
      this.currentView = params.view;
    }
  }

  // Use getters to make the template's conditional rendering clean.
  get isButtonPreview() {
    return this.currentView === "buttonPreview";
  }
  get isIconPreview() {
    return this.currentView === "iconPreview";
  }
  get isIdentifierPreview() {
    return this.currentView === "identifierPreview";
  }
  get isSideNavigationPreview() {
    return this.currentView === "sideNavigationPreview";
  }

  renderedCallback() {
    if (this.uswdsInitialized) {
      return;
    }
    this.uswdsInitialized = true;

    Promise.all([
      loadStyle(this, USWDS_ASSETS + "/css/theme.min.css"),
      loadScript(this, USWDS_ASSETS + "/js/uswds-initializer.min.js")
    ]);
  }
}
