/**
 * @author Mark Vogelgesang <movogelgesang@gmail.com>
 * @date July 2025
 * @description Unit tests for UswdsNavigationMenuItems, including mock providers and error handling.
 */
@isTest(seeAllData=false)
private class UswdsNavigationMenuItemsTest {
  /**
   * @description Mock provider for menu data.
   */
  private class MockMenuDataProvider implements UswdsNavigationMenuItems.IMenuDataProvider {
    public List<ConnectApi.NavigationMenuItem> getMenuItems(
      String menuDeveloperName,
      String networkId,
      String publishStatus,
      Boolean includeImageUrl,
      Boolean addHomeMenuItem,
      List<ConnectApi.NavigationMenuItemType> menuItemsToSkip
    ) {
      // Return a list of mock ConnectApi.NavigationMenuItem objects
      List<ConnectApi.NavigationMenuItem> items = new List<ConnectApi.NavigationMenuItem>();
      // Create a fake ConnectApi.NavigationMenuItem
      ConnectApi.NavigationMenuItem fakeItem = new ConnectApi.NavigationMenuItem();
      fakeItem.label = 'Test Label';
      fakeItem.actionType = ConnectApi.NavigationMenuItemActionType.INTERNALLINK;
      fakeItem.actionValue = '/test';
      fakeItem.target = ConnectApi.NavigationMenuItemOpenTarget.CURRENTWINDOW;
      fakeItem.subMenu = new List<ConnectApi.NavigationMenuItem>();

      ConnectApi.NavigationMenuItem fakeSubItem = new ConnectApi.NavigationMenuItem();
      fakeSubItem.label = 'Sub Menu Item Label';
      fakeSubItem.actionType = ConnectApi.NavigationMenuItemActionType.INTERNALLINK;
      fakeSubItem.actionValue = '/subMenu';
      fakeSubItem.target = ConnectApi.NavigationMenuItemOpenTarget.CURRENTWINDOW;
      fakeSubItem.subMenu = new List<ConnectApi.NavigationMenuItem>();
      fakeItem.subMenu.add(fakeSubItem);
      items.add(fakeItem);

      return items;
    }
  }

  /**
   * @description Mock provider that throws an error.
   */
  private class ErrorProvider implements UswdsNavigationMenuItems.IMenuDataProvider {
    public List<ConnectApi.NavigationMenuItem> getMenuItems(
      String menuDeveloperName,
      String networkId,
      String publishStatus,
      Boolean includeImageUrl,
      Boolean addHomeMenuItem,
      List<ConnectApi.NavigationMenuItemType> menuItemsToSkip
    ) {
      throw new AuraHandledException('Provider error');
    }
  }

  /**
   * @description Mock provider for deeply nested menu data.
   */
  private class MockDeeplyNestedMenuDataProvider implements UswdsNavigationMenuItems.IMenuDataProvider {
    public List<ConnectApi.NavigationMenuItem> getMenuItems(
      String menuDeveloperName,
      String networkId,
      String publishStatus,
      Boolean includeImageUrl,
      Boolean addHomeMenuItem,
      List<ConnectApi.NavigationMenuItemType> menuItemsToSkip
    ) {
      ConnectApi.NavigationMenuItem grandChild = new ConnectApi.NavigationMenuItem();
      grandChild.label = 'Grandchild';
      grandChild.actionType = ConnectApi.NavigationMenuItemActionType.INTERNALLINK;
      grandChild.actionValue = '/grandchild';
      grandChild.target = ConnectApi.NavigationMenuItemOpenTarget.CURRENTWINDOW;
      grandChild.subMenu = new List<ConnectApi.NavigationMenuItem>();

      ConnectApi.NavigationMenuItem child = new ConnectApi.NavigationMenuItem();
      child.label = 'Child';
      child.actionType = ConnectApi.NavigationMenuItemActionType.INTERNALLINK;
      child.actionValue = '/child';
      child.target = ConnectApi.NavigationMenuItemOpenTarget.CURRENTWINDOW;
      child.subMenu = new List<ConnectApi.NavigationMenuItem>{ grandChild };

      ConnectApi.NavigationMenuItem parent = new ConnectApi.NavigationMenuItem();
      parent.label = 'Parent';
      parent.actionType = ConnectApi.NavigationMenuItemActionType.INTERNALLINK;
      parent.actionValue = '/parent';
      parent.target = ConnectApi.NavigationMenuItemOpenTarget.CURRENTWINDOW;
      parent.subMenu = new List<ConnectApi.NavigationMenuItem>{ child };

      return new List<ConnectApi.NavigationMenuItem>{ parent };
    }
  }

