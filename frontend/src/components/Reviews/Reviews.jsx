import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllReviews, getUserReviewsThunk } from "../../store/review";
import { useParams } from "react-router-dom";
import './Reviews.css';
import { getSpotDetail } from "../../store/spots";
import PostReviewButton from "./PostReviewModalButton";
import DeleteReviewButton from "./DeleteReviewButton";
import StarAndRating from "./StarAndRating";
import PostReviewFormModal from './PostReviewFormModal'; // Ensure you have this PostReviewFormModal component

function Reviews() {
  const dispatch = useDispatch();
  const { spotId } = useParams();

  const reviews = useSelector((state) => state.reviews.allReviews);
  const currentUser = useSelector((state) => state.session.user);
  const spot = useSelector((state) => state.spots.targetSpot);
  const userReviews = useSelector((state) => state.reviews.currentUserReviews);

  const checkReviewedSpot = currentUser ? Object.values(userReviews).filter((e) => e.spotId == spotId) : [];

  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // Add state for modal visibility

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await dispatch(getSpotDetail(spotId));
      await dispatch(getAllReviews(spotId));
      if (currentUser) {
        await dispatch(getUserReviewsThunk());
      }
      setIsLoading(false);
    };
    fetchData();
  }, [dispatch, spotId, currentUser]);

  if (isLoading) {
    return <img src="https://i.gifer.com/ZZ5H.gif" alt="Loading..." className="loadingGif" />;
  }

  const sortedReviews = Object.values(reviews).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="eachReview">
      <div className="starAndCountSection">
        <StarAndRating avgRating={spot.avgStarRating} />
        <span>{spot.numReviews ? `· ${spot.numReviews} Review${spot.numReviews === 1 ? '' : 's'}` : ''}</span>
      </div>
      {currentUser && (
        <div>
          {console.log("User: ", currentUser)}
          {console.log("Spot Owner: ", spot.ownerId)}
          {console.log("Has Reviewed: ", checkReviewedSpot.length > 0)}
          {currentUser.id !== spot.ownerId && (
            <>
              <p onClick={() => setShowModal(true)} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                Post a review
              </p>
              <PostReviewButton
                user={currentUser}
                spotOwnerId={spot.ownerId}
                hasReviewed={checkReviewedSpot.length > 0}
              />
            </>
          )}
        </div>
      )}
      {sortedReviews.map((review) => {
        const createdDate = new Date(review.createdAt);
        const options = { year: 'numeric', month: 'long' };
        const normalDate = createdDate.toLocaleDateString(undefined, options);
        return (
          <div key={review.id} className="reviewItem">
            {currentUser && currentUser.id === review.userId ? (
              <DeleteReviewButton reviewId={review.id} spotId={spotId} />
            ) : ("")}
            <h3 className="userFirstName">{review.User.firstName}</h3>
            <p className="reviewDate">{normalDate}</p>
            <p className="reviewText">{review.review}</p>
          </div>
        );
      })}
      {showModal && (
        <PostReviewFormModal onClose={() => setShowModal(false)} spotId={spotId} />
      )}
    </div>
  );
}

export default Reviews;
