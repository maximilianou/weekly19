import * as React from 'react';
import { ProductsRespository } from '../repo/ProductsRepository';
import { Product } from '../model/product';

interface HomeProps {
  productsRepository: ProductsRepository;
};

export const Home: React.FC<HomeProps> = ( {productsRepository} ) => {
  const [products, setProducts] = React.useState<Product[]>([]);
  React.useEffect(() => {
    productsRepository.getProducts().then(setProducts);
  }, []);
  return (
    <section>
      {products.map( (product) => <article key={product.handle}>{product.title}</article>  )}
    </section>
  );
};

