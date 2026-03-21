import Link from "next/link";
import { ArrowUpRight, SettingsIcon } from "lucide-react";

export const Settingheader = () => {
  return (
    <header className="setting-header-div fade-in">
      <div className="setting-header-top">
        <div className="setting-header-copy">
          <p className="settings-eyebrow">Preferences</p>
          <div className="setting-title-row">
            <div className="settings-icon-wrapper" aria-hidden>
              <SettingsIcon size={22} strokeWidth={2} />
            </div>
            <h1 className="settings-main-head-para aureon-heading-gradient">
              Settings
            </h1>
          </div>
          <p className="setting-head-para">
            Subscription, billing, and account security — tuned to match how you
            watch on Aureon.
          </p>
        </div>
        <Link href="/profile" className="settings-header-cta">
          <span>View profile</span>
          <ArrowUpRight size={18} strokeWidth={2.2} aria-hidden />
        </Link>
      </div>
    </header>
  );
};