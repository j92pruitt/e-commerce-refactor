import React from "react";
import { Link } from "react-router-dom";
import { pluralize } from "../../utils/helpers"
import { idbPromise } from "../../utils/helpers";

import { useDispatch, useSelector } from 'react-redux';
import { REDUX_ADD_TO_CART, REDUX_UPDATE_CART_QUANTITY, selectCart } from "../../utils/redux/cartSlice";

function ProductItem(item) {

  const {
    image,
    name,
    _id,
    price,
    quantity
  } = item;

  const reduxDispatch = useDispatch();
  const cart = useSelector(selectCart)

  const addToCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === _id)
    if (itemInCart) {

      reduxDispatch( 
        REDUX_UPDATE_CART_QUANTITY({
          _id: _id, 
          purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
        })
      );

      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });

    } else {

      reduxDispatch( REDUX_ADD_TO_CART({ ...item, purchaseQuantity: 1 }) )

      idbPromise('cart', 'put', { ...item, purchaseQuantity: 1 });
    }
  }

  return (
    <div className="card px-1 py-1">
      <Link to={`/products/${_id}`}>
        <img
          alt={name}
          src={`/images/${image}`}
        />
        <p>{name}</p>
      </Link>
      <div>
        <div>{quantity} {pluralize("item", quantity)} in stock</div>
        <span>${price}</span>
      </div>
      <button onClick={addToCart}>Add to cart</button>
    </div>
  );
}

export default ProductItem;
