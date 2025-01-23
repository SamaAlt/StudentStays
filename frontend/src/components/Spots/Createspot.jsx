import { useState,useEffect } from "react";
import "./Createspot.css";
import { useDispatch } from "react-redux";
import { addSpotThunk } from "../../store/spots";
import { getSpots } from "../../store/spots";
import { useNavigate } from "react-router-dom";
import { addSpotImageThunk } from "../../store/spots";

function CreateSpot() {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [country, setCountry] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [previewImage, setPreviewImage] = useState("");
    const [image1, setImage1] = useState("");
    const [image2, setImage2] = useState("");
    const [image3, setImage3] = useState("");
    const [image4, setImage4] = useState("");
    const [errors, setErrors] = useState({});

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      dispatch(getSpots())
        .then(() => setIsLoading(false));
    }, [dispatch]);
  
    if (isLoading) {
      return <img src="https://i.gifer.com/ZZ5H.gif" alt="Loading..." className="loadingGif" />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = {};

        if (!country) validationErrors.country = "Country is required";
        if (!address) validationErrors.address = "Street address is required";
        if (!city) validationErrors.city = "City is required";
        if (!state) validationErrors.state = "State is required";
        if (description.length < 30) validationErrors.description = "Description needs 30 or more characters";
        if (!title) validationErrors.title = "Name is required";
        if (!price) validationErrors.price = "Price per night is required";
        if (!previewImage) {
            validationErrors.previewImage = "Preview image URL is required";
          } else if (!previewImage.endsWith(".png") && !previewImage.endsWith(".jpg") && !previewImage.endsWith(".jpeg")) {
            validationErrors.previewImage = "Add 4 images. Preview image URL must end in .png";
          }
        const isValidImageUrl = (url) => {
            return url.endsWith(".png") || url.endsWith(".jpg") || url.endsWith(".jpeg");
          };
        if (image1 && !isValidImageUrl(image1)) validationErrors.image1 = "Image URL must end in .png, .jpg, or .jpeg";
        if (image2 && !isValidImageUrl(image2)) validationErrors.image2 = "Image URL must end in .png, .jpg, or .jpeg";
        if (image3 && !isValidImageUrl(image3)) validationErrors.image3 = "Image URL must end in .png, .jpg, or .jpeg";
        if (image4 && !isValidImageUrl(image4)) validationErrors.image4 = "Image URL must end in .png, .jpg, or .jpeg";



        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
            }
        const newSpot = {
            country,
            address,
            city,
            state,

            description,
            name:title,
            price,
        };
        const response = await dispatch(addSpotThunk(newSpot));

        if (response && response.errors) {
            validationErrors.address = response.errors;
            setErrors(validationErrors);
          return;
        }
      
        const spotId = response.id;
        
        const images = [previewImage, image1, image2, image3, image4]
        .filter(e => e)
        .map((url, index) => ({ url, preview: index === 0 }));
    
    for (let image of images) {
        await dispatch(addSpotImageThunk(spotId, image));
    }
    

          for (let image of images) {
            await dispatch(addSpotImageThunk(spotId, image));
          }

          redirecting(spotId);
    };

    const redirecting = (spotId) => {
        navigate(`/spots/${spotId}`);
    };


    return (
    <div className="newSpotForm">
      <form className="addressForm" onSubmit={handleSubmit}>
          <h1>Create a New Spot</h1>
<div>
        <div className="intro">
          <h2>Where&apos;s your place located?</h2>
          <h3>Guests will only get your exact address once they booked a reservation.</h3>
        </div>
        <label>
          Country{errors.country && <p className="errorMessage">{errors.country}</p>}
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Country"
          />
        </label>
        

        <label>
          Street Address{errors.address && <p className="errorMessage">{errors.address}</p>}
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Street Address"
          />
        </label>
        

        <div className="cityState">
          <label>
            City {errors.city && <p className="errorMessage">{errors.city}</p>}
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
            />
          </label>
          
          <label>
            State {errors.state && <p className="errorMessage">{errors.state}</p>}
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State"
            />
          </label>
          
        </div>

        <div className="latLong">
        <label>
            Latitude
            {errors.latitude && <p className="errorMessage">{errors.latitude}</p>}
            <input
            type="text"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="Latitude"
            />
        </label>
        <label>
            Longitude
            {errors.longitude && <p className="errorMessage">{errors.longitude}</p>}
            <input
            type="text"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="Longitude"
            />
        </label>
        </div>
</div>
<div>
        <h2>Describtion</h2>
        <p>Add location features</p>
        {errors.description && <p className="errorMessage">{errors.description}</p>}
        <label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please write at least 30 characters"
            minLength="30"
          />
        </label>
</div>        
<div>
        <h2>Create a title for your spot</h2>
        <p>Add a title</p>
        {errors.title && <p className="errorMessage">{errors.title}</p>}
        <label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Name of your spot"
          />
        </label>
</div>
<div>
        <h2>Set a base price for your spot</h2>
        <p>Set your price</p>
        {errors.price && <p className="errorMessage">{errors.price}</p>}
        <label>
          <div className="priceLabel">
            <span className="dollarSign">$</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price per night (USD)"
            />
          </div>
        </label>
</div>        
<div>
        <h2>Add photos</h2>
        <p>Add a link for your location</p>
        <label>
          <input
            type="url"
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
            placeholder="Preview Image URL"
          />
        </label>
        {errors.previewImage && <p className="errorMessage">{errors.previewImage}</p>}
        <label>
          <input
            type="url"
            value={image1}
            onChange={(e) => setImage1(e.target.value)}
            placeholder="Image URL"
          />
        </label>
        {errors.image1 && <p className="errorMessage">{errors.image1}</p>}
        <label>
          <input
            type="url"
            value={image2}
            onChange={(e) => setImage2(e.target.value)}
            placeholder="Image URL"
          />
        </label>
        {errors.image2 && <p className="errorMessage">{errors.image2}</p>}
        <label>
          <input
            type="url"
            value={image3}
            onChange={(e) => setImage3(e.target.value)}
            placeholder="Image URL"
          />
        </label>
        {errors.image3 && <p className="errorMessage">{errors.image3}</p>}
        <label>
          <input
            type="url"
            value={image4}
            onChange={(e) => setImage4(e.target.value)}
            placeholder="Image URL"
          />
        </label>
        {errors.image4 && <p className="errorMessage">{errors.image4}</p>}
</div>
        <button type="submit" className="createSpotButton">Create Spot</button>
      </form>
    </div>
  );
}

export default CreateSpot;