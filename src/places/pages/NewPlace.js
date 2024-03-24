import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/validators";
import "./PlaceForm.css";

const NewPlace = () => {
  const initialInputs = {
    title: { value: "", isValid: false },
    description: { value: "", isValid: false },
    address: { value: "", isValid: false },
  };

  const [formState, inputChangeHandler] = useForm(initialInputs, false);

  const placeSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState); //send this to server...
  };

  return (
    <form className="place-form" onSubmit={placeSubmitHandler}>
      <Input
        id="title"
        type="text"
        label="Title"
        element="input"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title..."
        onChange={inputChangeHandler}
      />
      <Input
        id="description"
        label="Description"
        element="textarea"
        validators={[VALIDATOR_MINLENGTH(10)]}
        errorText="Please enter a valid description with at least 10 characters..."
        onChange={inputChangeHandler}
      />
      <Input
        id="address"
        label="Address"
        element="textarea"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid address..."
        onChange={inputChangeHandler}
      />
      <Button type="submit" disabled={!formState.isValid}>
        Add Place
      </Button>
    </form>
  );
};

export default NewPlace;
