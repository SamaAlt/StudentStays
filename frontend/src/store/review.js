import { csrfFetch } from './csrf';
import { getSpotDetail } from './spots';

const GET_SPOT_REVIEWS = 'reviews/GET_SPOT_REVIEWS';
const GET_USER_REVIEWS = 'reviews/GET_USER_REVIEWS'
const CLEAR_USER_REVIEWS = 'reviews/CLEAR_USER_REVIEWS';
const CLEAR_SPOT_REVIEWS = 'reviews/CLEAR_SPOT_REVIEWS'
const DELETE_REVIEW = 'reviews/DELETE_REVIEW';

export const clearUserReviews = () => ({type: CLEAR_USER_REVIEWS});
export const clearSpotReviews = () => ({type: CLEAR_SPOT_REVIEWS})
const getReviews = (reviews) => {
    return {
        type: GET_SPOT_REVIEWS,
        payload: reviews
    };
};

const getUserReviews = (userReviews) => {
    return {
        type: GET_USER_REVIEWS,
        payload:userReviews
    }
}

export const deleteReviewAction = (reviewId) => ({
    type: DELETE_REVIEW,
    payload:reviewId
  });


export const getAllReviews = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const data = await response.json();
    dispatch(getReviews(data.Reviews));
    return response;
};


export const getUserReviewsThunk = () => async(dispatch) =>{
    const res = await csrfFetch('/api/reviews/current');
    const data = await res.json();
    dispatch(getUserReviews(data.Reviews));
    return res
}

export const addReviewThunk = (spotId,review) => async(dispatch) =>{
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(review),
      });

      if (res.ok) {
        const newReview = await res.json();
        await dispatch(getAllReviews(spotId));
        await dispatch(getUserReviewsThunk());
        await dispatch(getSpotDetail(spotId));
        return newReview;
    } else {
        const errors = await res.json();
        return errors;
    }
}

export const deleteReviewThunk = (reviewId,spotId) => async(dispatch)=>{
    const res = await csrfFetch(`/api/reviews/${reviewId}`,{
      method: "DELETE"
    });
    if (res.ok) {
        dispatch(deleteReviewAction(reviewId));
        await dispatch(getAllReviews(spotId));
        await dispatch(getUserReviewsThunk());
        await dispatch(getSpotDetail(spotId));
    }
  }

const initialState = { allReviews: {}, currentUserReviews:{}};

export default function reviewReducer(state = initialState, action) {
    switch(action.type){
        case GET_SPOT_REVIEWS:

            return { ...state, allReviews: { 
                    ...action.payload.reduce((acc, review) => { 
                    acc[review.id] = review;
                        return acc
                    }, {}),
                },
            };
        case GET_USER_REVIEWS:
            return { ...state, currentUserReviews: {
                    ...action.payload.reduce((acc, review) => {
                    acc[review.id] = review;
                        return acc 
                    }, {}),
                },
            };
            case CLEAR_USER_REVIEWS:
                return {
                    ...state,
                    currentUserReviews: {},
                };
            case CLEAR_SPOT_REVIEWS:
                return {
                    ...state,
                    allReviews:{}
                }
            case DELETE_REVIEW: {
                const reviewId = action.payload;
                const newState = {...state};
                delete newState.allReviews[reviewId];
                delete newState.currentUserReviews[reviewId];
                return newState;
                }
        default:
            return state;
    }
}