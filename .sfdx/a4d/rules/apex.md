# Rule: Apex Best Practices

**Description:** Enforce best practices within Apex Code. Also enforce naming,  and formatting standards for Apex code

**Applies to:** `**/*.cls` and `**/*.trigger`.

**Guidelines:**
- Class names must be PascalCase (For example: `AccountService`)
- Method names must be camelCase
- Constants must be UPPER_SNAKE_CASE
- Use `@isTest` and `seeAllData=false` for all test classes
- Variable names must be camelCase and descriptive (For example: `accountList` or `isClosed`)
- Boolean variable names should start with 'is', 'has' ', or 'can' (For example: `isActive` or `hasAccess` )
- Use plural names for collections (For example: `contacts` or `accountsMap` )
- Avoid abbreviations and single-letter variables (For example: `account`, not `acc`)
- Avoid SOQL or DML inside 'for' loops. Use Maps and Sets to bulkify logic.
- DML should be in the user mode. For example: `insert as user` or `update as user`. 
- Use `WITH USER_MODE` explicitly for SOQL queries
- Test classes must use PascalCase and end with 'Test' (For example: `AccountServiceTest`)
- Test method names should describe the test scenario clearly (For example: `testCalculateTax_WithValidInput`)
- When writing Asserts always use the `System.Assert `class instead of `System assert`

## 1. Documenting Apex Classes and Triggers

Every Apex class and Trigger (`.cls`) should start with an ApexDoc block describing the class.

ApexDoc scans each class file, and looks for comment blocks with special keywords to identify the documentation to include for a given class, property, or method.  The comment blocks must always begin with /** (or additional *'s) and can cover multiple lines.  Each line must start with * (or whitespace and then *).  The comment block ends with */.  Special tokens are called out with @token.
### Class Comments
Located in the lines above the class declaration.  The special tokens are all optional.

| token | description |
|-------|-------------|
| @author | the author of the class |
| @date | the date the class was first implemented |
| @description | one or more lines that provide an overview of the class|

Example
```
/**
* @author Salesforce.com Foundation
* @date 2014
*
* @description Trigger Handler on Accounts that handles ensuring the correct system flags are set on
* our special accounts (Household, One-to-One), and also detects changes on Household Account that requires
* name updating.
*/
public with sharing class ACCT_Accounts_TDTM extends TDTM_Runnable {
```

### Property Comments

Located in the lines above a property.  The special tokens are all optional.

| token | description |
|-------|-------------|
| @description | one or more lines that describe the property|

Example
```
    /*******************************************************************************************************
    * @description specifies whether state and country picklists are enabled in this org.
    * returns true if enabled.
    */
    public static Boolean isStateCountryPicklistsEnabled {
        get {
```

### Method Comments

The comment block is located in the lines above a method.  The special tokens are all optional.

| token | description |
|-------|-------------|
| @description | one or more lines that provide an overview of the method|
| @param *param name* | a description of what the parameter does|
| @return | a description of the return value from the method|

Example
```
    /*******************************************************************************************************
    * @description Returns field describe data
    * @param objectName the name of the object to look up
    * @param fieldName the name of the field to look up
    * @return the describe field result for the given field
    */
    public static Schema.DescribeFieldResult getFieldDescribe(String objectName, String fieldName) {
```

## 2. Variable Naming

### Error Handling

Shorthand variable names when handling errors is ok.

Example
```
try {
    AccountWrapper.getRecords();
} catch (Exception e) {
    throw new AuraHandledException(e.getMessage());
}
```