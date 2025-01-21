import OpenModalButton from '../OpenModalButton/OpenModalButton';
import DeleteReviewModal from './DeleteReviewModal';

function DeleteReviewButton({reviewId,spotId}) {
  return (
    <div className="DeleteReviewButton">
      <OpenModalButton
        modalComponent={<DeleteReviewModal reviewId={reviewId} spotId={spotId}/>}
        buttonText="Delete"
      />
    </div>
  );
}

export default DeleteReviewButton;