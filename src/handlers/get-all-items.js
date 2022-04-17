const tableName = process.env.SAMPLE_TABLE;
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const pug = require('pug');

/**
 * replies with list of links and input form for adding new ones
 */
exports.getAllItemsHandler = async (event) => {
    try {
        console.info('received:', event);

        var params = {
            TableName: tableName
        };
        const data = await docClient.scan(params).promise();
        const items = data.Items;
        const toRet = pug.renderFile('src/templates/mainpage.pug', ({ links: items }));
        return {
            statusCode: 200,
            body: toRet,
            headers: {
                'Content-Type': 'text/html',
            }
        };
    } catch (error) {
        const toRet = pug.renderFile('src/templates/error.pug', ({ error }));
        return {
            statusCode: 200,
            body: toRet,
            headers: {
                'Content-Type': 'text/html',
            }
        };
    }
}
