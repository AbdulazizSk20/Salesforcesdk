## Table of Contents
* [Engine](#engine)
    * [Login](#login)
    * [Login URL](#login-url)
    * [Getting all objects](#getting-all-objects)
    * [Getting all fields](#getting-all-fields)
    * [Describing object](#describing-object)
    * [Query](#query)
    * [Insert](#insert)
    * [Update](#update)
    * [Upsert](#upsert)
    * [Delete](#delete)
# 
# Engine
### Login
    
* **Method:**
    ```gherkin
    login(credential)
    ```
* **Description:**  Retrieves the access token and instance URL for the current Salesforce connection.
* **Parameters:**

    - `credential`: The credential object containing username and password.
* **Example:**
    ```gherkin
    const engine = new Engine('production')
    const connection= await engine.login(credential)
    ```

### Login URL

* **Method:**
    ```gherkin
    getLoginUrl()
    ```
* **Description:**  Navigates to the specified URL using the provided credentials.
* **Example:**
     ```gherkin
    const engine = new Engine('production','username')
    const connection= await engine.login(credential)
    await engine.getLoginUrl().then((url) => {
        console.log('Login URL:', url)
    })
    ```
### Getting all objects

* **Method:**
    ```gherkin
    getAllObject()
    ```
* **Description:**  Retrieves a list of all available Salesforce objects.
* **Example:**
    ```gherkin
    const engine = new Engine('production')
    engine.getAllObject().then((objects) => {
        console.log('All Objects:', objects)
    })
    ```
### Getting all fields

* **Method:**
    ```gherkin
    getAllFields(objectName: string)
    ```
* **Description:** Retrieves a list of all fields for the specified Salesforce object.
    * **Parameters:**

        - `objectName`: The name of the Salesforce object to retrieve fields for.

* **Example:**
    ```gherkin
    const engine = new Engine('production')
    engine.getAllFields('Contact').then((fields) => {
        console.log('All Fields of Contact:', fields)
    })
    ```
### Describing object

* **Method:**
    ```gherkin
    describeObject(objectName: string)
    ```
* **Description:** Describes the metadata of the specified Salesforce object.
    * **Parameters:**

        - `objectName`: The name of the Salesforce object to describe.

* **Example:**
    ```gherkin
    const engine = new Engine('production')
    engine.describeObject('Account').then((metadata) => {
        console.log('Metadata of Account:', metadata)
    })
    ```
### Query

* **Method:**
    ```gherkin
    query(soqlQuery: string)
    ```
* **Description:** Executes a SOQL query against the Salesforce connection and returns the query results.
    * **Parameters:**

        - `soqlQuery`: The SOQL query to execute.

* **Example:**
    ```gherkin
    const engine = new Engine('production')
    engine.query('SELECT Id, Name FROM Account').then((results) => {
        console.log('Query Results:', results)
    })
    ```
### Insert

* **Method:**
    ```gherkin
    insert(records, object)
    ```
* **Description:** Inserts new records into the specified Salesforce object.
    * **Parameters:**

        - `records`: An array of records to insert.
        - `object`: The name of the Salesforce object to upsert records in.

* **Example:**
    ```gherkin
    const engine = new Engine('production')
    const records = [{ Name: 'John Doe', Email: 'johndoe@email.com' }]
    engine.insert(records, object).then((saveResult) => {
        console.log('Insert Result:', saveResult)
    })
    ```
### Update

* **Method:**
    ```gherkin
    update(records, object)
    ```
* **Description:**  Updating existing records in the specified Salesforce object
    * **Parameters:**

        - `records`: An array of records to update.
        - `object`: The name of the Salesforce object to upsert records in.

* **Example:**
    ```gherkin
    const engine = new Engine('production')
    const records = [{ Id: '005700000012345', Name: 'Jane Doe', Email: 'janedoe@email.com' }]
    engine.update(records, object).then((saveResult) => {
        console.log('Update Result:', saveResult)
    })
    ```
### Upsert

* **Method:**
    ```gherkin
    upsert(records, object, externalId)
    ```
* **Description:** Creating or updating records in the specified Salesforce object based on the external ID
* **Parameters:**
    - `records`:An array of records to upsert.
    - `object`: The name of the Salesforce object to upsert records in.
    - `externalId`:The name of the external ID field.
* **Example:**
    ```gherkin
    const engine = new Engine('production')
    const records = [{ Id: '005700000012345', Name: 'Jane Doe', Email: 'janedoe@email.com' }]
    engine.upsert(records,object,externalId).then((saveResult) => {
        console.log('Upsert Result:', saveResult)
    })
    ```
### Delete

* **Method:**
    ```gherkin
    delete(records, object)
    ```
* **Description:** Creating or updating records in the specified Salesforce object based on the external ID
* **Parameters:**
    - `records`:An object containing the record IDs to delete.
    - `object`: The name of the Salesforce object to delete records from.
* **Example:**
    ```gherkin
    const engine = new Engine('production')
    const records = [{ Id: '005700000012345' }]
    engine.delete(records).then((saveResult) => {
        console.log('Delete Result:', saveResult)
    })
    ```