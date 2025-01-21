import { useRef, useState, useContext, createContext } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const modalRef = useRef();
  const [modalContent, setModalContent] = useState(null);
  const [onModalClose, setOnModalClose] = useState(null);

  const closeModal = () => {
    setModalContent(null); 
 
    if (typeof onModalClose === "function") {
      setOnModalClose(null);
      onModalClose();
    }
  };

  const contextValue = {
    modalRef,  
    modalContent,  
    setModalContent,  
    setOnModalClose,  
    closeModal  
  };

  return (
    <>
      <ModalContext.Provider value={contextValue}>
        {children}
      </ModalContext.Provider>
      <div ref={modalRef} />
    </>
  );
}

export function Modal() {
  const { modalRef, modalContent, closeModal } = useContext(ModalContext);

  
  if (!modalRef || !modalRef.current || !modalContent) return null;

  // Example of replacing Font Awesome icons with emojis
  const closeButtonEmoji = '❌'; // Red cross emoji
  const modalHeaderEmoji = '🔔'; // Bell emoji (or any other icon emoji)

  return ReactDOM.createPortal(
    <div id="modal">
      <div id="modal-background" onClick={closeModal} />
      <div id="modal-content">
        <div id="modal-header">
          <span>{modalHeaderEmoji} Modal Title</span>
          <button onClick={closeModal} className="close-button">
            {closeButtonEmoji} Close
          </button>
        </div>
        <div>{modalContent}</div>
      </div>
    </div>,
    modalRef.current
  );
}

export const useModal = () => useContext(ModalContext);
