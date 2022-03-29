({
  rerender: function (cmp, helper) {
    console.log("button rerender");
    console.log("rerender disabled value: ", cmp.get("v.disabled"));
    this.superRerender();
  }
});
