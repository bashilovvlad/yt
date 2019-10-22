import React, { Component } from 'react';

import Modal from '../components/Modal';
import Backdrop from '../components/Backdrop';
import List from '../components/List';
import Loader from '../components/Loader';

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
    events: [],
    isLoading: false,
    selectedEvent: null,
  };

  // static contextType = AuthContext;
  isActive = true;

  openModal = () => {
    this.setState({ modal: true });
  };

  handleCloseClick = () => {
    this.setState({ modal: false, selectedEvent: null });
  };

  handleConfirmClick = () => {
    const title = this.titleEl.current.value;
    const price = +this.priceEl.current.value;
    const date = this.dateEl.current.value;
    const description = this.descriptionEl.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      this.setState({ error: true });
      return;
    }

    this.setState({ isLoading: true, modal: false });

    const event = {
      title,
      price,
      date,
      description,
    };

    const requestBody = {
      query: `
          mutation CreateEvent($title: String!, $price: Float!, $description: String!, $date: String!) {
            createEvent(eventInput: {title: $title, price: $price, description: $description, date: $date}) {
              _id
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
        return res.json();
      })
      .then(({ data }) => {
        if (data.createEvent) {
          let events = [...this.state.events];
          events.unshift({
            ...data.createEvent,
            creator: { _id: this.context.userId },
          });

          this.setState({
            events,
            isLoading: false,
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleBookEvent = () => {
    if (!this.context.token) {
      this.setState({ selectedEvent: null });
      return;
    }
    const requestBody = {
      query: `
        mutation BookEvent($eventId: ID) {
          bookEvent(eventId: $eventId) {
            _id
            updatedAt
            createdAt
          }
        }
      `,
      variables: { eventId: this.state.selectedEvent._id },
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
      .then(({ data }) => {
        this.setState({ selectedEvent: null, modal: false });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleViewDetails = eventId => {
    debugger;
    const selectedEvent = this.state.events.find(item => item._id === eventId);
    this.setState({
      selectedEvent,
      modal: true,
    });
  };

  renderForm = () => {
    return (
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
    );
  };

  renderDetails = () => {
    const { selectedEvent } = this.state;
    return (
      <div className='event__details'>
        <h1>{selectedEvent.title}</h1>
        <h2>{new Date(selectedEvent.date).toLocaleDateString()}</h2>
        <h3>{selectedEvent.price}$</h3>
        <div>{selectedEvent.description}</div>
      </div>
    );
  };

  componentDidMount() {
    const requestBody = {
      query: `{
            events {
              _id
              title
              description
              price
              date
              creator {
                _id
                email
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
      },
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        if (this.isActive) {
          this.setState({ modal: false });
        }

        return res.json();
      })
      .then(({ data }) => {
        if (this.isActive) {
          this.setState({ events: data.events.reverse(), isLoading: false });
        }
      })
      .catch(err => {
        this.setState({ isLoading: false });
        console.log(err);
      });
  }

  componentWillUnmount() {
    this.isActive = false;
  }

  render() {
    if (this.state.isLoading) {
      return <Loader />;
    }
    return (
      <React.Fragment>
        {this.state.modal && <Backdrop />}
        {this.state.modal && (
          <Modal
            title={
              this.state.selectedEvent
                ? this.state.selectedEvent.title
                : 'Create event'
            }
            onClose={this.handleCloseClick}
            canConfirm={!!this.context.token}
            onConfirm={
              this.state.selectedEvent
                ? this.handleBookEvent
                : this.handleConfirmClick
            }
            confirmText={
              this.state.selectedEvent ? 'Book event' : 'Confirm create'
            }
          >
            {this.state.selectedEvent
              ? this.renderDetails()
              : this.renderForm()}
          </Modal>
        )}
        <List
          title={() =>
            this.context.token ? (
              <div className='alert'>
                <h1>Share your event !!!</h1>
                <button className='btn' onClick={this.openModal}>
                  create event
                </button>
              </div>
            ) : (
              <h1>Authorizate for booking and creating</h1>
            )
          }
          items={this.state.events}
          userId={this.context.userId}
          onClick={this.handleViewDetails}
        />
      </React.Fragment>
    );
  }
}

Events.contextType = AuthContext;

export default Events;
