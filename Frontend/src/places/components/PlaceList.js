import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";
import "./PlaceList.css";

const PlaceList = (props) => {
  const { items, onDelete } = props;
  if (items.length === 0) {
    return (
      <Card className="place-list center">
        <h2>No places found.. Create one?</h2>
        <Button to="/places/new">Share A Place</Button>
      </Card>
    );
  } else {
    return (
      <ul className="place-list">
        {items.map((place) => (
          <PlaceItem key={place.id} place={place} onDelete={onDelete} />
        ))}
      </ul>
    );
  }
};
export default PlaceList;
