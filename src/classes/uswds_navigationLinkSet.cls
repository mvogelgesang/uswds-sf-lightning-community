/* https://greatwavetech.com/salesforce-communities-tips-dynamic-picklists-as-builder-attributes */

global class uswds_navigationLinkSet extends VisualEditor.DynamicPickList{

  global override VisualEditor.DynamicPickListRows getValues() {
    /* Get the current Network Id of the community */
    Id networkId = new Network().getNetworkId();
    List<NavigationLinkSet> navigationMenuList = [Select Id, DeveloperName, MasterLabel, NetworkId, Network.Name from NavigationLinkSet where NetworkId = :networkId];
    /* Declare a variable of type VisualEditor.DynamicPicklistRows, where value of the picklist will be added */
    VisualEditor.DynamicPickListRows navMenus = new VisualEditor.DynamicPickListRows();

    /* Iterate over the list of navigation menus */
    for (NavigationLinkSet x: navigationMenuList) {
      VisualEditor.DataRow value = new VisualEditor.DataRow(x.MasterLabel, String.valueOf(x.Id));
      navMenus.addRow(value);
    }

    return navMenus;
  }
}
