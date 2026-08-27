const UserProfileModal = ({
    showProfile,
    userName,
    userEmail,
    userAddress,
    closeProfile
}) => {

    if (!showProfile) return null;

    return (
        <div
            className="user-modal-overlay"
            onClick={closeProfile}
        >

            <div
                className="user-modal"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >

                <div className="modal-top">

                    <div>

                        <span className="section-label">
                            ACCOUNT
                        </span>

                        <h2>
                            My Profile
                        </h2>

                    </div>


                    <button
                        className="modal-close"
                        onClick={closeProfile}
                    >
                        ×
                    </button>

                </div>


                <div className="profile-large">

                    <div className="profile-large-avatar">

                        {userName
                            .charAt(0)
                            .toUpperCase()}

                    </div>

                    <div>

                        <h3>
                            {userName}
                        </h3>

                        <span>
                            Normal User
                        </span>

                    </div>

                </div>


                <div className="profile-details">

                    <div>

                        <span>
                            FULL NAME
                        </span>

                        <strong>
                            {userName}
                        </strong>

                    </div>


                    <div>

                        <span>
                            EMAIL
                        </span>

                        <strong>
                            {userEmail}
                        </strong>

                    </div>


                    <div>

                        <span>
                            ADDRESS
                        </span>

                        <strong>
                            {userAddress}
                        </strong>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default UserProfileModal;