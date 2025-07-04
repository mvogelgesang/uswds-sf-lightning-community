/**
 * @author Mark Vogelgesang <movogelgesang@gmail.com>
 * @date July 2025
 * @description Utility class for retrieving navigation menu items from Experience Cloud sites,
 * including support for dependency injection and service locator pattern. This class provides
 * a clean interface for accessing navigation menu data through the ConnectApi.
 */
public without sharing class UswdsNavigationMenuItems {
  /**
   * @description Holds the current provider instance for retrieving menu items.
   */
  private static IMenuDataProvider providerInstance;

  /**
   * @description Returns the current provider instance, or the default provider if none is set.
   * @return IMenuDataProvider The provider instance.
   */
  private static IMenuDataProvider getProvider() {
    if (providerInstance == null) {
      providerInstance = new ConnectApiMenuDataProvider();
    }
    return providerInstance;
  }

  /**
   * @description Used by tests to inject a mock provider.
   * @param mockProvider The mock provider to use for testing.
   */
  @TestVisible
  public static void setProvider(IMenuDataProvider mockProvider) {
    providerInstance = mockProvider;
  }

  /**
   * @description Retrieves the items for a specific navigation menu, including nested sub-menus.
   * @param menuDeveloperName The API Name of the NavigationLinkSet (Navigation Menu).
   * @param networkId The ID of the Experience Cloud site.
   * @param publishStatus The published status of the menu (e.g., 'Live' or 'Draft').
   * @param includeImageUrl Whether to include image URLs in the results.
   * @param addHomeMenuItem Whether to add a home menu item.
   * @return List<MenuItemWrapper> A list of formatted menu item objects.
   */
  @AuraEnabled(cacheable=true)
  public static List<MenuItemWrapper> getMenuItems(
    String menuDeveloperName,
    String networkId,
    String publishStatus,
    Boolean includeImageUrl,
    Boolean addHomeMenuItem
  ) {
    if (String.isBlank(menuDeveloperName)) {
      // Return an empty list if no developer name is provided.
      return new List<MenuItemWrapper>();
    }

    ConnectApi.PublishStatus publishStatusEnum;
    if (publishStatus.equalsIgnoreCase(ConnectApi.PublishStatus.Draft.name())) {
      publishStatusEnum = ConnectApi.PublishStatus.Draft;
    } else {
      publishStatusEnum = ConnectApi.PublishStatus.Live;
    }

    // The ConnectApi requires the context of the current Experience Cloud site.
    if (networkId == null) {
      // This can happen if the code is run outside a community context.
      // Throw a specific error that the LWC can understand.
      throw new AuraHandledException(
        'This component must be used within an Experience Cloud site.'
      );
    }

    // Exclude any types that aren't supported for your navigation menu
    List<ConnectApi.NavigationMenuItemType> menuItemsToSkip = new List<ConnectApi.NavigationMenuItemType>{
      ConnectApi.NavigationMenuItemType.Event, // not supported in custom component nav menus
      ConnectApi.NavigationMenuItemType.SystemLink // not supported in nav menus
    };

    List<MenuItemWrapper> menuItemWrappers = new List<MenuItemWrapper>();

    try {
      List<ConnectApi.NavigationMenuItem> navigationMenuItems = getProvider()
        .getMenuItems(
          networkId,
          menuDeveloperName,
          publishStatus,
          includeImageUrl,
          addHomeMenuItem,
          menuItemsToSkip
        );
      for (
        ConnectApi.NavigationMenuItem navigationMenuItem : navigationMenuItems
      ) {
        menuItemWrappers.add(new MenuItemWrapper(navigationMenuItem));
      }
    } catch (Exception e) {
      // If the menu doesn't exist or another error occurs, throw an exception
      // that the LWC's @wire adapter can catch in its 'error' property.
      throw new AuraHandledException(e.getMessage());
    }

    return menuItemWrappers;
  }

  /**
   * @description A lightweight wrapper class to provide a clean, serializable data structure for the LWC.
   */
  public class MenuItemWrapper {
    /**
     * @description The unique identifier for the menu item.
     */
    @AuraEnabled
    public String id { get; set; }

    /**
     * @description The action type for the menu item.
     */
    @AuraEnabled
    public String actionType { get; set; }

    /**
     * @description The action value for the menu item.
     */
    @AuraEnabled
    public String actionValue { get; set; }

    /**
     * @description Indicates if the menu item has sub-menu items.
     */
    @AuraEnabled
    public Boolean hasSubMenu { get; set; }

    /**
     * @description The image URL for the menu item, if available.
     */
    @AuraEnabled
    public String imageUrl { get; set; }

    /**
     * @description The display label for the menu item.
     */
    @AuraEnabled
    public String label { get; set; }

    /**
     * @description Indicates if the menu item opens in a new window.
     */
    @AuraEnabled
    public Boolean opensInNewWindow { get; set; }

    /**
     * @description The page reference for the menu item.
     */
    @AuraEnabled
    public ConnectApi.NavigationMenuPageReference pageReference { get; set; }

    /**
     * @description The list of sub-menu items for this menu item.
     */
    @AuraEnabled
    public List<MenuItemWrapper> subMenuItems { get; set; }

    /**
     * @description The target for the menu item.
     */
    @AuraEnabled
    public String target { get; set; }

    /**
     * @description Constructor that recursively transforms the ConnectApi result into a clean structure.
     * @param navigationMenuItem The ConnectApi.NavigationMenuItem to wrap.
     */
    public MenuItemWrapper(ConnectApi.NavigationMenuItem navigationMenuItem) {
      this.id =
        navigationMenuItem.label +
        '_' +
        String.valueOf(navigationMenuItem.target);
      this.actionType = navigationMenuItem.actionType.toString();
      this.actionValue = navigationMenuItem.actionValue;
      this.subMenuItems = new List<MenuItemWrapper>();
      // Recursively process any child menu items.
      if (
        navigationMenuItem.subMenu != null &&
        !navigationMenuItem.subMenu.isEmpty()
      ) {
        for (
          ConnectApi.NavigationMenuItem subMenuItem : navigationMenuItem.subMenu
        ) {
          this.subMenuItems.add(new MenuItemWrapper(subMenuItem));
        }
      }
      // Now set hasSubMenu based on the populated subMenuItems
      this.hasSubMenu = (this.subMenuItems != null &&
      !this.subMenuItems.isEmpty());
      this.imageUrl = navigationMenuItem.imageUrl;
      this.label = navigationMenuItem.label;
      this.opensInNewWindow =
        navigationMenuItem.target ==
        ConnectApi.NavigationMenuItemOpenTarget.NewWindow;
      this.pageReference = navigationMenuItem.pageReference;
      this.target = navigationMenuItem.target.toString();
    }
  }

  /**
   * @description Interface for providing navigation menu items. Used for dependency injection and testing.
   */
  public interface IMenuDataProvider {
    /**
     * @description Returns a list of ConnectApi.NavigationMenuItem objects for the given parameters.
     * @param networkId The ID of the Experience Cloud site.
     * @param menuDeveloperName The API Name of the NavigationLinkSet (Navigation Menu).
     * @param publishStatus The published status as a string (e.g., 'Live' or 'Draft').
     * @param includeImageUrl Whether to include image URLs in the results.
     * @param addHomeMenuItem Whether to add a home menu item.
     * @param menuItemsToSkip List of menu item types to skip.
     * @return List<ConnectApi.NavigationMenuItem> The list of menu items.
     */
    List<ConnectApi.NavigationMenuItem> getMenuItems(
      String networkId,
      String menuDeveloperName,
      String publishStatus,
      Boolean includeImageUrl,
      Boolean addHomeMenuItem,
      List<ConnectApi.NavigationMenuItemType> menuItemsToSkip
    );
  }

  /**
   * @description Default provider implementation that uses ConnectApi to retrieve menu items.
   */
  public class ConnectApiMenuDataProvider implements IMenuDataProvider {
    /**
     * @description Returns a list of ConnectApi.NavigationMenuItem objects for the given parameters using ConnectApi.
     * @param networkId The ID of the Experience Cloud site.
     * @param menuDeveloperName The API Name of the NavigationLinkSet (Navigation Menu).
     * @param publishStatus The published status as a string (e.g., 'Live' or 'Draft').
     * @param includeImageUrl Whether to include image URLs in the results.
     * @param addHomeMenuItem Whether to add a home menu item.
     * @param menuItemsToSkip List of menu item types to skip.
     * @return List<ConnectApi.NavigationMenuItem> The list of menu items.
     */
    public List<ConnectApi.NavigationMenuItem> getMenuItems(
      String networkId,
      String menuDeveloperName,
      String publishStatus,
      Boolean includeImageUrl,
      Boolean addHomeMenuItem,
      List<ConnectApi.NavigationMenuItemType> menuItemsToSkip
    ) {
      ConnectApi.PublishStatus publishStatusEnum;
      if (publishStatus != null && publishStatus.equalsIgnoreCase('Draft')) {
        publishStatusEnum = ConnectApi.PublishStatus.Draft;
      } else {
        publishStatusEnum = ConnectApi.PublishStatus.Live;
      }
      ConnectApi.NavigationMenuItemCollection menuItemCollection = ConnectApi.NavigationMenu.getCommunityNavigationMenu(
        networkId,
        null,
        menuDeveloperName,
        publishStatusEnum,
        includeImageUrl,
        addHomeMenuItem,
        menuItemsToSkip
      );
      return menuItemCollection.menuItems;
    }
  }
}
