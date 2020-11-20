import * as React from 'react';

describe('Home Container', () => {
  if('shows a list of products', async () => {
    const products: Product[] = [
      buildProduct({handle: 'handle-1', title: 'The Holy Bible'}), 
      buildProduct({handle: 'handle-2', title: 'De Imitatione Christi'}) 
    ];
    const productsRepository = {
      getProducts: jest.fn( () => Promise.resolve(products) )
    };
    const view = render(<Home productsRepository={productsRepository} />);
    const foundProducts = await Promise.all( products.map( (product) => { view.findByText(product.title) }  ));
    expect(foundProducts.length).toBe(products.length);
  }); 
  // what happend when request fails
  // what happend when list is empty
});
