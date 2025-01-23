import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { addReviewThunk } from "../../store/review";
import './PostReviewFormModal.css';

function PostReviewFormModal({ onClose }) {
    const dispatch = useDispatch();
    const [review, setReview] = useState("");
    const spotId = useSelector((state) => state.spots.targetSpot.id);
    const [activeRating, setActiveRating] = useState(0);
    const [rating, setRating]= useState(0);
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();

    useEffect(() => {
        setReview("");
        setActiveRating(0);
        setRating(0);
        setErrors([]);
    }, []);

    const submitDisabled = review.length < 10 || rating === 0;
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newReview = {
        review,
        stars: rating,
        };

        const response = await dispatch(addReviewThunk(spotId, newReview));
        
        if (response && response.errors) {
        setErrors(response.errors);
        } else {
        closeModal();
        onClose();
        }
    };

    return (
        <>
        <form className= 'postReviewForm' onSubmit={handleSubmit}>
            <label className="reviewCommentSection">
            <span className="reviewTitle">How was your stay?</span>
            {errors.length > 0 && (<span>{errors}</span>)}
            <input className="reviewInputBox"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Leave your review here..."
            />
            </label >
            <label className="starsSection" onMouseLeave={() => setActiveRating(rating)}>
                {[1, 2, 3, 4, 5].map((starNumber) => (
                    <label key={starNumber} className="star" onMouseEnter={() => setActiveRating(starNumber)} onClick={() => setRating(starNumber)}>
                        <span 
                            style={{ fontSize: '24px', cursor: 'pointer' }} 
                            onClick={() => setRating(starNumber)}
                        >
                            {activeRating >= starNumber ? "✨" : "☆"}
                        </span>
                    </label>
                ))}
            </label>

            <div className="submitButtonSection">
            <button className='reviewSubmitButton' type="submit" disabled={submitDisabled}> Submit Your Review </button>
            </div>
        </form>
        </>
    );
}

export default PostReviewFormModal;
