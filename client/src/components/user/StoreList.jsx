import StoreCard from "./StoreCard";

const StoreList = ({
    stores,
    loading,
    search,
    setSearch,
    renderStars,
    handleRatingChange
}) => {
    return (
        <section className="stores-section">

            <div className="stores-heading">

                <div>

                    <span className="section-label">
                        AVAILABLE STORES
                    </span>

                    <h2>
                        Stores
                    </h2>

                </div>

                {!loading && (

                    <span className="store-count">

                        {stores.length}{" "}

                        {stores.length === 1
                            ? "store"
                            : "stores"}

                    </span>

                )}

            </div>


            {loading ? (

                <div className="loading-grid">

                    {[1, 2, 3].map(
                        (item) => (

                            <div
                                className="store-card skeleton"
                                key={item}
                            >

                                <div className="skeleton-line large" />

                                <div className="skeleton-line" />

                                <div className="skeleton-line short" />

                            </div>

                        )
                    )}

                </div>

            ) : stores.length === 0 ? (

                <div className="empty-state">

                    <div className="empty-icon">
                        ⌕
                    </div>

                    <h3>
                        No stores found
                    </h3>

                    <p>
                        Try searching with a
                        different store name.
                    </p>

                    {search && (

                        <button
                            className="secondary-button"
                            onClick={() =>
                                setSearch("")
                            }
                        >
                            Clear Search
                        </button>

                    )}

                </div>

            ) : (

                <div className="store-grid">

                    {stores.map(
                        (store) => (

                            <StoreCard
                                key={store.id}
                                store={store}
                                renderStars={
                                    renderStars
                                }
                                handleRatingChange={
                                    handleRatingChange
                                }
                            />

                        )
                    )}

                </div>

            )}

        </section>
    );
};

export default StoreList;