const lambda = require('../../../src/handlers/put-item.js'); 
const dynamodb = require('aws-sdk/clients/dynamodb'); 
const shortid = require('shortid');

describe('Test putItemHandler', function () { 
    let putSpy; 
    shortid.generate = jest.fn().mockReturnValue('blaas');

    beforeAll(() => { 
        putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'put');
    }); 
 
    afterAll(() => { 
        putSpy.mockRestore(); 
    }); 

    it('should add id to the table', async () => { 
        const returnedItem = {"id": "id1","link": "name1"};
        putSpy.mockReturnValue({ 
            promise: () => Promise.resolve(returnedItem) 
        }); 


 
        const event = { 
            httpMethod: 'POST', 
            body: 'aWQ9aWQxJmxpbms9bmFtZTE=',
            requestContext: {domainName: 'test'},
            rawPath:'/plop/'
        }; 
     
        // Invoke putItemHandler() 
        const result = await lambda.putItemHandler(event); 
        const expectedResult = { 
            statusCode: 200, 
            body: "<html><head></head><body> <h1>Shortened link</h1><p>https://test/plop/blaas</p></body></html>",
            headers: {"Content-Type": "text/html"}
        }; 
 
        // Compare the result with the expected result 
        expect(result).toEqual(expectedResult); 
    }); 
}); 
 