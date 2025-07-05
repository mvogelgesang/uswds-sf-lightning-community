import { LightningElement } from "lwc";
import { ActionTypes } from "c/navigationUtils";

export default class SideNavigationPreview extends LightningElement {
  sideNavPreviewItems = [
    {
      id: "parentLink1",
      label: "Parent Link",
      actionType: ActionTypes.ComponentSwap,
      params: { view: "parentLink1" },
      hasSubMenu: false
    },
    {
      id: "parentLink2",
      label: "Parent Link",
      actionType: ActionTypes.ComponentSwap,
      params: { view: "parentLink2" },
      hasSubMenu: true,
      subMenuItems: [
        {
          id: "childLink1",
          label: "Child Link",
          actionType: ActionTypes.ComponentSwap,
          params: { view: "childLink1" }
        },
        {
          id: "childLink2",
          label: "Child Link",
          actionType: ActionTypes.ComponentSwap,
          params: { view: "childLink2" }
        }
      ]
    },
    {
      id: "parentLink3",
      label: "Parent Link",
      actionType: ActionTypes.ComponentSwap,
      params: { view: "parentLink3" },
      hasSubMenu: false
    }
  ];

  sideNavPreviewCurrentView = "parentLink1";

  handleNavigation(event) {
    const { actionType, params } = event.detail;
    // Ensure we only act on component swap requests
    if (actionType === ActionTypes.ComponentSwap) {
      this.currentView = params.view;
    }
  }
}
