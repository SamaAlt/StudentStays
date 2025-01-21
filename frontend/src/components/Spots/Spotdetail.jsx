import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpotDetail } from "../../store/spots";
import './Spots.css';
import { useParams } from "react-router-dom";
import { StarAndRating } from "../Reviews";
import { Reviews } from "../Reviews";
import { getSpots } from "../../store/spots";
import { toast, ToastContainer } from 'react-toastify';  // Add ToastContainer here
import 'react-toastify/dist/ReactToastify.css'; // Import styles for toast

function SpotDetail() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spots.targetSpot);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getSpotDetail(spotId));
      await dispatch(getSpots());
      setIsLoading(false);
    };
    fetchData();
  }, [dispatch, spotId]);

  if (isLoading) {
    return <img src="https://i.gifer.com/ZZ5H.gif" alt="Loading..." className="loadingGif" />;
  }

  const allImages = spot.SpotImages;

  const handleReserveClick = () => {
    toast.info("Feature coming soon", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeButton: true,
    });
  };

  return (
    <div className="spotDetail">
      <h1 data-testid="spot-name">{spot.name}</h1>
      <p data-testid="spot-location">{spot.city}, {spot.state}, {spot.country}</p>

      <div className="imageArea">
        <div data-testid="spot-large-image" className="largeImageArea">
          <img src={allImages[0]?.url} alt={spot.name} className="spotLargeImage" />
        </div>
        <div data-testid="spot-small-image" className="smallImageArea">
          {allImages?.slice(1, 5).map((image, index) => (
            <img key={index} src={image.url} alt={spot.name} className="spotSmallImage" />
          ))}
        </div>
      </div>

      <div className="spotInfoArea">
        <div className="descriptionArea">
          <h2 data-testid="spot-host">Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
          <p data-testid="spot-description">{spot.description}</p>
        </div>

        <div className="calloutBox" data-testid="spot-callout-box">
          <div className="reviewAndCount">
            <StarAndRating avgRating={spot.avgStarRating} />
            <span>
              {spot.numReviews ? `· ${spot.numReviews} Review${spot.numReviews === 1 ? '' : 's'}` : ''}
            </span>
          </div>
          <p data-testid="spot-price">${spot.price} / night</p>
          <button data-testid="reserve-button" onClick={handleReserveClick}>Reserve</button>
        </div>
      </div>
      <div className="reviewArea">
        <Reviews spotId={spot.id} />
      </div>

      {/* Toast Container to display notifications */}
      <ToastContainer />
    </div>
  );
}

export default SpotDetail;
