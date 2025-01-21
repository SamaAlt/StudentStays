import { csrfFetch } from './csrf';

const GET_SPOTS = 'spots/GET_SPOTS';
const GET_SPOT_DETAIL = 'spots/GET_SPOT_DETAIL';
const ADD_SPOT = 'spots/ADD_SPOT';
const GET_OWNED_SPOTS = 'spots/GET_OWNED_SPOTS';
const DELETE_SPOT = 'spots/removeSpot';

const getAllSpots = (spots) => {
    return {
        type: GET_SPOTS,
        payload: spots
    };
};


const getSpotDetailAction = (spot) => {
    return {
        type: GET_SPOT_DETAIL,
        payload: spot
    };
};


const addSpot = (spotData) =>{
    return {
        type: ADD_SPOT,
        payload: spotData
    }
}

const getOwnedSpotsAction = (spots) =>{
  return{
    type:GET_OWNED_SPOTS,
    payload:spots
  }
}


export const deleteSpotAction = (spotId) => ({
  type: DELETE_SPOT,
  spotId
});


export const getSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');
    const data = await response.json();
    dispatch(getAllSpots(data.Spots));
    return response;
};


export const getSpotDetail = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    const data = await response.json();
    dispatch(getSpotDetailAction(data));
    return response;
};

export const addSpotThunk = (spotData) => async (dispatch) => {
  const { lat = 55, lng = 55, ...restSpotData } = spotData;
    const res = await csrfFetch("/api/spots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lat, lng, ...restSpotData }),
    });
  
    if (res.ok) {
      const newSpot = await res.json();
      dispatch(addSpot(newSpot));
      return newSpot;
    } else {
      const errors = await res.json();
      return errors;
    }
  }

export const addSpotImageThunk = (spotId, image) => async () => {
    const res = await csrfFetch(`/api/spots/${spotId}/images`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(image),
    });
  
    if (res.ok) {
      const newImage = await res.json();
      return newImage;
    } else {
      const errors = await res.json();
      return errors;
    }
  };
  
export const updateSpotThunk = (spotId,newData) => async()=> {
  const { lat = 55, lng = 55, ...restSpotData } = newData;
    const res = await csrfFetch(`/api/spots/${spotId}`,{
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lat, lng, ...restSpotData }),
    })
    if (res.ok) {
      const newSpot = await res.json();
      return newSpot;
    } else {
      const errors = await res.json();
      return errors;
    }
}

export const deleteSpotThunk = (spotId) => async(dispatch)=>{
  const res = await csrfFetch(`/api/spots/${spotId}`,{
    method: "DELETE"
  });
  if(res.ok){
    dispatch(deleteSpotAction(spotId));
    await dispatch(getAllSpotsOwnedByUser());
  }
}

export const getAllSpotsOwnedByUser = () =>async(dispatch)=>{
  const res = await csrfFetch('/api/spots/current');
  const data = await res.json();
  dispatch(getOwnedSpotsAction(data.Spots));
  return res;
}

const initialState = { allSpots: {}, targetSpot: {}, spotsOwnedByCurrentUser:{} };

export default function spotsReducer(state = initialState, action) {
    switch (action.type) {
        case GET_SPOTS: {
            const newState = { ...state};
            action.payload.forEach((spot) => {
                newState.allSpots[spot.id] = spot;
            });
            return newState;
        }
        case GET_SPOT_DETAIL: {
            return {
                ...state,
                targetSpot: action.payload,
            };
        }
        case ADD_SPOT: {
            const newState = {
              ...state,
              allSpots: {
                ...state.allSpots,
                [action.payload.id]: action.payload,
              },
            };
            return newState;
          }
        case GET_OWNED_SPOTS:{
          const newState = { ...state };
          newState.spotsOwnedByCurrentUser = {};
          action.payload.forEach((spot) => {
            newState.spotsOwnedByCurrentUser[spot.id] = spot;
          });
          return newState;
        }
        case DELETE_SPOT:{
          const newState = { ...state };
          delete newState.allSpots[action.spotId];
          delete newState.spotsOwnedByCurrentUser[action.spotId];
          return newState;
        }
        default:
            return state;
    }
}