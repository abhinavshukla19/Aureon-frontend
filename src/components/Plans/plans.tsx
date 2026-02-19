"use client"
import { useState } from "react"
import { Subs_plan } from "../../Components/subs-plan/subs-plan"
import "./plan.css"


export const Plans_detail=()=>{
    const [isMonthly, setIsMonthly] = useState(true);

    

    return(
        <>
        <div className="subscription-container">
            <div className="plans-header-row">
                <p className="subs-plan-head">Available Plans</p>
                <div className="billing-toggle">
                    <button 
                        className={`toggle-btn ${isMonthly ? "active" : ""}`}
                        onClick={() => setIsMonthly(true)}
                    >
                        Monthly
                    </button>
                    <button 
                        className={`toggle-btn ${!isMonthly ? "active" : ""}`}
                        onClick={() => setIsMonthly(false)}
                    >
                        Yearly -20%
                    </button>
                </div>
            </div>
            <div className="plans-wrapper">
                <Subs_plan
                    planName="Basic"
                    price={isMonthly ? "₹499" : "₹4,790"}
                    isBasic
                    isYearly={!isMonthly}
                    features={[
                    "720p HD Resolution",
                    "Watch on 1 device",
                    "Good video quality",
                    ]}
                />
                <Subs_plan
                    planName="Standard"
                    price={isMonthly ? "₹999" : "₹9,590"}
                    isCurrent
                    isYearly={!isMonthly}
                    features={[
                    "1080p Full HD",
                    "Watch on 2 devices",
                    "Great video quality",
                    "Ad-free movies",
                    ]}
                />
                <Subs_plan
                    planName="Premium"
                    price={isMonthly ? "₹1,499" : "₹14,390"}
                    isPremium
                    isYearly={!isMonthly}
                    features={[
                    "4K Ultra HD + HDR",
                    "Watch on 4 devices",
                    "Best video quality",
                    "Spatial Audio",
                    ]}
                />
            </div>
        </div>
        </>
        
    )
}