"use client";
import { Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/button/button";
import { useRouter } from "next/navigation";

type typevariabke = {
  plan_name: string | null;
  next_billing: string | Date | any;
};

export const Settingsubs = ({ plan_name, next_billing }: typevariabke) => {
  const router = useRouter();

  const buttonclick = () => {
    router.push("/subscription");
  };

  return (
    <section className="setting-subscription-main-div slide-up" aria-labelledby="settings-sub-heading">
      <div className="setting-subscription-content">
        <div className="setting-subscription-header">
          <div className="subscription-icon-wrapper">
            <Crown size={18} strokeWidth={2} />
          </div>
          <h2 id="settings-sub-heading" className="settng-subscription-head">
            Subscription
          </h2>
        </div>

        <div className="setting-plans-div">
          <div className="plan-badge">
            <span className="setting-plan-pill">
              <Sparkles size={14} strokeWidth={2} aria-hidden />
              Current plan
            </span>
            <span className="setting-plan-para">{plan_name || "Free plan"}</span>
          </div>
          <div className="billing-info">
            <span className="billing-label">Next billing</span>
            <span className="setting-plan-bill">{next_billing}</span>
          </div>
        </div>
      </div>

      <div className="button-to-subscription-div">
        <Button onclick={buttonclick} buttonname="Manage plan" />
      </div>
    </section>
  );
};