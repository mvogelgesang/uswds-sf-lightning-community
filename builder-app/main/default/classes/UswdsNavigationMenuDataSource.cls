/**
 * @author Mark Vogelgesang <movogelgesang@gmail.com>
 * @date July 2025
 * @description Dynamic picklist data source for navigation menus, supporting dependency injection for testing.
 */
public with sharing class UswdsNavigationMenuDataSource extends VisualEditor.DynamicPicklist {
  private INavigationMenuDataProvider provider;

  /**
   * @description Default constructor uses the real provider.
   */
  public UswdsNavigationMenuDataSource() {
    this(new DefaultNavigationMenuDataProvider());
  }

  /**
   * @description Constructor for dependency injection.
   * @param provider The INavigationMenuDataProvider implementation to use.
   */
  public UswdsNavigationMenuDataSource(INavigationMenuDataProvider provider) {
    this.provider = provider;
  }

  /**
   * @description Returns a default value for the picklist.
   * @return An empty VisualEditor.DataRow.
   */
  public override VisualEditor.DataRow getDefaultValue() {
    return new VisualEditor.DataRow('', '');
  }

  /**
   * @description Fetches all 'Live' navigation menus for the current Experience Cloud site.
   * @return List of VisualEditor.DataRow for the dynamic picklist.
   */
  public override VisualEditor.DynamicPickListRows getValues() {
    List<VisualEditor.DataRow> options = new List<VisualEditor.DataRow>();
    List<NavigationLinkSet> menus = provider.getMenus();

    for (NavigationLinkSet menu : menus) {
      String networkName = (menu.Network != null)
        ? menu.Network.Name
        : 'No Network';
      options.add(
        new VisualEditor.DataRow(
          '(' + networkName + ')' + menu.MasterLabel,
          menu.NetworkId + menu.DeveloperName
        )
      );
    }

    return new VisualEditor.DynamicPickListRows(options);
  }
}
