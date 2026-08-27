const StoreFilters = ({
    storeFilters,
    updateStoreFilter,
    resetStoreFilters
}) => {
    return (
        <div className="admin-filter-card">

            <div className="filter-search">

                <label>
                    Name
                </label>

                <input
                    type="text"
                    placeholder="Search store..."
                    value={storeFilters.name}
                    onChange={(e) =>
                        updateStoreFilter(
                            "name",
                            e.target.value
                        )
                    }
                />

            </div>


            <div className="filter-search">

                <label>
                    Email
                </label>

                <input
                    type="text"
                    placeholder="Search email..."
                    value={storeFilters.email}
                    onChange={(e) =>
                        updateStoreFilter(
                            "email",
                            e.target.value
                        )
                    }
                />

            </div>


            <div className="filter-search">

                <label>
                    Address
                </label>

                <input
                    type="text"
                    placeholder="Search address..."
                    value={storeFilters.address}
                    onChange={(e) =>
                        updateStoreFilter(
                            "address",
                            e.target.value
                        )
                    }
                />

            </div>


            <div className="filter-select">

                <label>
                    Sort By
                </label>

                <select
                    value={storeFilters.sortBy}
                    onChange={(e) =>
                        updateStoreFilter(
                            "sortBy",
                            e.target.value
                        )
                    }
                >

                    <option value="name">
                        Name
                    </option>

                    <option value="email">
                        Email
                    </option>

                    <option value="address">
                        Address
                    </option>

                </select>

            </div>


            <button
                className="sort-btn"
                onClick={() =>
                    updateStoreFilter(
                        "sortOrder",
                        storeFilters.sortOrder === "asc"
                            ? "desc"
                            : "asc"
                    )
                }
            >

                {storeFilters.sortOrder === "asc"
                    ? "↑ Ascending"
                    : "↓ Descending"}

            </button>


            <button
                className="reset-btn"
                onClick={resetStoreFilters}
            >
                Reset
            </button>

        </div>
    );
};

export default StoreFilters;