import * as React from 'react';
import { ProductsRepository } from '../repo/ProductsRepository';
import { Product } from '../models/product';

interface HomeProps {
  productsRepository: ProductsRepository;
};

export const Home: React.FC<HomeProps> = ( {productsRepository} ) => {
  const [products, setProducts] = React.useState<Product[]>([]);
  React.useEffect(() => {
    productsRepository.getProducts().then(setProducts);
  }, []);

  const hasProducts = () => products && products.length > 0
  
  return (
    <section>
      {
        hasProducts()
        ? products.map( (product) => <article key={product.handle}>{product.title}</article>  )
        : <p>No Product were found</p>
      }
    </section>
  );
};

