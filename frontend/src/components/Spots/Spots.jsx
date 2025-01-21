import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpots } from "../../store/spots";
import './Spots.css';
import { useNavigate } from "react-router-dom";
import { StarAndRating } from "../Reviews";

function Spots() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const spots = useSelector((state) => state.spots.allSpots);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getSpots()); 
      setIsLoading(false); 
    };
    fetchData();
  }, [dispatch]);

  if (isLoading) {
    return <img src="https://i.gifer.com/ZZ5H.gif" alt="Loading..." className="loadingGif" />;
  }

  const redirecting = (spotId) => {
    navigate(`/spots/${spotId}`)
  };


  return (
    <div>
      <div className="spotList" data-testid='spots-list'>
        {Object.values(spots)
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))        
        .map((spot) => (
 <div key={spot.id} data-testid='spot-tile' onClick={()=>redirecting(spot.id)}> 
          <div key={spot.id} className="eachSpot"  title={spot.name} data-testid='spot-tooltip' >
            <div key={spot.id} className="images">
            <img src={spot.previewImage} alt={spot.name} className="spotThumbnail" data-testid='spot-thumbnail-image'/>
            </div>
              <div className="locationAndRating">
                  <p data-testid='spot-city'>{spot.city}, {spot.state}</p>
                  <StarAndRating avgRating={spot.avgRating}/>
              </div>
              <div className="priceSection">
                  <p data-testid='spot-price'>$ {spot.price} per night</p>
              </div>
          </div>
</div> 
        ))}
        
      </div>
    </div>
  );
}

export default Spots;