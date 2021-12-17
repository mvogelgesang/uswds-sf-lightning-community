import { LightningElement, api } from "lwc";
import isguest from "@salesforce/user/isGuest";
import { loadStyle, loadScript } from "lightning/platformResourceLoader";
import dap from "@salesforce/resourceUrl/UniversalFederatedAnalyticsMin";

export default class CheckGuestUserInLWC extends LightningElement {
  dapInitialized = false;
  renderedCallback() {
    //if (isguest && !dapInitialized) {
    Promise.all([loadScript(this, dap).then(() => {})]);
    this.dapInitialized = true;
    //}
  }

  @api agencyAbbv = "GSA";
  // Expose the value of @salesforce/user/isGuest in the template.
  isGuestUser = isguest;
}
