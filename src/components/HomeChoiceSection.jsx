import { Link } from "react-router-dom";
import { choicePath, getActiveChoices } from "../lib/choices.js";

export default function HomeChoiceSection() {
  const choices = getActiveChoices();
  if (choices.length === 0) return null;

  return (
    <section className="home-ms-choice" aria-labelledby="home-ms-choice-heading">
      <h2 id="home-ms-choice-heading" className="home-ms-choice-title">
        M's Choice
      </h2>
      <p className="home-ms-choice-lead">テーマから選ぶ特集</p>
      <ul className="home-ms-choice-list">
        {choices.map((choice) => (
          <li key={choice.slug}>
            <Link className="home-ms-choice-link" to={choicePath(choice.slug)}>
              <span className="home-ms-choice-en">{choice.titleEn}</span>
              <span className="home-ms-choice-ja">{choice.titleJa}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="home-ms-choice-more">
        <Link to="/choice">特集一覧</Link>
      </p>
    </section>
  );
}
