import { LightningElement, api, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import { loadStyle, loadScript } from "lightning/platformResourceLoader";
import USWDS_ASSETS from "@salesforce/resourceUrl/uswds_assets"; // Name of your static resource
import getMenuItems from "@salesforce/apex/UswdsNavigationMenuItems.getMenuItems";

export default class UswdsSideNavigationBuilder extends LightningElement {
  /**
   * @description The DeveloperName of the navigation menu to display.
   * This property is set by the Experience Builder property editor.
   */
  @api menuDeveloperName;
  @api addHomeMenuItem = false;
  menuItems = [];
  error;
  publishStatus;
  uswdsInitialized = false;

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

  get _networkId() {
    return this.menuDeveloperName
      ? this.menuDeveloperName.substring(0, 15)
      : "";
  }
  get _developerName() {
    return this.menuDeveloperName ? this.menuDeveloperName.substring(18) : "";
  }

  connectedCallback() {}

  // Use the wire service to get menu items for the selected menu
  @wire(getMenuItems, {
    menuDeveloperName: "$_developerName",
    networkId: "$_networkId",
    publishStatus: "$publishStatus",
    includeImageUrl: false,
    addHomeMenuItem: "$addHomeMenuItem"
  })
  wiredMenuItems({ error, data }) {
    if (data) {
      this.menuItems = data || [];
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.menuItems = [];
      console.error("Error loading navigation menu items:", error);
    }
  }

  get hasMenuItems() {
    return this.menuItems && this.menuItems.length > 0;
  }

  /**
   * Using the CurrentPageReference, check if the app is 'commeditor'.
   *
   * If the app is 'commeditor', then the page will use 'Draft' NavigationMenuItems.
   * Otherwise, it will use the 'Live' schema.
   */
  @wire(CurrentPageReference)
  setCurrentPageReference(currentPageReference) {
    const app =
      currentPageReference &&
      currentPageReference.state &&
      currentPageReference.state.app;
    if (app === "commeditor") {
      this.publishStatus = "Draft";
    } else {
      this.publishStatus = "Live";
    }
  }
}
