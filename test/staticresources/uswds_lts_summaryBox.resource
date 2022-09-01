describe("USWDS Summary Box", function () {
  // declare any variables that need to be available in each test
  var plainText;

  beforeEach(function () {
    plainText = {
      heading: "hello",
      body: "The quick brown fox jumps over the lazy dog"
    };
  });
  afterEach(function () {
    // Each spec (test) renders its components into the same div,
    // so we need to clear that div out at the end of each spec.
    $T.clearRenderedTestComponents();
  });
  it("plain text passed as arguments is rendered", function (done) {
    /**
     * createComponent - generates a component for testing
     * param - string - component reference "c:componentName"
     * param - object - component parameters {attributeA: "", attributeB:""}
     * param - boolean - whether or not the component needs to be rendered)
     */
    $T.createComponent(
      "c:uswdsSummaryBox",
      {
        heading: plainText.heading,
        body: plainText.body
      },
      true
    )
      .then(function (component) {
        expect(
          document.getElementById("summary-box-key-information").textContent
        ).toEqual(plainText.heading);
        expect(
          document.getElementsByClassName("usa-summary-box__text")[0].innerHTML
        ).toContain(plainText.body);
        done();
      })
      .catch(function (e) {
        done.fail(e);
      });
  });
});
