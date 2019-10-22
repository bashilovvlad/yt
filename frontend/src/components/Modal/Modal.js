import React, { useRef, useEffect } from 'react';
import './Modal.css';

function useClickOutside(func) {
  const node = useRef(null);

  const onDocumentClick = event => {
    if (!node.current.contains(event.target)) {
      func();
    }
  };

  useEffect(() => {
    document.addEventListener('click', onDocumentClick);

    return () => document.removeEventListener('click', onDocumentClick);
  }, []);

  return node;
}

const Modal = props => {
  const node = useClickOutside(props.onClose);

  return (
    <div className='modal' ref={node}>
      <header className='modal__header'>
        <h1>{props.title}</h1>
      </header>
      <section className='modal__content'>{props.children}</section>
      <section className='modal__actions'>
        <button className='btn' type='button' onClick={props.onClose}>
          Close
        </button>
        {props.canCancel && (
          <button className='btn' type='button' onClick={props.onCancel}>
            Cancel booking
          </button>
        )}
        {props.canConfirm && (
          <button className='btn' type='button' onClick={props.onConfirm}>
            {props.confirmText}
          </button>
        )}
      </section>
    </div>
  );
};
export default Modal;
