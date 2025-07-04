/**
 * @author Mark Vogelgesang <movogelgesang@gmail.com>
 * @date July 2025
 * @description Interface for providing navigation menu data. Implementations should return a list of NavigationLinkSet records.
 */
public interface INavigationMenuDataProvider {
  /**
   * @description Retrieves all NavigationLinkSet records.
   * @return List of NavigationLinkSet records.
   */
  List<NavigationLinkSet> getMenus();
}
