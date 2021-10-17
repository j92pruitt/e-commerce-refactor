import React from 'react';
import { idbPromise } from "../../utils/helpers";

import { useDispatch } from 'react-redux';
import { REDUX_REMOVE_FROM_CART, REDUX_UPDATE_CART_QUANTITY } from '../../utils/redux/cartSlice';

const CartItem = ({ item }) => {

  const reduxDispatch = useDispatch();

  const removeFromCart = item => {

    reduxDispatch( REDUX_REMOVE_FROM_CART(item._id) )

    idbPromise('cart', 'delete', { ...item });

  };

  const onChange = (e) => {
    const value = e.target.value;
    if (value === '0') {

      reduxDispatch( REDUX_REMOVE_FROM_CART(item._id) )

      idbPromise('cart', 'delete', { ...item });

    } else {

      reduxDispatch(
        REDUX_UPDATE_CART_QUANTITY({
          _id: item._id,
          purchaseQuantity: parseInt(value)
        })
      );

      idbPromise('cart', 'put', { ...item, purchaseQuantity: parseInt(value) });

    }
  }

  return (
    <div className="flex-row">
      <div>
        <img
          src={`/images/${item.image}`}
          alt=""
        />
      </div>
      <div>
        <div>{item.name}, ${item.price}</div>
        <div>
          <span>Qty:</span>
          <input
            type="number"
            placeholder="1"
            value={item.purchaseQuantity}
            onChange={onChange}
          />
          <span
            role="img"
            aria-label="trash"
            onClick={() => removeFromCart(item)}
          >
            🗑️
          </span>
        </div>
      </div>
    </div>
  );
}

export default CartItem;