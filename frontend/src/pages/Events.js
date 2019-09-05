import React, { Component } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';

import AuthContext from '../context/auth-context';

import './Events.css';

class Events extends Component {
  constructor(props) {
    super(props);
    this.titleEl = React.createRef();
    this.descriptionEl = React.createRef();
    this.priceEl = React.createRef();
    this.dateEl = React.createRef();
  }

  state = {
    modal: false,
    error: false,
  };

  static contextType = AuthContext;

  openModal = () => {
    this.setState({ modal: true });
  };

  handleCancleclick = () => {
    this.setState({ modal: false });
  };

  handleConfirmClick = () => {
    console.log(this.context.token);
    const title = this.titleEl.current.value;
    const price = this.priceEl.current.value;
    const date = this.dateEl.current.value;
    const description = this.descriptionEl.current.value;

    this.setState({ error: false });

    if (
      title.trim().length === 0 ||
      price.trim().length === 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      this.setState({ error: true });
      return;
    }

    const event = {
      title,
      price: +price,
      date,
      description,
    };

    const requestBody = {
      query: `
          mutation CreateEvent($title: String!, $price: Float!, $description: String!, $date: String!) {
            createEvent(eventInput: {title: $title, price: $price, description: $description, date: $date}) {
              title
              description
              date
              price
            }
          }
        `,
      variables: { ...event },
    };

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
        this.setState({ modal: false });

        return res.json();
      })
      .then(resData => {
        debugger;
        // if (resData.data.login.token) {
        //   this.context.login(
        //     resData.data.login.token,
        //     resData.data.login.userId,
        //     resData.data.login.tokenExpiration
        //   );
        // }
      })
      .catch(err => {
        console.log(err);
      });
  };

  submitHandler = () => {};

  render() {
    return (
      <React.Fragment>
        {this.state.modal && <Backdrop />}
        {this.state.modal && (
          <Modal
            title='Create event'
            canCancel={true}
            canConfirm={true}
            onCancel={this.handleCancleclick}
            onConfirm={this.handleConfirmClick}
            confirmText='Confirm'
          >
            <form onSubmit={this.submitHandler}>
              {this.state.error && <div>Fill all fields</div>}
              <div className='form-control'>
                <label className='form-control__mail'>
                  <span>Title</span>
                  <input type='text' ref={this.titleEl} />
                </label>
                <label className='form-control__password'>
                  <span>Price</span>
                  <input type='number' ref={this.priceEl} />
                </label>
                <label className='form-control__password'>
                  <span>Date</span>
                  <input type='datetime-local' ref={this.dateEl} />
                </label>
                <label className='form-control__password'>
                  <span>Description</span>
                  <textarea ref={this.descriptionEl} rows={5} />
                </label>
              </div>
            </form>
          </Modal>
        )}
        <div className='events'>
          <h1>Share your event !!!</h1>
          <button className='btn' onClick={this.openModal}>
            create event
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default Events;
