import React from 'react';

// import AuthContext from '../../context/auth-context';

import './List.css';

const ListItem = props => {
  const handleCancelBooking = () => {
    props.onDelete(props.id);
  };
  return (
    <div className='list__item'>
      <div>{props.title}</div>

      {props.onDelete && (
        <button type='button' className='btn' onClick={handleCancelBooking}>
          Delete
        </button>
      )}
    </div>
  );
};

export default ListItem;
