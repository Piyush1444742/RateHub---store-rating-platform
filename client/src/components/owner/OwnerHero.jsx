const OwnerHero = ({ storeCount }) => {
    return (
        <header className="dashboard-hero">

            <div>

                <span className="eyebrow">
                    OWNER PORTAL
                </span>

                <h1>
                    Owner Dashboard
                </h1>

                <p>
                    Manage your stores and keep
                    track of customer ratings.
                </p>

            </div>


            <div className="hero-badge">

                <span>
                    ⭐
                </span>

                <div>

                    <strong>
                        {storeCount}
                    </strong>

                    <small>
                        {storeCount === 1
                            ? "Store"
                            : "Stores"}
                    </small>

                </div>

            </div>

        </header>
    );
};

export default OwnerHero;