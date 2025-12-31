import { Button } from "../../../../Components/button/button"
import { Profile_detail } from "../../../../Combiner/profile-detail/profile-detail";
import "./profile.css"


const Profile=()=>{
    
    return(
        <div className="profile-main-div">
            <div className="profile-name-div">
                <div className="profile-avatar-div">
                    <div className="profile-avatar">🧑🏻</div>
                    <div className="profile-name">
                        <p>Michel De Santa</p>
                        <p>Premium Plan</p>
                        <p>Member Since : 2026</p>
                    </div>
                </div> 
                <div className="profile-name-div-button">
                    <Button buttonname="Sign out"/>
                </div>
            </div>
            <Profile_detail />
        </div>
    )
}


export default Profile;