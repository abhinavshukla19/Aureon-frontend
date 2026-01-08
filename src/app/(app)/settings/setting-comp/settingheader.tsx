import { SettingsIcon } from "lucide-react"


export const Settingheader=()=>{
    return(
         <div className="setting-header-div fade-in">
        <div className="setting-title-row">
          <div className="settings-icon-wrapper">
            <SettingsIcon size={24} strokeWidth={2} />
          </div>
          <h1 className="settings-main-head-para">Settings</h1>
        </div>
        <p className="setting-head-para">
          Manage your subscription, security and playback preferences
        </p>
      </div>
    )
}