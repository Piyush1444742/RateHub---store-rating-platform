const AdminHeader = ({
    activeTab,
    adminName,
    adminEmail,
    setShowAccountMenu,
    showAccountMenu,
    openProfileModal,
    handleLogout
}) => {

    const getPageTitle = () => {
        if (activeTab === "overview") {
            return "Dashboard";
        }

        if (activeTab === "users") {
            return "User Management";
        }

        return "Store Management";
    };

    return (
        <header className="admin-topbar">

            <div>

                <span className="admin-eyebrow">
                    SYSTEM ADMINISTRATION
                </span>

                <h1>
                    {getPageTitle()}
                </h1>

            </div>


            <div className="admin-account-container">

                <button
                    type="button"
                    className="admin-account-button"
                    onClick={() =>
                        setShowAccountMenu(
                            !showAccountMenu
                        )
                    }
                >

                    <div className="admin-avatar">

                        {adminName
                            .charAt(0)
                            .toUpperCase()}

                    </div>


                    <div className="admin-profile">

                        <strong>
                            {adminName}
                        </strong>

                        <span>
                            System Admin
                        </span>

                    </div>


                    <span className="admin-account-arrow">
                        ▾
                    </span>

                </button>


                {showAccountMenu && (

                    <div className="admin-account-menu">

                        <div className="admin-menu-header">

                            <div className="admin-menu-avatar">

                                {adminName
                                    .charAt(0)
                                    .toUpperCase()}

                            </div>

                            <div>

                                <strong>
                                    {adminName}
                                </strong>

                                <span>
                                    {adminEmail}
                                </span>

                            </div>

                        </div>


                        <div className="admin-menu-divider" />


                        <button
                            type="button"
                            onClick={
                                openProfileModal
                            }
                        >
                            <span>
                                👤
                            </span>

                            My Profile
                        </button>


                        <div className="admin-menu-divider" />


                        <button
                            type="button"
                            className="admin-menu-logout"
                            onClick={
                                handleLogout
                            }
                        >
                            <span>
                                ↪
                            </span>

                            Logout
                        </button>

                    </div>

                )}

            </div>

        </header>
    );
};

export default AdminHeader;