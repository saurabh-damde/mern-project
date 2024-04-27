import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import PlaceList from "../components/PlaceList";
import "./UserPlaces.css";

const UserPlaces = (props) => {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().userId;

  useEffect(() => {
    (async () => {
      try {
        const response = await sendRequest(
          `http://localhost:5000/api/places/user/${userId}`
        );
        setLoadedPlaces(response.places);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [userId, sendRequest]);

  const onDeleteHandler = (placeId) => {
    setLoadedPlaces((prev) => {
      prev.filter((place) => place.id !== placeId);
    });
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDelete={onDeleteHandler} />
      )}
    </>
  );
};

export default UserPlaces;
