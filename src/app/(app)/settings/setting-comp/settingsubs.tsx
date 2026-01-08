"use client"
import { Crown } from "lucide-react"
import { Button } from "../../../../../Components/button/button"
import { useRouter } from "next/navigation"

type typevariabke={
  plan_name:string | null;
  next_billing: string | Date | any;
}

export const Settingsubs=({plan_name , next_billing}:typevariabke)=>{
  const router=useRouter();

  const buttonclick=()=>{
    router.push("/subscription")
  }

    return(
        <div className="setting-subscription-main-div slide-up">
        <div className="setting-subscription-content">
          <div className="setting-subscription-header">
            <div className="subscription-icon-wrapper">
              <Crown size={18} strokeWidth={2} />
            </div>
            <h2 className="settng-subscription-head">Subscription</h2>
          </div>

          <div className="setting-plans-div">
            <div className="plan-badge">
              <span className="setting-plan-para">{plan_name}</span>
            </div>
            <div className="billing-info">
              <span className="billing-label">Next billing date</span>
              <span className="setting-plan-bill">{next_billing}</span>
            </div>
          </div>
        </div>

        <div className="button-to-subscription-div">
          <Button onclick={buttonclick} buttonname="Go to Subscription Page"/>
        </div>
      </div>
    )
}