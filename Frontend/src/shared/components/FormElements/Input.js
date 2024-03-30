import { useEffect, useReducer } from "react";
import { validate } from "../../utils/validators";
import "./Input.css";

const Input = (props) => {
  const {
    id,
    label,
    element,
    type,
    placeholder,
    rows,
    errorText,
    validators,
    onChange,
    initialValue,
    initialValidity,
  } = props;
  const inputReducer = (inputState, action) => {
    switch (action.type) {
      case "CHANGE":
        return {
          ...inputState,
          value: action.value,
          isValid: validate(action.value, action.validators),
        };
      case "BLUR":
        return { ...inputState, isBlur: true };
      default:
        return inputState;
    }
  };
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: initialValue || "",
    isValid: initialValidity,
    isBlur: false,
  });
  useEffect(() => {
    onChange(id, inputState.value, inputState.isValid);
  }, [id, onChange, inputState]);
  const onChangeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      value: event.target.value,
      validators: validators,
    });
  };
  const onBlurHandler = () => {
    dispatch({ type: "BLUR" });
  };
  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isBlur && "form-control--invalid"
      }`}
    >
      <label htmlFor={id}>{label}</label>
      {element === "input" ? (
        <input
          id={id}
          type={type}
          value={inputState.value}
          placeholder={placeholder}
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
        />
      ) : (
        <textarea
          id={id}
          type={type}
          value={inputState.value}
          rows={rows || 3}
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
        />
      )}
      {!inputState.isValid && inputState.isBlur && <p>{errorText}</p>}
    </div>
  );
};

export default Input;
