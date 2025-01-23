import './PostReviewModalButton.css';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import PostReviewFormModal from './PostReviewFormModal';

function PostReviewButton({ user, spotOwnerId, hasReviewed }) {
  const canPostReview = user?.isLoggedIn && user.id !== spotOwnerId && !hasReviewed;

  return (
    <div className="PostReviewButton buttonBorder">
      {canPostReview ? (
        <OpenModalButton
          modalComponent={<PostReviewFormModal />}
          buttonText="Post Your Review"
        />
      ) : null}
    </div>
  );
}

export default PostReviewButton;