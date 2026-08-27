const AdminSidebar = ({
    activeTab,
    setActiveTab,
    totalUsers,
    totalStores,
    onLogout
}) => {
    return (
        <aside className="admin-sidebar">

            <div className="admin-brand">

                <div className="admin-brand-icon">
                    ★
                </div>

                <div>
                    <strong>
                        RateHub
                    </strong>

                    <span>
                        ADMIN PORTAL
                    </span>
                </div>

            </div>


            <nav className="admin-nav">

                <button
                    className={
                        activeTab === "overview"
                            ? "admin-nav-item active"
                            : "admin-nav-item"
                    }
                    onClick={() =>
                        setActiveTab("overview")
                    }
                >
                    <span>⌂</span>
                    Overview
                </button>


                <button
                    className={
                        activeTab === "users"
                            ? "admin-nav-item active"
                            : "admin-nav-item"
                    }
                    onClick={() =>
                        setActiveTab("users")
                    }
                >
                    <span>◉</span>
                    Users

                    <small>
                        {totalUsers}
                    </small>
                </button>


                <button
                    className={
                        activeTab === "stores"
                            ? "admin-nav-item active"
                            : "admin-nav-item"
                    }
                    onClick={() =>
                        setActiveTab("stores")
                    }
                >
                    <span>▣</span>
                    Stores

                    <small>
                        {totalStores}
                    </small>
                </button>

            </nav>


            <div className="admin-sidebar-bottom">

                <div className="admin-security-note">

                    <span>✓</span>

                    <div>

                        <strong>
                            Secure session
                        </strong>

                        <small>
                            Administrator access
                        </small>

                    </div>

                </div>


                <button
                    className="admin-logout"
                    onClick={onLogout}
                >
                    <span>↪</span>
                    Logout
                </button>

            </div>

        </aside>
    );
};

export default AdminSidebar;