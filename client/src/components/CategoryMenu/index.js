import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_CATEGORIES } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import { REDUX_UPDATE_CATEGORIES, REDUX_UPDATE_CURRENT_CATEGORY, selectCategories } from '../../utils/redux/categorySlice';
import { useDispatch, useSelector } from 'react-redux';

function CategoryMenu() {

  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  const reduxDispatch = useDispatch();
  const categories = useSelector(selectCategories)

  useEffect(() => {
    if (categoryData) {

      reduxDispatch( REDUX_UPDATE_CATEGORIES(categoryData.categories) );

      categoryData.categories.forEach((category) => {
        idbPromise('categories', 'put', category);
      });
    } else if (!loading) {
      idbPromise('categories', 'get').then((categories) => {

        reduxDispatch( REDUX_UPDATE_CATEGORIES(categories) );
      });
    }
  }, [categoryData, loading, reduxDispatch]);

  const handleClick = (id) => {

    reduxDispatch( REDUX_UPDATE_CURRENT_CATEGORY(id) )
  };

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map((item) => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;
