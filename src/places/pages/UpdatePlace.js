import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/validators";
import "./PlaceForm.css";
import Card from "../../shared/components/UIElements/Card";

const PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    image:
      "https://cdn.britannica.com/73/114973-050-2DC46083/Midtown-Manhattan-Empire-State-Building-New-York.jpg",
    address: "20 W 34th St., New York, NY 10001, United States",
    location: {
      lat: 40.7484405,
      lng: -73.9882393,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    image:
      "https://cdn.britannica.com/73/114973-050-2DC46083/Midtown-Manhattan-Empire-State-Building-New-York.jpg",
    address: "20 W 34th St., New York, NY 10001, United States",
    location: {
      lat: 40.7484405,
      lng: -73.9882393,
    },
    creator: "u2",
  },
];

const UpdatePlace = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const placeId = useParams().placeId;
  const place = PLACES.find((place) => place.id === placeId);

  // eslint-disable-next-line
  const initialInputs = useMemo(() => {
    return {
      title: {
        value: place.title,
        isValid: true,
      },
      description: {
        value: place.description,
        isValid: true,
      },
    };
  });

  const [formState, inputChangeHandler, setFormData] = useForm(
    initialInputs,
    true
  );
  useEffect(() => {
    place && setFormData(initialInputs, true);
    setIsLoading(false);
  }, [setFormData, initialInputs, place]);
  const { title, description } = formState.inputs;

  const placeUpdateHandler = (event) => {
    event.preventDefault();
    console.log(formState); //send to server...
  };

  if (isLoading) {
    return (
      <Card>
        <h2>Loading...</h2>
      </Card>
    );
  }
  return (
    !isLoading && (
      <form className="place-form" onSubmit={placeUpdateHandler}>
        <Input
          id="title"
          type="text"
          label="Title"
          element="input"
          initialValue={title.value}
          initialValidity={title.isValid}
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title..."
          onChange={inputChangeHandler}
        />
        <Input
          id="description"
          label="Description"
          element="textarea"
          initialValue={description.value}
          initialValidity={description.isValid}
          validators={[VALIDATOR_MINLENGTH(10)]}
          errorText="Please enter a valid description with at least 10 characters..."
          onChange={inputChangeHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          Update Place Data
        </Button>
      </form>
    )
  );
};

export default UpdatePlace;
