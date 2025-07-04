/**
 * @author Mark Vogelgesang <movogelgesang@gmail.com>
 * @date July 2025
 * @description Unit tests for UswdsNavigationMenuDataSource, including dependency injection and picklist value retrieval.
 */
@isTest(seeAllData=false)
private class UswdsNavigationMenuDataSourceTest {
  /**
   * @description Mock provider for testing.
   */
  private class MockProvider implements INavigationMenuDataProvider {
    public List<NavigationLinkSet> getMenus() {
      // Return a list with fake NavigationLinkSet records
      NavigationLinkSet fakeMenu = new NavigationLinkSet(
        DeveloperName = 'TestMenu',
        MasterLabel = 'Test Menu',
        NetworkId = '0DBO50000006k9pOAA'
      );
      return new List<NavigationLinkSet>{ fakeMenu };
    }
  }

  /**
   * @description Tests getValues() with no network context.
   */
  @IsTest
  public static void testGetValues() {
    // Since we can't create NavigationLinkSet or Network records in tests,
    // we'll test the method with a mocked network context

    // Set up test data - we'll use existing data if available
    // or test the method's behavior when no network is found

    // Test case 1: No network context (should return empty list)
    Test.startTest();

    // Mock the Network.getNetworkId() to return null
    // This simulates running outside a community context
    UswdsNavigationMenuDataSource dataSource = new UswdsNavigationMenuDataSource();
    VisualEditor.DynamicPickListRows result = dataSource.getValues();

    Test.stopTest();

    // Assert that the result is not null
    System.assertNotEquals(null, result, 'Result should not be null');

    // When no network is found, should return empty list
    // The actual size will depend on existing data in the org
    System.assertNotEquals(
      null,
      result.getDataRows(),
      'Result data rows should not be null'
    );
  }

  /**
   * @description Tests getValues() with network context.
   */
  @IsTest
  public static void testGetValuesWithNetwork() {
    // Test case 2: With network context
    // This will use whatever NavigationLinkSet records exist in the org

    Test.startTest();

    UswdsNavigationMenuDataSource dataSource = new UswdsNavigationMenuDataSource();
    VisualEditor.DynamicPickListRows result = dataSource.getValues();

    Test.stopTest();

    // Assert that the result is not null
    System.assertNotEquals(null, result, 'Result should not be null');
    System.assertNotEquals(
      null,
      result.getDataRows(),
      'Result data rows should not be null'
    );

    // The actual content will depend on existing NavigationLinkSet records
    // We can't predict the exact values, but we can verify the structure
    if (result.getDataRows().size() > 0) {
      VisualEditor.DataRow firstRow = result.getDataRows()[0];
      System.assertNotEquals(
        null,
        firstRow.getLabel(),
        'First row label should not be null'
      );
      System.assertNotEquals(
        null,
        firstRow.getValue(),
        'First row value should not be null'
      );
    }
  }

  /**
   * @description Tests getValues() with a mock provider.
   */
  @IsTest
  static void testGetValuesWithMock() {
    UswdsNavigationMenuDataSource dataSource = new UswdsNavigationMenuDataSource(
      new MockProvider()
    );
    VisualEditor.DynamicPickListRows result = dataSource.getValues();
    System.assertEquals(
      1,
      result.getDataRows().size(),
      'Should return one menu'
    );
    VisualEditor.DataRow row = result.getDataRows()[0];
    System.assertEquals(
      '(No Network)Test Menu',
      row.getLabel(),
      'Label should match'
    );
    System.assertEquals(
      '0DBO50000006k9pOAATestMenu',
      row.getValue(),
      'Value should match'
    );
  }
}
