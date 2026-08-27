const OwnerStores = ({
    stores,
    startEditing
}) => {
    return (
        <section className="dashboard-section">

            <div className="section-heading">

                <div>

                    <span className="section-label">
                        BUSINESS
                    </span>

                    <h2>
                        My Stores
                    </h2>

                </div>

                <span className="count-pill">
                    {stores.length}
                </span>

            </div>


            {stores.length === 0 ? (

                <div className="empty-card">

                    <div className="empty-icon">
                        🏪
                    </div>

                    <h3>
                        No stores found
                    </h3>

                    <p>
                        You don't have any stores
                        assigned to your account.
                    </p>

                </div>

            ) : (

                <div className="store-grid">

                    {stores.map((store) => (

                        <article
                            className="store-card"
                            key={store.id}
                        >

                            <div className="store-card-top">

                                <div className="store-icon">
                                    🏪
                                </div>

                                <button
                                    type="button"
                                    className="outline-btn"
                                    onClick={() =>
                                        startEditing(store)
                                    }
                                >
                                    Edit Store
                                </button>

                            </div>


                            <h3>
                                {store.name}
                            </h3>


                            <div className="store-detail">

                                <span>
                                    ✉
                                </span>

                                <span>
                                    {store.email}
                                </span>

                            </div>


                            <div className="store-detail">

                                <span>
                                    📍
                                </span>

                                <span>
                                    {store.address}
                                </span>

                            </div>


                            <div className="rating-box">

                                <div>

                                    <span className="rating-number">
                                        {Number(
                                            store.average_rating || 0
                                        ).toFixed(1)}
                                    </span>

                                    <span className="rating-stars">
                                        ★★★★★
                                    </span>

                                </div>

                                <small>
                                    Average customer rating
                                </small>

                            </div>

                        </article>

                    ))}

                </div>

            )}

        </section>
    );
};

export default OwnerStores;