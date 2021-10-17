import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import Cart from '../components/Cart';
import { QUERY_PRODUCTS } from '../utils/queries';
import { idbPromise } from '../utils/helpers';
import spinner from '../assets/spinner.gif';
import { useDispatch, useSelector } from 'react-redux';
import { REDUX_UPDATE_PRODUCTS, selectProducts } from '../utils/redux/productSlice';
import { REDUX_ADD_TO_CART, REDUX_REMOVE_FROM_CART, REDUX_UPDATE_CART_QUANTITY, selectCart } from '../utils/redux/cartSlice';

function Detail() {
  const { id } = useParams();

  const [currentProduct, setCurrentProduct] = useState({});

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  const cart = useSelector(selectCart);
  const products = useSelector(selectProducts);
  const reduxDispatch = useDispatch();

  useEffect(() => {
    // already in global store

    if (products.length) {
      setCurrentProduct(products.find((product) => product._id === id));
    }

    // retrieved from server
    else if (data) {

      reduxDispatch( REDUX_UPDATE_PRODUCTS(data.products) );

      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    }
    // get cache from idb
    else if (!loading) {
      idbPromise('products', 'get').then((indexedProducts) => {

        reduxDispatch( REDUX_UPDATE_PRODUCTS(indexedProducts) );
      });
    }
  }, [products, data, loading, id, reduxDispatch]);

  const addToCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === id);
    if (itemInCart) {

      reduxDispatch( 
        REDUX_UPDATE_CART_QUANTITY({
          _id: id, 
          purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
        })
      );

      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
      });
    } else {

      reduxDispatch( REDUX_ADD_TO_CART({ ...currentProduct, purchaseQuantity: 1 }) );

      idbPromise('cart', 'put', { ...currentProduct, purchaseQuantity: 1 });
    }
  };

  const removeFromCart = () => {

    reduxDispatch( REDUX_REMOVE_FROM_CART(currentProduct._id) );

    idbPromise('cart', 'delete', { ...currentProduct });
  };

  return (
    <>
      {currentProduct && cart ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <p>{currentProduct.description}</p>

          <p>
            <strong>Price:</strong>${currentProduct.price}{' '}
            <button onClick={addToCart}>Add to Cart</button>
            <button
              disabled={!cart.find((p) => p._id === currentProduct._id)}
              onClick={removeFromCart}
            >
              Remove from Cart
            </button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
      <Cart />
    </>
  );
}

export default Detail;
