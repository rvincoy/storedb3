const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Store DB API',
    description: 'Store DB API documentation'
  },
  host: 'storedb-wyw9.onrender.com',
  schemes: ['https'],
  components: {
    schemas: {
      Products: {
        ProductName: 'string',
        Description: 'string',
        Category: 'string',
        Price: 'number',
        Stock: 'number'
      },
      Returns: {
        ProductName: 'string',
        Description: 'string',
        Category: 'string',
        Price: 'number',
        Stock: 'number'
      },
      Users: {
        UserName: 'string',
        DisplayName: 'string',
        email: 'string',
        Role: 'string'
      },
      Ledgers: {
        ProductID: 'string',
        ProductName: 'string',
        Description: 'string',
        Category: 'string',
        CoGS: 'number',
        Quantity: 'number',
        Price: 'number',
        TotalPrice: 'number',
        DateOfPurchase: 'date'
      }
    }
  }
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);

// Run server after it gets generated
// swaggerAutogen(outputFile, endpointsFiles, doc).then(async () => {
//   await import('./index.js');
// });