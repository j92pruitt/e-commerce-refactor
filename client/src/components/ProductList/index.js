import React, { useEffect } from 'react';
import ProductItem from '../ProductItem';
import { useStoreContext } from '../../utils/GlobalState';
import { useQuery } from '@apollo/client';
import { QUERY_PRODUCTS } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import spinner from '../../assets/spinner.gif';

import { useDispatch, useSelector } from 'react-redux';
import { REDUX_UPDATE_PRODUCTS, selectProducts } from '../../utils/redux/productSlice';


function ProductList() {
  const [state, dispatch] = useStoreContext();

  const { currentCategory } = state;

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  const products = useSelector(selectProducts)
  const reduxDispatch = useDispatch();

  useEffect(() => {

    if (data) {

      reduxDispatch( REDUX_UPDATE_PRODUCTS(data.products) )

      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });

    } else if (!loading) {

      idbPromise('products', 'get').then((products) => {

        reduxDispatch( REDUX_UPDATE_PRODUCTS(products) )
      });

    }
  }, [data, loading, dispatch, reduxDispatch]);

  function filterProducts() {
    if (!currentCategory) {
      return products
    }

    return products.filter(
      (product) => product.category._id === currentCategory
    );
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {products.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ProductList;
