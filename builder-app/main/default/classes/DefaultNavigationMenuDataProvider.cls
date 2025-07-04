/**
 * @author Mark Vogelgesang <movogelgesang@gmail.com>
 * @date July 2025
 * @description Default implementation of INavigationMenuDataProvider that retrieves navigation menus using SOQL.
 */
public class DefaultNavigationMenuDataProvider implements INavigationMenuDataProvider {
  /**
   * @description Retrieves all NavigationLinkSet records, ordered by Network name and label.
   * @return List of NavigationLinkSet records.
   */
  public List<NavigationLinkSet> getMenus() {
    return [
      SELECT Id, DeveloperName, MasterLabel, NetworkId, Network.Name
      FROM NavigationLinkSet
      ORDER BY Network.Name, MasterLabel ASC
    ];
  }
}
