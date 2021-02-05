({
    doInit: function (cmp, event, helper) {
      var identifierType = cmp.get("v.identifierType");
      var content = helper.contentMap(identifierType, "agencyName", "agencyURL", "agencyName2", "agencyURL2", "agencyLogo2");
      cmp.set("v.identifierContent", content);
    },
    onClick: function (component, event, helper) {
      var id = event.target.dataset.menuItemId;
      if (id) {
        component.getSuper().navigate(id);
      }
    }
  });