import OpenModalButton from '../OpenModalButton/OpenModalButton';
import DeleteSpotModal from './DeleteSpotModal';

function DeleteSpotButton({spotId}) {
  return (
    <div className="DeleteSpotButton">
      <OpenModalButton
        modalComponent={<DeleteSpotModal spotId={spotId}/>}
        buttonText="Delete"
      />
    </div>
  );
}

export default DeleteSpotButton;