import { Link } from "react-router-dom";
import ChoiceCard from "../components/ChoiceCard.jsx";
import PageMeta from "../components/PageMeta.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import { useData } from "../data/DataProvider.jsx";
import { getActiveChoices } from "../lib/choices.js";
import { DESCRIPTIONS, fullTitle } from "../lib/pageMeta.js";

export default function ChoiceList() {
  const { choices } = useData();
  const published = getActiveChoices(choices);

  return (
    <div className="page ms-choice-page">
      <PageMeta title={fullTitle("M's Choice")} description={DESCRIPTIONS.choice} />

      <header className="list-header">
        <Link className="back" to="/">
          ← トップ
        </Link>
        <h1 className="list-title">M's Choice</h1>
        <p className="ms-choice-lead">Mがテーマごとに選んだ、レストランとギフトの特集。</p>
      </header>

      <div className="ms-choice-grid">
        {published.map((choice) => (
          <ChoiceCard key={choice.slug} choice={choice} />
        ))}
      </div>

      <SiteFooter />
    </div>
  );
}
