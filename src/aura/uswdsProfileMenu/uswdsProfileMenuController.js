({
  doInit: function (component, event, helper) {
    var userId = $A.get("$SObjectType.CurrentUser.Id");
    if (userId) {
      component.set("v.loggedIn", true);
    }
  },
  menuToggle: function(component, event, helper) {
    var profileMenu = component.find("menu-options");
    var chevronUp = component.find("chevronUp");
    var chevronDown = component.find("chevronDown");
    $A.util.toggleClass(profileMenu, "hidden");
    $A.util.toggleClass(chevronUp, "hidden");
    $A.util.toggleClass(chevronDown, "hidden");
  },
  handleMenuSelect: function (component, event, helper) {
    console.log("handling menu select");
    var selectedMenuItemValue = event.getParam("value");
    if (selectedMenuItemValue) {
      component.getSuper().navigate(selectedMenuItemValue);
    }
  }
});

