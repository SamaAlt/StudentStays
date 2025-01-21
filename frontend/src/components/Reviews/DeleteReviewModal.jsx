import { deleteReviewThunk } from "../../store/review"
import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal"
import './DeleteReviewModal.css'
function DeleteReviewModal ({reviewId,spotId}){
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const handleCancel = () => {
        closeModal()
    }
    const handleDelete = async () => {
        await dispatch(deleteReviewThunk(reviewId,spotId));
        closeModal();
    };


    return (
        <div className="modalSection">
          <h2 className="deleteTitle">Confirm Delition</h2>
          <p className="deleteMessage">Would you like to delete this review?</p>
          <div className="deleteButtons">
            <button className="delete-button" onClick={handleDelete}>
              Yes
            </button>
            <button className="cancel-button" onClick={handleCancel} >
              No 
            </button>
          </div>
        </div>


    )
}

export default DeleteReviewModal