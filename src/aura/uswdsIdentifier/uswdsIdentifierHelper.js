({
	contentMap : function(identifierType, agencyName, agencyURL, agencyName2, agencyURL2, agencyLogo2) {
		var content = {
            identifierAria: "Agency Identifier",
            identifierLogoAlt: agencyName + " Logo",
            identityAria: "Agency Description",
          	identityDomain: agencyURL,
          	identityDisclaimer: "An official website of the <a href='" +agencyURL + "'>" + agencyName + "</a>",
            requiredLinksAria: "Important Links",
            usaGovAria: "U.S. Government information and services",
          	usaGovDescription: "Looking for U.S. government information and services?",
            usaGovLinkText: "Visit USA.gov"
        };
        
        return content;
	}
})