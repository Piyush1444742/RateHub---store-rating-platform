const AdminOverview = ({
    stats,
    setActiveTab
}) => {
    return (
        <section className="admin-content">

            <div className="admin-welcome">

                <div>

                    <span>
                        WELCOME BACK
                    </span>

                    <h2>
                        Manage your platform
                    </h2>

                    <p>
                        Monitor users, stores and
                        customer ratings from one place.
                    </p>

                </div>


                <div className="admin-welcome-icon">
                    ★
                </div>

            </div>


            <div className="admin-stat-grid">

                <div className="admin-stat-card blue">

                    <div className="admin-stat-icon">
                        ◉
                    </div>

                    <div>

                        <span>
                            Total Users
                        </span>

                        <strong>
                            {stats.totalUsers}
                        </strong>

                        <small>
                            Registered accounts
                        </small>

                    </div>

                </div>


                <div className="admin-stat-card purple">

                    <div className="admin-stat-icon">
                        ▣
                    </div>

                    <div>

                        <span>
                            Total Stores
                        </span>

                        <strong>
                            {stats.totalStores}
                        </strong>

                        <small>
                            Stores on platform
                        </small>

                    </div>

                </div>


                <div className="admin-stat-card orange">

                    <div className="admin-stat-icon">
                        ★
                    </div>

                    <div>

                        <span>
                            Total Ratings
                        </span>

                        <strong>
                            {stats.totalRatings}
                        </strong>

                        <small>
                            Customer submissions
                        </small>

                    </div>

                </div>

            </div>


            <div className="admin-quick-grid">

                <button
                    className="admin-quick-card"
                    onClick={() =>
                        setActiveTab("users")
                    }
                >

                    <div className="quick-icon blue-bg">
                        ◉
                    </div>

                    <div>

                        <strong>
                            Manage Users
                        </strong>

                        <span>
                            Search, filter and view users
                        </span>

                    </div>

                    <b>
                        →
                    </b>

                </button>


                <button
                    className="admin-quick-card"
                    onClick={() =>
                        setActiveTab("stores")
                    }
                >

                    <div className="quick-icon purple-bg">
                        ▣
                    </div>

                    <div>

                        <strong>
                            Manage Stores
                        </strong>

                        <span>
                            View and manage registered stores
                        </span>

                    </div>

                    <b>
                        →
                    </b>

                </button>

            </div>

        </section>
    );
};

export default AdminOverview;