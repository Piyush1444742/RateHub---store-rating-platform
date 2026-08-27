const UserSidebar = ({ handleLogout }) => {
    return (
        <aside className="user-sidebar">

            <div className="brand">

                <div className="brand-icon">
                    ★
                </div>

                <div>
                    <h2>RateHub</h2>
                    <span>USER PORTAL</span>
                </div>

            </div>


            <nav className="sidebar-nav">

                <div className="nav-item active">
                    <span>⌂</span>
                    <span>Stores</span>
                </div>

            </nav>


            <div className="sidebar-footer">

                <div className="secure-box">

                    <span className="secure-icon">
                        ✓
                    </span>

                    <div>

                        <strong>
                            Secure session
                        </strong>

                        <small>
                            User access
                        </small>

                    </div>

                </div>


                <button
                    className="sidebar-logout"
                    onClick={handleLogout}
                >
                    <span>↪</span>
                    Logout
                </button>

            </div>

        </aside>
    );
};

export default UserSidebar;