  /**
   * @description Mock provider that returns an empty menu list.
   */
  private class MockEmptyMenuDataProvider implements UswdsNavigationMenuItems.IMenuDataProvider {
    public List<ConnectApi.NavigationMenuItem> getMenuItems(
      String menuDeveloperName,
      String networkId,
      String publishStatus,
      Boolean includeImageUrl,
      Boolean addHomeMenuItem,
      List<ConnectApi.NavigationMenuItemType> menuItemsToSkip
    ) {
      return new List<ConnectApi.NavigationMenuItem>();
    }
  }

  /**
   * @description Tests getMenuItems() with a mock provider.
   */
  @IsTest
  static void testGetMenuItems() {
    UswdsNavigationMenuItems.setProvider(new MockMenuDataProvider());

    // Act
    List<UswdsNavigationMenuItems.MenuItemWrapper> result = UswdsNavigationMenuItems.getMenuItems(
      'TestMenu',
      'TestNetworkId',
      'Live',
      false,
      false
    );

    // Assert
    System.assertEquals(1, result.size(), 'Should return one menu item');
    System.assertEquals('Test Label', result[0].label, 'Label should match');
    System.assertEquals(
      '/test',
      result[0].actionValue,
      'Action value should match'
    );

    System.assertEquals(
      1,
      result[0].subMenuItems.size(),
      'Should return one sub-menu menu item'
    );
    System.assertEquals(
      'Sub Menu Item Label',
      result[0].subMenuItems[0].label,
      'Label should match'
    );
    System.assertEquals(
      '/subMenu',
      result[0].subMenuItems[0].actionValue,
      'Action value should match'
    );
  }

  /**
   * @description Tests getMenuItems() with null menuDeveloperName.
   */
  @IsTest
  static void testNullMenuDeveloperName() {
    UswdsNavigationMenuItems.setProvider(new MockMenuDataProvider());

    List<UswdsNavigationMenuItems.MenuItemWrapper> result = UswdsNavigationMenuItems.getMenuItems(
      null,
      'TestNetworkId',
      'Live',
      false,
      false
    );
    System.assertEquals(
      0,
      result.size(),
      'Should return empty list for null menuDeveloperName'
    );
  }

  /**
   * @description Tests getMenuItems() with null networkId, expecting an exception.
   */
  @IsTest
  static void testNullNetworkIdThrows() {
    UswdsNavigationMenuItems.setProvider(new MockMenuDataProvider());

    try {
      UswdsNavigationMenuItems.getMenuItems(
        'TestMenu',
        null,
        'Live',
        false,
        false
      );
      System.assert(false, 'Should have thrown AuraHandledException');
    } catch (AuraHandledException e) {
      System.assertEquals(
        'Script-thrown exception', // This is what the method actually throws
        e.getMessage(),
        'Should throw correct error, got: ' + e.getMessage()
      );
    }
  }

  /**
   * @description Tests getMenuItems() when the provider throws an exception.
   */
  @IsTest
  static void testProviderThrowsException() {
    UswdsNavigationMenuItems.setProvider(new ErrorProvider());

    Test.startTest();
    try {
      UswdsNavigationMenuItems.getMenuItems(
        'TestMenu',
        'TestNetworkId',
        'Live',
        false,
        false
      );
      System.assert(false, 'Should have thrown AuraHandledException');
    } catch (AuraHandledException e) {
      System.assertEquals(
        'Script-thrown exception', // This is what the method actually throws
        e.getMessage(),
        'Should throw the generic error from the catch block'
      );
    }
    Test.stopTest();
  }

  /**
   * @description Tests getMenuItems() with deeply nested sub-menus.
   */
  @IsTest
  static void testDeeplyNestedSubMenus() {
    UswdsNavigationMenuItems.setProvider(
      new MockDeeplyNestedMenuDataProvider()
    );

    List<UswdsNavigationMenuItems.MenuItemWrapper> result = UswdsNavigationMenuItems.getMenuItems(
      'TestMenu',
      'TestNetworkId',
      'Live',
      false,
      false
    );
    System.assertEquals(1, result.size(), 'Should return one parent');
    System.assertEquals(
      1,
      result[0].subMenuItems.size(),
      'Should return one child'
    );
    System.assertEquals(
      1,
      result[0].subMenuItems[0].subMenuItems.size(),
      'Should return one grandchild'
    );
  }

  /**
   * @description Tests getMenuItems() with an empty menu list.
   */
  @IsTest
  static void testEmptyMenuList() {
    UswdsNavigationMenuItems.setProvider(new MockEmptyMenuDataProvider());

    List<UswdsNavigationMenuItems.MenuItemWrapper> result = UswdsNavigationMenuItems.getMenuItems(
      'TestMenu',
      'TestNetworkId',
      'Live',
      false,
      false
    );
    System.assertEquals(0, result.size(), 'Should return empty list');
  }
}
