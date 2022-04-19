const lambda = require('../../../src/handlers/get-all-items.js'); 
const dynamodb = require('aws-sdk/clients/dynamodb');
const pug = require('pug');
 
describe('Test getAllItemsHandler', () => { 
    let scanSpy; 
    pug.renderFile = jest.fn().mockReturnValue('blaas');
    beforeAll(() => { 
        scanSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'scan'); 
    }); 
 
    afterAll(() => { 
        scanSpy.mockRestore(); 
    }); 
 
    it('should return ids', async () => { 
        const items = [{ id: 'id1' }, { id: 'id2' }]; 
        scanSpy.mockReturnValue({ 
            promise: () => Promise.resolve({ Items: items }) 
        }); 
 
        const event = { 
            httpMethod: 'GET' 
        } 
 
        const result = await lambda.getAllItemsHandler(event); 
        const expectedResult = { 
            statusCode: 200, 
            body: 'blaas',
            headers: {
                    "Content-Type": "text/html",
           },
        }; 
        expect(result).toEqual(expectedResult); 
    }); 
}); 
