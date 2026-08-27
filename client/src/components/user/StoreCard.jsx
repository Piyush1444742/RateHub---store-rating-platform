const StoreCard = ({
    store,
    renderStars,
    handleRatingChange
}) => {

    const overallRating =
        Number(
            store.overall_rating
        ) || 0;

    const userRating =
        store.user_rating;

    return (
        <article
            className="store-card"
            key={store.id}
        >

            <div className="store-card-header">

                <div className="store-icon">
                    🏪
                </div>

                <div className="store-title">

                    <h3>
                        {store.name}
                    </h3>

                    <span>
                        Store #{store.id}
                    </span>

                </div>

            </div>


            <div className="store-address">

                <span>
                    ⌖
                </span>

                <p>
                    {store.address ||
                        "Address not available"}
                </p>

            </div>


            <div className="rating-summary">

                <div>

                    <span className="rating-label">
                        CUSTOMER RATING
                    </span>

                    <div className="rating-value">

                        <strong>
                            {overallRating.toFixed(1)}
                        </strong>

                        {renderStars(
                            overallRating
                        )}

                    </div>

                </div>

            </div>


            <div className="your-rating">

                <div className="your-rating-header">

                    <div>

                        <span className="rating-label">
                            YOUR RATING
                        </span>

                        <strong>
                            {userRating
                                ? `${userRating}/5`
                                : "Not rated yet"}
                        </strong>

                    </div>


                    {userRating && (

                        <span className="rated-badge">
                            Rated
                        </span>

                    )}

                </div>


                <div className="rating-selector">

                    <span>
                        {userRating
                            ? "Update rating"
                            : "Rate this store"}
                    </span>

                    <select
                        value={
                            userRating || ""
                        }
                        onChange={(e) =>
                            handleRatingChange(
                                store.id,
                                store.rating_id,
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            Select rating
                        </option>

                        <option value="1">
                            1 ★ — Poor
                        </option>

                        <option value="2">
                            2 ★ — Fair
                        </option>

                        <option value="3">
                            3 ★ — Good
                        </option>

                        <option value="4">
                            4 ★ — Very Good
                        </option>

                        <option value="5">
                            5 ★ — Excellent
                        </option>

                    </select>

                </div>

            </div>

        </article>
    );
};

export default StoreCard;