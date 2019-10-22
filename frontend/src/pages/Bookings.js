import React, { Component } from 'react';

import List from '../components/List';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import Backdrop from '../components/Backdrop';

import AuthContext from '../context/auth-context';

import './Events.css';

class Bookings extends Component {
  state = {
    modal: false,
    error: false,
    bookings: [],
    isLoading: false,
    selectedBooking: null,
  };

  static contextType = AuthContext;

  handleCloseClick = () => this.setState({ modal: false });

  handleCancelClick = id => {
    const requestBody = {
      query: `
            mutation CancelBooking($bookingId: ID!) {
              cancelBooking(bookingId: $bookingId) {
                _id
            }
          }
        `,
      variables: {
        bookingId: id,
      },
    };

    this.setState({ isLoading: true });

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.context.token}`,
      },
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(({ data }) => {
        const bookings = this.state.bookings.filter(i => i._id !== id);

        this.setState({
          bookings,
          isLoading: false,
        });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        console.log(err);
      });
  };

  // handleViewDetails = bookingId => {
  //   const selectedBooking = this.state.bookings.find(
  //     item => item.bookingId === bookingId
  //   );
  //   this.setState({
  //     selectedBooking,
  //     modal: true,
  //   });
  // };

  componentDidMount() {
    const requestBody = {
      query: `{
              bookings {
                _id
                createdAt
                event {
                  title
                }
            }
          }
        `,
    };

    this.setState({ isLoading: true });

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.context.token}`,
      },
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(({ data }) => {
        const bookings = data.bookings.reverse();
        this.setState({
          bookings,
          isLoading: false,
        });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        console.log(err);
      });
  }

  render() {
    const { selectedBooking, bookings, modal, isLoading } = this.state;

    if (isLoading) {
      return <Loader />;
    }
    return (
      <React.Fragment>
        {modal && <Backdrop />}
        {modal && (
          <Modal title={selectedBooking.title} onClose={this.handleCloseClick}>
            <div className='event__details'>
              <h1>{selectedBooking.title}</h1>
              <h2>{new Date(selectedBooking.date).toLocaleDateString()}</h2>
            </div>
          </Modal>
        )}
        <List
          title={() => <h1>Bookings</h1>}
          items={bookings}
          userId={this.context.userId}
          onDelete={this.handleCancelClick}
          isBookings={true}
        />
      </React.Fragment>
    );
  }
}

// Bookings.contextType = AuthContext;

export default Bookings;
