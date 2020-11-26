 

### comp/Home.spec.tsx
```tsx
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

```

### comp/Home.tsx
```tsx
import * as React from 'react';
import { Product } from '../models/product';
import { ProductCard } from './ProductCard';
import { productsRepository as productsRepositoryInstance, ProductsRepository } from '../repo/ProductsRepository';
import { cartRepository as cartRepositoryInstance, CartRepository } from '../repo/CartRepository';
export enum HomeText {
  emptyMessage = 'No products were found'
}
interface HomeProps {
  productsRepository?: ProductsRepository;
  cartRepository?: CartRepository;
};
export const Home: React.FC<HomeProps> = ( {
  productsRepository = productsRepositoryInstance, 
  cartRepository = cartRepositoryInstance } ) => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [error, setError] = React.useState<Error | null >(null);
  React.useEffect(() => {
    productsRepository.getProducts()
    .then(setProducts)
    .catch(setError)
  }, []);

  const hasProducts = () => products && products.length > 0
  
  return (
    <section>
      { error && <p>{error.message}</p> }
      {
        hasProducts()
        ? products.map( (product) => 
          <article key={product.handle}>
            <ProductCard
              product={product}
              onClick={cartRepository.addItem} 
            /></article> )
      : <p>{HomeText.emptyMessage}</p>
      }
    </section>
  );
};
```

### comp/ProductCard.spec.tsx
```tsx
import * as React from 'react';
import { render, RenderResult, fireEvent } from '@testing-library/react';
import { ProductCard } from '.';
import { buildProduct } from '../__helpers/build-product';
describe('ProductCard', () => {
  it('calls with product identifier when is clicked', ()=>{
      const product = buildProduct({ handle: 'one-handle'});
      const clickMock = jest.fn();
      const view = render(<ProductCard product={product} onClick={clickMock}/>);
      const button = view.getByRole('button');
      fireEvent.click(button);
      expect(clickMock).toHaveBeenCalledWith(product.handle);
  });
}
);

```

### comp/ProductCard.tsx
```tsx
 import * as React from 'react';
 import { Product } from '../models/product'; 
 interface ProductCardProps {
     product: Product;
     onClick: (handle: string)=>void;
 }
 export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick})=> (
  <div>
      <h3>{product.title}</h3>
     <p>Price: 
        <span>{product.price}</span>
    </p>
    { onClick &&
      <button type="button" onClick={() => {onClick(product.handle);}}>
          Add to Cart
      </button>
    }
  </div>
 );
```

### __helpers/build-product.ts
```tsx
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

```

### models/Product.ts
```tsx
export interface Product{
  handle: string;
  price: number;
  title: string;
}
```

### repo/ProductsRepository.ts
```tsx
import { Product } from '../models/product';
export interface ProductsRepository {
  getProducts: () => Promise<Product[]>;
};
export const productsRepository: ProductsRepository = {
  getProducts: () => 
    fetch('http://localhost:4000/products'
    ).then( response => response.json()
    ).then( data => data.products )
};
```
### repo/CartRepository.ts
```tsx
export interface CartRepository {
    addItem: (handle: string) => Promise<void>;
}
export const cartRepository: CartRepository = {
    addItem: (handle) => fetch('http://localhost:4000/cart',{
       method: 'PUT',
       body: JSON.stringify( { handle } )
    }).then( 
        response => response.json()
    )
};
```
