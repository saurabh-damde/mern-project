import { useContext, useState } from "react";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import Map from "../../shared/components/UIElements/Map";
import Modal from "../../shared/components/UIElements/Modal";
import { AuthContext } from "../../shared/context/auth-context";
import "./PlaceItem.css";

const PlaceItem = (props) => {
  const { id, image, title, description, address, location } = props.place;
  const { isLoggedIn } = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const showMapHandler = () => {
    setShowMap((curr) => !curr);
  };
  const showConfirmationHandler = () => {
    setShowConfirmModal((curr) => !curr);
  };
  const deletePlaceHandler = () => {
    setShowConfirmModal((curr) => !curr);
  };
  return (
    <>
      <Modal
        show={showMap}
        onCancel={showMapHandler}
        header={address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={showMapHandler}>Close</Button>}
      >
        <div className="map-container">
          <Map center={location} zoom={15} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={showConfirmationHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button onClick={showConfirmationHandler} inverse>
              Cancel
            </Button>
            <Button onClick={deletePlaceHandler} danger>
              Delete
            </Button>
          </>
        }
      >
        <p>Do you really want to delete this place?</p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          <div className="place-item__image">
            <img src={image} alt={title} />
          </div>
          <div className="place-item__info">
            <h2>{title}</h2>
            <h3>{address}</h3>
            <p>{description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={showMapHandler}>
              View on Map
            </Button>
            {isLoggedIn && (
              <>
                {" "}
                <Button to={`/places/${id}`}>Edit</Button>
                <Button onClick={showConfirmationHandler} danger>
                  Delete
                </Button>
              </>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};
export default PlaceItem;
