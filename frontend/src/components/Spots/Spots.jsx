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
      <div className="spotList">
        {Object.values(spots)
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))        
        .map((spot) => (
 <div key={spot.id} onClick={()=>redirecting(spot.id)}> 
          <div key={spot.id} className="eachSpot"  title={spot.name}>
            <div key={spot.id} className="images">
            <img src={spot.previewImage} alt={spot.name} className="spotThumbnail"/>
            </div>
              <div className="locationAndRating">
                  <p>{spot.city}, {spot.state}</p>
                  <StarAndRating avgRating={spot.avgRating}/>
              </div>
              <div className="priceSection">
                  <p>$ {spot.price} per night</p>
              </div>
          </div>
</div> 
        ))}
        
      </div>
    </div>
  );
}

export default Spots;