const RatingUsers = ({ ratingUsers }) => {
    return (
        <section className="dashboard-section">

            <div className="section-heading">

                <div>

                    <span className="section-label">
                        CUSTOMER ACTIVITY
                    </span>

                    <h2>
                        Rating Users
                    </h2>

                </div>

                <span className="count-pill">
                    {ratingUsers.length}
                </span>

            </div>


            {ratingUsers.length === 0 ? (

                <div className="empty-card">

                    <div className="empty-icon">
                        💬
                    </div>

                    <h3>
                        No ratings yet
                    </h3>

                    <p>
                        Customer ratings will appear
                        here once users rate your store.
                    </p>

                </div>

            ) : (

                <div className="ratings-card">

                    {ratingUsers.map(
                        (user, index) => (

                            <div
                                className="rating-user"
                                key={index}
                            >

                                <div className="avatar">
                                    {(user.user_name || "U")
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>


                                <div className="rating-user-info">

                                    <strong>
                                        {user.user_name}
                                    </strong>

                                    <span>
                                        {user.user_email}
                                    </span>

                                    <small>
                                        {user.store_name}
                                    </small>

                                </div>


                                <div className="user-rating">

                                    <strong>
                                        {user.rating}/5
                                    </strong>

                                    <span>
                                        ★★★★★
                                    </span>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}

        </section>
    );
};

export default RatingUsers;