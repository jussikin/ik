const lambda = require('../../../src/handlers/get-by-id.js'); 
const dynamodb = require('aws-sdk/clients/dynamodb'); 
 
describe('Test getByIdHandler', () => { 
    let getSpy; 
    let updateSpy;
 
    beforeAll(() => { 
        getSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'get');
        updateSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'update');
    }); 
 
    afterAll(() => { 
        getSpy.mockRestore(); 
        updateSpy.mockRestore();
    }); 
 
    it('should get item by id', async () => { 
        const item = { id: 'id1', link:'blaeh' }; 
  
        getSpy.mockReturnValue({ 
            promise: () => Promise.resolve({ Item: item }) 
        }); 
        updateSpy.mockReturnValue({ 
            promise: () => Promise.resolve({ }) 
        }); 
 
        const event = { 
            httpMethod: 'GET', 
            pathParameters: { 
                id: 'id1' 
            } 
        } 
        const result = await lambda.getByIdHandler(event); 

 
        expect(result.body).toContain('odota'); 
    }); 
}); 
 