/* https://greatwavetech.com/salesforce-communities-tips-dynamic-picklists-as-builder-attributes */

global class uswds_navigationLinkSet extends VisualEditor.DynamicPickList{
  // the getDefaultValue method must be implemented
  global override VisualEditor.DataRow getDefaultValue() {
    VisualEditor.DataRow defaultValue = new VisualEditor.DataRow('None','None');
    return defaultValue;
  }
  global uswds_navigationLinkSet() {
    
    }
  global override VisualEditor.DynamicPickListRows getValues() {
    List<NavigationLinkSet> navigationMenuList;
    VisualEditor.DataRow defaultValue = getDefaultValue();
    /* Get the current Network Id of the community */
    String networkId = Network.getNetworkId();
    System.debug('network ID: ' + networkId);
    if (networkId == null) {
      navigationMenuList = [Select Id, DeveloperName, MasterLabel, NetworkId, Network.Name from NavigationLinkSet];
      System.debug('NO NETWORK ID');
    }
    else {  
      navigationMenuList = [Select Id, DeveloperName, MasterLabel, NetworkId, Network.Name from NavigationLinkSet where NetworkId = :networkId];
    }    
    /* Declare a variable of type VisualEditor.DynamicPicklistRows, where value of the picklist will be added */
    VisualEditor.DynamicPickListRows navMenus = new VisualEditor.DynamicPickListRows();

    navMenus.addRow(defaultValue);
    /* Iterate over the list of navigation menus */
    for (NavigationLinkSet x: navigationMenuList) {
      VisualEditor.DataRow value = new VisualEditor.DataRow(x.Network.Name + ' - ' + x.MasterLabel, String.valueOf(x.Id));
      navMenus.addRow(value);
    }
    System.debug(navMenus);
    return navMenus;
  }
}
