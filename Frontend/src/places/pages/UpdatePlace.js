import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/validators";
import "./PlaceForm.css";

const UpdatePlace = (props) => {
  const { userId, token } = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputChangeHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const [loadedPlace, setLoadedPlace] = useState();
  const placeId = useParams().placeId;
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const response = await sendRequest(
          `http://localhost:5000/api/places/${placeId}`
        );
        setLoadedPlace(response.place);
        setFormData(
          {
            title: {
              value: response.place.title,
              isValid: true,
            },
            description: {
              value: response.place.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {
        console.log(err);
      }
    })();
  }, [placeId, setFormData, sendRequest]);

  const placeUpdateHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/places/${placeId}`,
        "PATCH",
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.description.value,
        })
      );
      navigate(`/${userId}/places`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner />}
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={placeUpdateHandler}>
          <Input
            id="title"
            type="text"
            label="Title"
            element="input"
            initialValue={loadedPlace.title}
            initialValidity={true}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title..."
            onChange={inputChangeHandler}
          />
          <Input
            id="description"
            label="Description"
            element="textarea"
            initialValue={loadedPlace.description}
            initialValidity={true}
            validators={[VALIDATOR_MINLENGTH(10)]}
            errorText="Please enter a valid description with at least 10 characters..."
            onChange={inputChangeHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            Update Place Data
          </Button>
        </form>
      )}
    </>
  );
};

export default UpdatePlace;
