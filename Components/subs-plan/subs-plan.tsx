import { Check } from "lucide-react";
import "./subs-plan.css";

type PlanProps = {
  planName: string;
  price: string;
  features: string[];
  isCurrent?: boolean;
  isPremium?: boolean;
  isBasic?: boolean;
  isYearly?: boolean;
};

export const Subs_plan = ({
  planName,
  price,
  features,
  isCurrent,
  isPremium,
  isBasic,
  isYearly,
}: PlanProps) => {
  return (
    <div className={`plan-card ${isCurrent ? "current" : ""}`}>
      
      {isCurrent && <div className="current-pill">CURRENT PLAN</div>}

      {isPremium && <div className="premium-badge">⭐</div>}

      <p className="plan-name">{planName}</p>

      <h2 className="plan-price">
        {price}
        <span>{isYearly ? "/yr" : "/mo"}</span>
      </h2>

      <ul className="plan-features">
        {features.map((item, i) => (
          <li key={i}>
            <Check size={16} />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <button
        className={`plan-btn ${isCurrent ? "disabled" : ""}`}
        disabled={isCurrent}
      >
        {isCurrent ? "Current Plan" : isBasic ? "Downgrade" : "Upgrade"}
      </button>
    </div>
  );
};
