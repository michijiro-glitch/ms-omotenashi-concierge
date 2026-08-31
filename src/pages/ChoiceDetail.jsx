import { Link, Navigate, useParams } from "react-router-dom";
import ChoicePick from "../components/ChoicePick.jsx";
import PageMeta from "../components/PageMeta.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import { useData } from "../data/DataProvider.jsx";
import { getChoiceBySlug, groupPicksByCategory, resolvePicks } from "../lib/choices.js";
import { DESCRIPTIONS, fullTitle } from "../lib/pageMeta.js";

function defaultItemsLabel(choice) {
  if (choice.kind === "gift") return "Mが選んだGift";
  if (choice.kind === "mixed") return "Mが選んだRestaurant / Gift";
  return "Mが選んだRestaurant";
}

export default function ChoiceDetail() {
  const { slug } = useParams();
  const { restaurants, gifts, loading } = useData();
  const choice = getChoiceBySlug(slug);

  if (!choice) {
    return <Navigate to="/choice" replace />;
  }

  const configuredPicks = choice.picks || [];
  const picks = resolvePicks(choice, restaurants, gifts);
  const groups = groupPicksByCategory(picks);
  const heading = choice.bilingual ? choice.titleEn : choice.titleJa;
  const hasCategories = groups.some((group) => group.categoryJa);

  return (
    <div className="page ms-choice-page">
      <PageMeta title={fullTitle(choice.titleEn, choice.titleJa)} description={choice.description || DESCRIPTIONS.choice} />

      <header className="ms-choice-hero">
        <Link className="back" to="/choice">
          ← M's Choice
        </Link>
        <p className="eyebrow">M's Choice</p>
        <h1 className="ms-choice-title">{heading}</h1>
        {choice.bilingual && choice.kickerJa ? <p className="ms-choice-kicker">{choice.kickerJa}</p> : null}
        {!choice.bilingual && choice.titleEn ? <p className="ms-choice-title-en">{choice.titleEn}</p> : null}
      </header>

      {choice.introJa ? (
        <section className="ms-choice-intro" aria-label="特集の紹介">
          <p>{choice.introJa}</p>
          {choice.bilingual && choice.introEn ? <p lang="en">{choice.introEn}</p> : null}
        </section>
      ) : null}

      <section className="ms-choice-picks">
        {hasCategories ? null : (
          <h2 className="ms-choice-section-title">{defaultItemsLabel(choice)}</h2>
        )}

        {configuredPicks.length === 0 ? (
          <p className="empty">掲載は準備中です。</p>
        ) : loading && picks.length === 0 ? (
          <p className="empty">読み込み中…</p>
        ) : picks.length === 0 ? (
          <p className="empty">掲載は準備中です。</p>
        ) : (
          groups.map((group) => (
            <div key={group.categoryJa || "default"} className="ms-choice-group">
              {group.categoryJa ? (
                <h2 className="ms-choice-category">
                  {group.categoryJa}
                  {choice.bilingual && group.categoryEn ? (
                    <span className="ms-choice-category-en" lang="en">
                      {group.categoryEn}
                    </span>
                  ) : null}
                </h2>
              ) : null}
              <div className="card-grid">
                {group.picks.map((pick) => (
                  <ChoicePick key={`${pick.type}-${pick.id}`} pick={pick} bilingual={choice.bilingual} />
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
