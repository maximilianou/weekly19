import { products } from '../fixtures/catalog/products.json';
describe('Product Catalog', () => {

  const productsEndpoint = {
    method: 'GET',
    url: 'http://localhost:4000/products'
  };

  beforeEach(() => {
    cy.server();
  });

  it('shows the catalog', () => {
    //const productTitles = ['The Holy Bible','De Imitatione Christi', 'Hacia el Padre'];
    cy.route({...productsEndpoint ,"response": 'fixture:catalog/products' , "status": 200});
    cy.visit('/');
    //cy.contains('.products > li');
    products.map( ( { title } ) => {
      cy.contains(title);
    }); 
  });
});


