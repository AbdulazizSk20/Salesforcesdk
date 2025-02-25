import jsforce from 'jsforce';
import { CacheProvider } from './cache';
/**
* The Engine class manages the connection to Salesforce and provides methods for
* logging in, retrieving access token and instance URL, and constructing the login URL.
*/
export class Engine {
    private defaultLoginUrl: string | undefined
    /**
    * Creates an Engine instance and initializes the connection based on the specified org type.
    *
    * @param {string} environment - The type of Salesforce org, either "production" or "sandbox".
    */
    constructor(environment: string) {
        if (environment.toLowerCase() != "production" && environment.toLowerCase() != "sandbox") {
            throw new Error("Invalid org type !, your org type should be production or sandbox.");
        }
        else {
            if (environment.toLowerCase() == "production") {
                this.defaultLoginUrl = 'https://login.salesforce.com/';
            }
            else if (environment.toLowerCase() == "sandbox") {
                this.defaultLoginUrl = 'https://test.salesforce.com/';
            }
        }
    }
    /**
    * Attempts to log in to Salesforce using the provided credentials.
    *
    * @param {object} credential - The credential object containing username and password.
    * @returns {Promise<jsforce.Connection>} - A promise that resolves to the connection object upon successful login.
    */
    public async login(credential) {
        const userKey = `con:${credential.username}`;
        CacheProvider.setCache("currentCredentials", credential);
        if (!CacheProvider.hasCache(userKey)) {
            let conn = new jsforce.Connection({
                loginUrl: this.defaultLoginUrl,
            });
            await conn.login(
                credential.username,
                credential.password,
                async (err, userInfo) => {
                    if (err) {
                        console.error(err);
                    }
                }
            );
            CacheProvider.setCache(userKey, conn);
        }
        return CacheProvider.getCache(userKey);
    }
    /**
    * Constructs and returns the login URL using the instance URL and access token.
    *
    * @returns {string} - The login URL, or throws an error if not logged in.
    */
    public async getLoginUrl() {
        const conn = await this.login(CacheProvider.getCache('currentCredentials'));
        return `${conn.instanceUrl}//secur/frontdoor.jsp?sid=${conn.accessToken}`;
    }
    /**
    * Retrieves a list of all available Salesforce objects.
    *
    * @returns {Promise<jsforce.SObject[]>} - A promise that resolves to an array of SObject metadata objects.
    */
    public async getAllObject(): Promise<any> {
        const conn = await this.login(CacheProvider.getCache('currentCredentials'));
        const objectListKey = `objectList:${conn.userInfo.id}`
        if (!CacheProvider.hasCache(objectListKey)) {
            return new Promise((resolve, reject) => {
                conn.describeGlobal(function (err, res) {
                    if (err) { reject(err); }
                    resolve(res.sobjects)
                    CacheProvider.setCache(objectListKey, res.sobjects);
                });
            });
        }
        return CacheProvider.getCache(objectListKey);
    }
    /**
    * Retrieves a list of all fields for a given Salesforce object.
    *
    * @param {string} objectName - The name of the Salesforce object to retrieve fields for.
    * @returns {Promise<jsforce.Field[]>} - A promise that resolves to an array of field metadata objects.
    */
    public async getAllFields(objectName: string) {
        const conn = await this.login(CacheProvider.getCache('currentCredentials'));
        const objectFieldsKey = `objectFields:${objectName}:${conn.userInfo.id}`
        if (!CacheProvider.hasCache(objectFieldsKey)) {
            return new Promise((resolve, reject) => {
                conn.describe(objectName, function (err, meta) {
                    if (err) { reject(err); }
                    CacheProvider.setCache(objectFieldsKey, meta.fields);
                    resolve(meta.fields)
                });
            });
        }
        return CacheProvider.getCache(objectFieldsKey);
    }
    /**
    * Describes the metadata of a Salesforce object.
    *
    * @param {string} objectName - The name of the Salesforce object to describe.
    * @returns {Promise<jsforce.SObjectMetadata>} - A promise that resolves to the SObject metadata object.
    */
    public async describeObject(objectName: string) {
        const conn = await this.login(CacheProvider.getCache('currentCredentials'));
        const objectInfoKey = `objectInfo:${objectName}:${conn.userInfo.id}`
        if (!CacheProvider.hasCache(objectInfoKey)) {
            return new Promise((resolve, reject) => {
                conn.describe(objectName, function (err, meta) {
                    if (err) { reject(err); }
                    CacheProvider.setCache(objectInfoKey, meta);
                    resolve(meta)
                });
            });
        }
        return CacheProvider.getCache(objectInfoKey);
    }
    /**
    * Executes a SOQL query against the Salesforce connection and returns the query results.
    *
    * @param {string} query - The SOQL query to execute.
    * @returns {Promise<jsforce.QueryResult>} - A promise that resolves to the query result object.
    */
    public async query(query: string) {
        const conn = await this.login(CacheProvider.getCache('currentCredentials'));
        return new Promise((resolve, reject) => {
            conn.query(query, function (err, result) {
                if (err) {
                    reject(console.error(err));
                }
                else {
                    resolve(result)
                }
            });
        });
    }
    /**
    * Inserts new records into the specified Salesforce object.
    *
    * @param {object[]} records - An array of records to insert.
    * @param {string} object - The name of the Salesforce object to insert records into.
    * @returns {Promise<jsforce.SaveResult>} - A promise that resolves to the save result object.
    */
    public async insert(records, object: string) {
        const conn = await this.login(CacheProvider.getCache('currentCredentials'));
        return new Promise((resolve, reject) => {
            conn.sobject(object).create(records, function (err, ret) {
                if (err || !ret.success) { reject(err); }
                resolve(ret);
            });
        });
    }
    /**
    * Updates existing records in the specified Salesforce object.
    *
    * @param {object[]} records - An array of records to update.
    * @param {string} object - The name of the Salesforce object to update records in.
    * @returns {Promise<jsforce.SaveResult>} - A promise that resolves to the save result object.
    */
    public async update(records, object: string) {
        const conn = await this.login(CacheProvider.getCache('currentCredentials'));
        return new Promise((resolve, reject) => {
            conn.sobject(object).update(records, function (err, ret) {
                if (err || !ret.success) { reject(err); }
                resolve(ret);
            });
        });
    }
    /**
    * Creates or updates records in the specified Salesforce object based on the external ID.
    *
    * @param {object[]} records - An array of records to upsert.
    * @param {string} object - The name of the Salesforce object to upsert records in.
    * @param {string} extId - The name of the external ID field.
    * @returns {Promise<jsforce.SaveResult>} - A promise that resolves to the save result object.
    */
    public async upsert(records, object: string, extId: string) {
        const conn = await this.login(CacheProvider.getCache('currentCredentials'));
        return new Promise((resolve, reject) => {
            conn.sobject(object).upsert(records, extId, function (err, ret) {
                if (err || !ret.success) { reject(err); }
                resolve(ret);
            });
        });
    }
    /**
    * Deletes records from the specified Salesforce object.
    *
    * @param {object} records - An object containing the record IDs to delete.
    * @param {string} object - The name of the Salesforce object to delete records from.
    * @returns {Promise<jsforce.SaveResult>} - A promise that resolves to the save result object.
    */
    public async delete(records, object: string) {
        const conn = await this.login(CacheProvider.getCache('currentCredentials'));
        return new Promise((resolve, reject) => {
            conn.sobject(object).destroy(records, function (err, ret) {
                if (err || !ret.success) { reject(err); }
                resolve(ret);
            });
        });
    }
}