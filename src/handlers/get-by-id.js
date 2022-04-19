const tableName = process.env.LINKS_TABLE;
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const redirect = require('html-redirect');
const pug = require('pug');

function streamToString(stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  })
}

async function incrementClickCounter(id) {
  var params = {
    TableName: tableName,
    Key: {
      "id": id
    },
    UpdateExpression: "set clicks = clicks + :val",
    ExpressionAttributeValues: {
      ":val": 1
    },
    ReturnValues: "UPDATED_NEW"
  };
  await docClient.update(params).promise();
}

async function getLinkItemFromDatabase(id) {
  var params = {
    TableName: tableName,
    Key: { id: id },
  };
  return docClient.get(params).promise();
}

exports.getByIdHandler = async (event) => {
  try {
    console.info('received:', event);
    const id = event.pathParameters.id;
    const data = await getLinkItemFromDatabase(id);
    if (!data.Item)
      throw (new Error('no such link exists'));
    const redirectStream = redirect(data.Item.link, { timeout: 0, title: 'odota siirtoa', placeholder: 'jos siirto ei toimi kayta linkkia' });
    const result = await streamToString(redirectStream);
    await incrementClickCounter(id);
    return {
      statusCode: 200,
      body: result,
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
