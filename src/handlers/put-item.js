const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const tableName = process.env.LINKS_TABLE;
const shortid = require('shortid');
const pug = require('pug');


/**
 * generate random id for the link
 */
function generateRandomId() {
    return shortid.generate();
}


/**
 * Try to reserve link from the database, if allready exist generate new id
 * @param {linkki} link 
 * @returns id of the link inserted in database
 */
async function reserveLinkInDatabase(link) {
    for (let i = 0; i < 10; i++) {
        const id = generateRandomId();
        const clicks = 0;
        try {
            var params = {
                TableName: tableName,
                Item: { id: id, clicks, link },
                ConditionExpression: 'attribute_not_exists(id)'
            };
            const result = await docClient.put(params).promise();
            return id;
        } catch (exeption) {
            console.log('id in use, find another one');
        }
    }
    throw new Error("exchausted finding available random keys in database.. propably time to expand links namespace");
}


/**
 * handler to put links in. returns success page
 */
exports.putItemHandler = async (event) => {
    try {
        console.info('received:', event);
        const bodyDecoded = Buffer.from(event.body, 'base64').toString('utf-8')
        console.log(bodyDecoded);
        const body = new URLSearchParams(bodyDecoded);
        const link = body.get('link');

        if (!link)
            throw new Error('no link in the post');

        const id = await reserveLinkInDatabase(link);
        const shortlink = 'https://' + event.requestContext.domainName +
            event.rawPath+ id;
        const toRet = pug.renderFile('src/templates/add.pug', ({ linkki: shortlink }));

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
};
