import { TvMinimalPlay, CreditCard } from "lucide-react";
import { Plans_detail } from "../../../../Combiner/Plans/plans";
import "./subscription.css"


const Subscription=()=>{

    return(
        <div className="subs-main-div">
           <div className="subs-head-text">
            <h1>Manage Subscription</h1>
            <p className="subs-head-para">Manage your plans, billing details and preferences</p>
           </div>
           <div className="subs-current-plan">
                <div className="subs-logo">
                    <TvMinimalPlay size={28} strokeWidth={1.6} />
                </div>
                <div className="subs-current-overview">
                    <p className="subs-current-text">Current Plan: Standard</p>
                    <p className="subs-current-price">₹999/mo • Next billing: 23 Jan 2026</p>
                </div>
                <div className="subs-current-active-degine">
                    <p>Active</p>
                </div>
           </div>
                <Plans_detail />
                
                <div className="feature-comparison-section">
                    <h2 className="comparison-heading">Detailed Feature Comparison</h2>
                    <div className="comparison-table">
                        <div className="comparison-row header-row">
                            <div className="comparison-cell">Features</div>
                            <div className="comparison-cell">Basic</div>
                            <div className="comparison-cell highlight">Standard</div>
                            <div className="comparison-cell">Premium</div>
                        </div>
                        <div className="comparison-row">
                            <div className="comparison-cell">Monthly Price</div>
                            <div className="comparison-cell">₹499</div>
                            <div className="comparison-cell highlight">₹999</div>
                            <div className="comparison-cell">₹1499</div>
                        </div>
                        <div className="comparison-row">
                            <div className="comparison-cell">Video Quality</div>
                            <div className="comparison-cell">Good</div>
                            <div className="comparison-cell highlight">Better</div>
                            <div className="comparison-cell">Best</div>
                        </div>
                        <div className="comparison-row">
                            <div className="comparison-cell">Resolution</div>
                            <div className="comparison-cell">720p</div>
                            <div className="comparison-cell highlight">1080p</div>
                            <div className="comparison-cell">4K+HDR</div>
                        </div>
                        <div className="comparison-row">
                            <div className="comparison-cell">Simultaneous Streams</div>
                            <div className="comparison-cell">1</div>
                            <div className="comparison-cell highlight">2</div>
                            <div className="comparison-cell">4</div>
                        </div>
                        <div className="comparison-row">
                            <div className="comparison-cell">Download Devices</div>
                            <div className="comparison-cell">1</div>
                            <div className="comparison-cell highlight">2</div>
                            <div className="comparison-cell">6</div>
                        </div>
                    </div>
                </div>

                <div className="billing-section">
                    <h2 className="billing-heading">Billing & Payment</h2>
                    <div className="billing-content">
                        <div className="billing-card-info">
                            <div className="billing-icon">
                                <CreditCard size={24} strokeWidth={1.6} />
                            </div>
                            <div className="billing-details">
                                <p className="billing-card-text">Visa ending in 4242</p>
                                <p className="billing-card-expiry">Expiry 12/25</p>
                            </div>
                        </div>
                        <div className="billing-actions">
                            <button className="billing-history-btn">Billing History</button>
                            <button className="update-method-btn">Update Method</button>
                        </div>
                    </div>
                </div>

                <div className="cancel-section">
                    <a href="#" className="cancel-link">Cancel Subscription</a>
                </div>
        </div>
    )
}


export default Subscription;