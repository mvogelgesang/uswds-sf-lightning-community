import { LightningElement } from "lwc";
import { ActionTypes } from "c/navigationUtils";
import { loadStyle, loadScript } from "lightning/platformResourceLoader";
import USWDS_ASSETS from "@salesforce/resourceUrl/uswds_assets"; // Name of your static resource

/**
 * @class
 * @alias uswds-lookbook
 * @description A component showcase/demo application that displays various USWDS components
 * with navigation between different preview sections (buttons, footer, icons, etc.).
 * @extends LightningElement
 * @author Mark Vogelgesang <movogelgesang@gmail.com>
 * @since 2024 */
export default class UswdsLookbook extends LightningElement {
  /**
   * @type {boolean}
   * @default false
   * @description Internal flag to track if the USWDS assets have been initialized.
   * @private
   */
  uswdsInitialized = false;
  currentView = "buttonPreview"; // Set the default view
  /**
   * @type {Array<Object>}
   * @description Array of navigation items that define the available preview sections.
   * Each item contains navigation data with labels, action types, and parameters.
   * @private
   */
  navItems = [
    {
      id: "buttonPreview",
      label: "Buttons",
      actionType: ActionTypes.ComponentSwap,
      params: { view: "buttonPreview" } // The 'view' is the identifier we'll use
    },
    {
      id: "footerPreview",
      label: "Footer",
      actionType: ActionTypes.ComponentSwap,
      params: { view: "footerPreview" }
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

  /**
   * @description Lifecycle hook to set the default navItem when the component is connected.
   * @private
   */
  connectedCallback() {
    // Set default navItem when component loads
    this.setDefaultNavItem("buttonPreview");
  }

  /**
   * @description Getter that finds the current navItem based on currentView.
   * @returns {Object|null} The current navItem object or null if not found.
   * @private
   */
  get currentNavItem() {
    return this.navItems.find((item) => item.id === this.currentView) || null;
  }

  /**
   * @description Getter that extracts the label from the current navItem.
   * @returns {string} The label of the current navItem, or empty string if not found.
   * @private
   */
  get currentNavLabel() {
    return this.currentNavItem?.label || "";
  }

  /**
   * @description Sets the default navItem to be displayed when the page loads.
   * @param {string} defaultViewId - The ID of the navItem to set as default.
   * @private
   */
  setDefaultNavItem(defaultViewId) {
    const defaultItem = this.navItems.find((item) => item.id === defaultViewId);
    if (defaultItem) {
      this.currentView = defaultViewId;
    }
  }

  /**
   * @description Handles navigation events from child components.
   * Updates the current view based on the navigation action.
   * @param {Event} event - The navigation event with actionType and params.
   * @private
   */
  handleNavigation(event) {
    const { actionType, params } = event.detail;
    // Ensure we only act on component swap requests
    if (actionType === ActionTypes.ComponentSwap) {
      this.currentView = params.view;
    }
  }

  /**
   * @description Getter to check if button preview is currently displayed.
   * @returns {boolean} True if button preview is active.
   * @private
   */
  get isButtonPreview() {
    return this.currentView === "buttonPreview";
  }
  /**
   * @description Getter to check if footer preview is currently displayed.
   * @returns {boolean} True if footer preview is active.
   * @private
   */
  get isFooterPreview() {
    return this.currentView === "footerPreview";
  }
  /**
   * @description Getter to check if icon preview is currently displayed.
   * @returns {boolean} True if icon preview is active.
   * @private
   */
  get isIconPreview() {
    return this.currentView === "iconPreview";
  }
  /**
   * @description Getter to check if identifier preview is currently displayed.
   * @returns {boolean} trueidentifier preview is active.
   * @private
   */
  get isIdentifierPreview() {
    return this.currentView === "identifierPreview";
  }
  /**
   * @description Getter to check if side navigation preview is currently displayed.
   * @returns {boolean} True if side navigation preview is active.
   * @private
   */
  get isSideNavigationPreview() {
    return this.currentView === "sideNavigationPreview";
  }

  /**
   * @description Lifecycle hook to load USWDS assets after the component is rendered.
   * @private
   */
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
