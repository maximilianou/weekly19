import { Product } from '../models/product';

export const buildProduct = ( { 
  title = 'The Holy Bible',
  price = 200,
  handle = 'the book'
}: Partial<Product> ): Product => ( {
  handle,
  price,
  title
});
