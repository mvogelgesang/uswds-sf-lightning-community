import { LightningElement } from "lwc";
import USWDS_ASSETS from "@salesforce/resourceUrl/uswds_assets"; // Name of your static resource

export default class IdentifierPreview extends LightningElement {
  domain = "domain.gov";
  taxPayerDisclaimer = true;
  mastheadMenuItems = [
    {
      actionType: "ExternalLink",
      actionValue: "",
      hasSubMenu: false,
      id: "parentAgency_NewWindow",
      imageUrl: `${USWDS_ASSETS}/img/circle-gray-20.svg`,
      label: "Parent Agency",
      opensInNewWindow: true,
      subMenuItems: [],
      target: "NewWindow"
    }
  ];
  mainMenuItems = [
    {
      actionType: "InternalLink",
      actionValue: "",
      hasSubMenu: false,
      id: "aboutgsa_CurrentWindow",
      label: "About <Agency>",
      opensInNewWindow: false,
      subMenuItems: [],
      target: "CurrentWindow"
    },
    {
      actionType: "InternalLink",
      actionValue: "",
      hasSubMenu: false,
      id: "foia_CurrentWindow",
      label: "FOIA requests",
      opensInNewWindow: false,
      subMenuItems: [],
      target: "CurrentWindow"
    },
    {
      actionType: "InternalLink",
      actionValue: "",
      hasSubMenu: false,
      id: "oig_CurrentWindow",
      label: "Office of the Inspector General",
      opensInNewWindow: false,
      subMenuItems: [],
      target: "CurrentWindow"
    },
    {
      actionType: "InternalLink",
      actionValue: "",
      hasSubMenu: false,
      id: "privacy_CurrentWindow",
      label: "Privacy policy",
      opensInNewWindow: false,
      subMenuItems: [],
      target: "CurrentWindow"
    },
    {
      actionType: "InternalLink",
      actionValue: "",
      hasSubMenu: false,
      id: "accessibility_CurrentWindow",
      label: "Accessibility statement",
      opensInNewWindow: false,
      subMenuItems: [],
      target: "CurrentWindow"
    },
    {
      actionType: "InternalLink",
      actionValue: "",
      hasSubMenu: false,
      id: "noFearActData_CurrentWindow",
      label: "No FEAR Act data",
      opensInNewWindow: false,
      subMenuItems: [],
      target: "CurrentWindow"
    }
  ];
}
