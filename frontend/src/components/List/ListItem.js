import React from 'react';

// import AuthContext from '../../context/auth-context';

import './List.css';

const ListItem = props => {
  const handleViewDetails = () => {
    props.onClick(props.id);
  };
  return (
    <div className='list__item'>
      <div>
        <div>{props.title}</div>
        <div>Price: {props.price}$</div>
      </div>
      <div>
        <div>Date: {new Date(props.date).toLocaleDateString()}</div>
        <div>Description: {props.description}</div>
      </div>
      <div>
        {props.isOwner ? (
          <div>You are owner</div>
        ) : (
          <button type='button' className='btn' onClick={handleViewDetails}>
            View details
          </button>
        )}
      </div>
    </div>
  );
};

export default ListItem;
