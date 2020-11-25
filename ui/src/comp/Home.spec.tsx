import * as React from 'react';
import { render, RenderResult, fireEvent } from '@testing-library/react';
import { Home, HomeText } from './';
import { buildProduct } from '../__helpers/build-product';
import { Product } from '../models/product';
import { ProductsRepository } from '../repo/ProductsRepository';

describe('Home Container', () => {

  const buildProductRepository = (promise: Promise<Product[]>): ProductsRepository => ({
    getProducts: jest.fn( () => promise )
  });
 
  const buildCartRepository = () => ({
    addItem: jest.fn()
  })

  it('shows a list of products', async () => {
    const products: Product[] = [
      buildProduct({handle: 'handle-1', title: 'The Holy Bible'}), 
      buildProduct({handle: 'handle-2', title: 'De Imitatione Christi'}) 
    ];
    const productsRepository: ProductsRepository = buildProductRepository(Promise.resolve(products));
    const view = render(<Home productsRepository={productsRepository} />);
    const foundProducts = await Promise.all( products.map( (product) => view.findByText(product.title) ) );
    expect(foundProducts.length).toBe(products.length);
  });
  it('shows message when list is empty', async () => {
    const products: Product[] = [];
    const productsRepository: ProductsRepository = buildProductRepository(Promise.resolve(products));
    const view = render(<Home productsRepository={productsRepository} />);
    expect(view.queryByText(HomeText.emptyMessage)).toBeInTheDocument();

  });
  it.skip('shows an error when products can not be retrieved', async () => {
    const error = new Error('not retrieved products');
    const productsRepository: ProductsRepository = buildProductRepository(Promise.reject(error));
    const view = render(<Home productsRepository={productsRepository} cartRepository={buildCartRepository()} />);
    expect( view.findByText(error.message) ).toBeInTheDocument();
  });

  it('add item to cart', async () => {
    const firstProduct: Product = buildProduct({handle: 'first-product'});
    const secondProduct: Product = buildProduct({handle: 'second-product'});
    const productsReposiotry = buildProductRepository(Promise.resolve([firstProduct, secondProduct]));
    const cartRepository = buildCartRepository();
    const view = render(<Home productsRepository={productsReposiotry} cartRepository={cartRepository} />);
    const [, item] = await view.findAllByRole('button');
    fireEvent.click(item);
    expect(cartRepository.addItem).toHaveBeenCalledWith(secondProduct.handle);
  });

});
