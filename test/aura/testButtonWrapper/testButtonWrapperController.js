({
  handleButtonClickEvent: function (component, event, helper) {
    console.log(
      "testbuttonwrappercontroller: I received a button click event!"
    );
    var buttonClicked = event.getSource().getLocalId();
    console.log(
      "testbuttonwrappercontroller: the button that was clicked: ",
      buttonClicked
    );
    if (buttonClicked === "uswdsButton")
      component.set("v.output", "I was clicked");
    else if (buttonClicked === "changeColor") {
      console.log("changeColor clicked");
      var button = component.find("changeColor");
      console.log("changeColor buttonType value: ", button.get("v.buttonType"));
      button.set("v.buttonType", "secondary color");
      console.log(
        "changeColor buttonType value post change: ",
        button.get("v.buttonType")
      );
    } else if (buttonClicked === "disableMe") {
      console.log("disableme clicked");
      var button = component.find("disableMe");
      console.log("disableMe current value:", button.get("v.disabled"));
      button.set("v.disabled", true);
      console.log("disableMe value post change:", button.get("v.disabled"));
    }
  }
});
