const tableName = process.env.SAMPLE_TABLE;
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const pug = require('pug');

async function deleteLinkRecord(id) {
  var params = {
    TableName: tableName,
    Key: {
      "id": id
    },
    ReturnValues: 'ALL_OLD'
  }
  return docClient.delete(params).promise();
}

exports.deleteByIdHandler = async (event) => {
  try {
    console.info('received:', event);
    const id = event.pathParameters.id;
    const deleteResult = await deleteLinkRecord(id);
    console.log(deleteResult);
    if (!deleteResult.Attributes)
      throw new Error('no old record was present');
    const result = 'deleted';

    return {
      statusCode: 200,
      body: result,
      headers: {
        'Content-Type': 'text/html',
      }
    };
  }catch(error){
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
