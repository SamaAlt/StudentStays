// components/reviews/postreviewmodalbutton.jsx

import OpenModalButton from '../OpenModalButton/OpenModalButton';
import PostReviewFormModal from './PostReviewFormModal';


function PostReviewButton({ user, spotOwnerId, hasReviewed }) {
  const canPostReview = user?.isLoggedIn && user.id !== spotOwnerId && !hasReviewed;

  return (
    <div className="PostReviewButton" data-testid="review-button">
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
