import { useEffect, useState } from "react";
import "./LandingPage.css";

const LandingPage = () => {
    const [spots, setSpots] = useState([]);

    useEffect(() => {
        const fetchSpots = async () => {
            try {
                const response = await fetch("/api/spots");
                const data = await response.json();
                
                const updatedSpots = data.Spots.map((spot) => {
                    const previewImage = spot.SpotImages?.find(img => img.preview)?.url || "/default-image.jpg"; // Fallback image if none found
                    return { ...spot, previewImage };
                });

                setSpots(updatedSpots);
            } catch (error) {
                console.error("Error fetching spots:", error);
            }
        };

        fetchSpots();
    }, []);

    return (
        <div className="landing-page">
            <h2 className="landing-page-title">Kickstart Your Studies</h2>
            <h3 className="landing-page-title2">Make Yourself at Home</h3>
            <div className="listings-grid">
                {spots.map((spot) => (
                    <div className="listing-card" key={spot.id}>
                        <div className="tooltip">{spot.name}</div>
                        <div className="spot-image-container">
                            <img
                                src={spot.previewImage}
                                alt={spot.name}
                                className="spot-image"
                            />
                        </div>
                        <div className="spot-details">
                            <div className="spot-location">
                                <p>{`${spot.city}, ${spot.state}`}</p>
                                <p className="spot-rating">
                                    ✨ {spot.avgStarRating ? spot.avgStarRating.toFixed(1) : "Trending"}
                                </p>
                            </div>
                            <p>
                                <strong>${spot.price}</strong> / night
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LandingPage;