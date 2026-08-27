const UserHeader = ({
    userName,
    userEmail,
    showAccountMenu,
    setShowAccountMenu,
    openProfile,
    openPasswordModal,
    handleLogout
}) => {
    return (
        <header className="user-header">

            <div>

                <span className="section-label">
                    CUSTOMER PORTAL
                </span>

                <h1>
                    Store Ratings
                </h1>

            </div>


            <div className="account-container">

                <button
                    className="user-profile"
                    onClick={() =>
                        setShowAccountMenu(
                            !showAccountMenu
                        )
                    }
                >

                    <div className="avatar">
                        {userName
                            .charAt(0)
                            .toUpperCase()}
                    </div>

                    <div>

                        <strong>
                            {userName}
                        </strong>

                        <span>
                            RateHub User
                        </span>

                    </div>

                    <span className="profile-arrow">
                        ▾
                    </span>

                </button>


                {showAccountMenu && (

                    <div className="account-menu">

                        <div className="account-menu-header">

                            <div className="menu-avatar">
                                {userName
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div>

                                <strong>
                                    {userName}
                                </strong>

                                <span>
                                    {userEmail}
                                </span>

                            </div>

                        </div>


                        <div className="menu-divider" />


                        <button
                            onClick={openProfile}
                        >
                            <span>👤</span>
                            My Profile
                        </button>


                        <button
                            onClick={openPasswordModal}
                        >
                            <span>🔐</span>
                            Change Password
                        </button>


                        <div className="menu-divider" />


                        <button
                            className="menu-logout"
                            onClick={handleLogout}
                        >
                            <span>↪</span>
                            Logout
                        </button>

                    </div>

                )}

            </div>

        </header>
    );
};

export default UserHeader;