import React from 'react';

import ListItem from './ListItem';
import BookingListItem from './BookingListItem';

const PlaceHolder = () => <div>No events!</div>;

const List = props => {
  return props.items.length ? (
    <>
      {props.title()}
      {props.items.map(item => {
        debugger;
        return props.isBookings ? (
          <BookingListItem
            title={item.event.title}
            id={item._id}
            onDelete={props.onDelete}
          />
        ) : (
          <ListItem
            key={item._id}
            id={item._id}
            title={item.title}
            price={item.price}
            date={item.date}
            description={item.description}
            isOwner={item.creator._id === props.userId}
            onClick={props.onClick}
          />
        );
      })}
    </>
  ) : (
    <PlaceHolder />
  );
};

export default List;
