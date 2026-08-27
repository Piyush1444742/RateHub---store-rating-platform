const OwnerAccountBar = ({
    ownerName,
    ownerEmail,
    showAccountMenu,
    setShowAccountMenu,
    openProfileModal,
    openPasswordModal,
    handleLogout
}) => {
    return (
        <div className="owner-account-bar">

            <div className="owner-brand">

                <div className="owner-brand-icon">
                    ★
                </div>

                <div>
                    <strong>
                        RateHub
                    </strong>

                    <span>
                        OWNER PORTAL
                    </span>
                </div>

            </div>


            <div className="owner-account-container">

                <button
                    type="button"
                    className="owner-profile-button"
                    onClick={() =>
                        setShowAccountMenu(
                            !showAccountMenu
                        )
                    }
                >

                    <div className="owner-avatar">
                        {ownerName
                            .charAt(0)
                            .toUpperCase()}
                    </div>

                    <div className="owner-profile-text">

                        <strong>
                            {ownerName}
                        </strong>

                        <span>
                            Store Owner
                        </span>

                    </div>

                    <span className="owner-arrow">
                        ▾
                    </span>

                </button>


                {showAccountMenu && (

                    <div className="owner-account-menu">

                        <div className="owner-menu-header">

                            <div className="owner-menu-avatar">
                                {ownerName
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div>

                                <strong>
                                    {ownerName}
                                </strong>

                                <span>
                                    {ownerEmail}
                                </span>

                            </div>

                        </div>


                        <div className="owner-menu-divider" />


                        <button
                            type="button"
                            onClick={openProfileModal}
                        >
                            <span>👤</span>
                            My Profile
                        </button>


                        <button
                            type="button"
                            onClick={openPasswordModal}
                        >
                            <span>🔐</span>
                            Change Password
                        </button>


                        <div className="owner-menu-divider" />


                        <button
                            type="button"
                            className="owner-menu-logout"
                            onClick={handleLogout}
                        >
                            <span>↪</span>
                            Logout
                        </button>

                    </div>

                )}

            </div>

        </div>
    );
};

export default OwnerAccountBar;