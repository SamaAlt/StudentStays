import OpenModalButton from '../OpenModalButton/OpenModalButton';
import PostReviewFormModal from './PostReviewFormModal';

function PostReviewButton({ user }) {
  const canPostReview = user?.type === 'demo' || user?.isLoggedIn;

  return (
    <div className="PostReviewButton" data-testid="review-button">
      {canPostReview ? (
        <OpenModalButton
          modalComponent={<PostReviewFormModal />}
          buttonText="Post Your Review"
        />
      ) : (
        <p>You must be logged in to post a review.</p>
      )}
    </div>
  );
}

export default PostReviewButton;
