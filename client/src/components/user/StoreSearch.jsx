const StoreSearch = ({
    search,
    setSearch
}) => {
    return (
        <section className="search-section">

            <div>

                <span className="section-label">
                    EXPLORE
                </span>

                <h2>
                    Find a Store
                </h2>

                <p>
                    Search for a store by name.
                </p>

            </div>


            <div className="search-box">

                <span className="search-icon">
                    ⌕
                </span>

                <input
                    type="text"
                    placeholder="Search stores..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                />

                {search && (

                    <button
                        className="clear-search"
                        onClick={() =>
                            setSearch("")
                        }
                    >
                        ×
                    </button>

                )}

            </div>

        </section>
    );
};

export default StoreSearch;