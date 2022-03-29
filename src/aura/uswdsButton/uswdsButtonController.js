({
  doInit: function (cmp, event, helper) {
    const buttonType = cmp.get("v.buttonType");
    const disabled = cmp.get("v.disabled");
    const buttonMap = helper.buttonTypeMap(buttonType);
    const customClass = cmp.get("v.customClassName");
    // pull together the various classes needed for the button. customClass comes last so as to override any prior settings.
    const classes = [
      "usa-button",
      buttonMap,
      cmp.get("v.big") ? "usa-button--big" : "",
      cmp.get("v.unstyled") ? "usa-button--unstyled" : "",
      customClass
    ]
      .filter(Boolean) // clears out any empty strings
      .join(" ")
      .trim();

    const buttonLabel = cmp.get("v.buttonLabel");
    const props = cmp.get("v.props");
    $A.createComponent(
      "aura:html",
      {
        "aura:id": "abc",
        tag: "button",
        body: buttonLabel,
        //takes any key value pairs passed as an object in props as well as outputs from classnames() to produce attribute pairs
        HTMLAttributes: Object.assign(
          { onclick: cmp.getReference("c.onClick") },
          props,
          { disabled: disabled },
          { class: classes },
          { "data-testid": "button" }
        )
      },
      function (buttonComponent, status, errorMessage) {
        if (status === "SUCCESS") {
          var body = cmp.get("v.body");
          body.push(buttonComponent);
          cmp.set("v.body", body);
        }
        if (status === "ERROR") {
          console.error(errorMessage);
        }
      }
    );
  },
  onClick: function (cmp, event, helper) {
    console.log("i was clicked");
    var compEvent = cmp.getEvent("buttonClickEventHandler");
    compEvent.fire();
  }
});
