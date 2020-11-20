import * as React from 'react';
import { render } from '@testing-library/react';
import { Home } from './';
import { buildProduct } from '../__helpers/build-product';
import { Product } from '../models/product';
import { ProductsRepository } from '../repo/ProductsRepository';

describe('Home Container', () => {

  const buildProductRepository = (products: Product[]): ProductsRepository => ({
    getProducts: jest.fn( () => Promise.resolve(products) )
  });
 

  it('shows a list of products', async () => {
    const products: Product[] = [
      buildProduct({handle: 'handle-1', title: 'The Holy Bible'}), 
      buildProduct({handle: 'handle-2', title: 'De Imitatione Christi'}) 
    ];
    const productsRepository: ProductsRepository = buildProductRepository(products);
    const view = render(<Home productsRepository={productsRepository} />);
    const foundProducts = await Promise.all( products.map( (product) => view.findByText(product.title) ) );
    expect(foundProducts.length).toBe(products.length);
  });
  it('shows message when list is empty', async () => {
    const products: Product[] = [];
    const emptyMessage = 'No Product were found';
    const productsRepository: ProductsRepository = buildProductRepository(products);
    const view = render(<Home productsRepository={productsRepository} />);
    expect(view.queryByText(emptyMessage)).toBeInTheDocument();

  });

});
