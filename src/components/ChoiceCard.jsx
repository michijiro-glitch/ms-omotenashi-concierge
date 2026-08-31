import { Link } from "react-router-dom";
import { choicePath } from "../lib/choices.js";

export default function ChoiceCard({ choice }) {
  return (
    <Link className="ms-choice-card" to={choicePath(choice.slug)}>
      <h2 className="ms-choice-card-en">{choice.titleEn}</h2>
      <p className="ms-choice-card-ja">{choice.titleJa}</p>
      {choice.englishAvailable ? <p className="ms-choice-card-flag">English available</p> : null}
    </Link>
  );
}
