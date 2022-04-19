const lambda = require('../../../src/handlers/del-by-id.js');
const dynamodb = require('aws-sdk/clients/dynamodb');

describe('Test del by id handler', () => {
    let getSpy;

    beforeAll(() => {
        getSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'delete');
    });


    afterAll(() => {
        getSpy.mockRestore();
    });

    it('should del item by id', async () => {
        getSpy.mockReturnValue({
            promise: () => Promise.resolve({ Attributes: ['ploah'] })
        });

        const event = {
            httpMethod: 'DEL',
            pathParameters: {
                id: 'id1'
            }
        }

        const result = await lambda.deleteByIdHandler(event)

        const expectedResult = {
            statusCode: 200,
            body: 'deleted',
            headers: {
                "Content-Type": "text/html",
            },

        };

        expect(result).toEqual(expectedResult);
    });
});
