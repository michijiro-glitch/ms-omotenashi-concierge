import GiftCard from "./GiftCard.jsx";
import RestaurantCard from "./RestaurantCard.jsx";

export default function ChoicePick({ pick, bilingual = false }) {
  const Card = pick.type === "gift" ? GiftCard : RestaurantCard;
  const cardProps = pick.type === "gift" ? { gift: pick.item } : { restaurant: pick.item };

  return (
    <article className="ms-choice-pick">
      <Card {...cardProps} nameTag="h3" />
      {pick.commentJa ? <p className="ms-choice-comment">{pick.commentJa}</p> : null}
      {bilingual && pick.commentEn ? <p className="ms-choice-comment-en">{pick.commentEn}</p> : null}
    </article>
  );
}
