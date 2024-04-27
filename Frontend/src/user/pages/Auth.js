import { useContext, useState } from "react";
import Button from "../../shared/components/FormElements/Button";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/validators";
import "./Auth.css";

const Auth = (props) => {
  const { switchLoginState } = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const initialInputs = {
    email: {
      value: "",
      isValid: false,
    },
    password: {
      value: "",
      isValid: false,
    },
  };

  const [formState, inputChangeHandler, setFormData] = useForm(
    initialInputs,
    false
  );

  const { email, password } = formState.inputs;

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        { ...formState.inputs, username: undefined, image: undefined },
        email.isValid && password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          username: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((curr) => !curr);
  };

  const authHandler = async (event) => {
    event.preventDefault();
    if (isLoginMode) {
      try {
        const response = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          { "Content-Type": "application/json" },
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          })
        );
        switchLoginState({
          id: response.id,
          token: response.token,
          command: "Login",
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const formData = new FormData();
        formData.append("username", formState.inputs.username.value);
        formData.append("email", formState.inputs.email.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);
        const response = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          {},
          formData
        );
        switchLoginState({
          id: response.id,
          token: response.token,
          command: "Signup",
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2 className="authentication__header">Login Required</h2>
        <form onSubmit={authHandler}>
          {!isLoginMode && (
            <>
              <Input
                id="username"
                element="input"
                type="text"
                label="Username"
                value={email.value}
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid Username..."
                onChange={inputChangeHandler}
              />
              <ImageUpload
                id="image"
                center
                onInput={inputChangeHandler}
                errorText="Please provide an image..."
              />
            </>
          )}
          <Input
            id="email"
            element="input"
            type="email"
            label="E-Mail"
            value={email.value}
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid E-Mail ID..."
            onChange={inputChangeHandler}
          />
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            value={password.value}
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid Password..."
            onChange={inputChangeHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {`${isLoginMode ? "Login" : "Register"}`}
          </Button>
        </form>
        <Button onClick={switchModeHandler} inverse>{`${
          !isLoginMode ? "Switch to Login" : "Switch to Register"
        }`}</Button>
      </Card>
    </>
  );
};

export default Auth;
