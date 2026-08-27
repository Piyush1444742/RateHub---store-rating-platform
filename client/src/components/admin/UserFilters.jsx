const UserFilters = ({
    userFilters,
    updateUserFilter,
    resetUserFilters
}) => {
    return (
        <div className="admin-filter-card">

            <div className="filter-search">

                <label>
                    Name
                </label>

                <input
                    type="text"
                    placeholder="Search by name..."
                    value={userFilters.name}
                    onChange={(e) =>
                        updateUserFilter(
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
                    placeholder="Search by email..."
                    value={userFilters.email}
                    onChange={(e) =>
                        updateUserFilter(
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
                    value={userFilters.address}
                    onChange={(e) =>
                        updateUserFilter(
                            "address",
                            e.target.value
                        )
                    }
                />

            </div>


            <div className="filter-select">

                <label>
                    Role
                </label>

                <select
                    value={userFilters.role}
                    onChange={(e) =>
                        updateUserFilter(
                            "role",
                            e.target.value
                        )
                    }
                >

                    <option value="">
                        All roles
                    </option>

                    <option value="USER">
                        User
                    </option>

                    <option value="OWNER">
                        Owner
                    </option>

                    <option value="ADMIN">
                        Admin
                    </option>

                </select>

            </div>


            <div className="filter-select">

                <label>
                    Sort By
                </label>

                <select
                    value={userFilters.sortBy}
                    onChange={(e) =>
                        updateUserFilter(
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

                    <option value="role">
                        Role
                    </option>

                </select>

            </div>


            <button
                className="sort-btn"
                onClick={() =>
                    updateUserFilter(
                        "sortOrder",
                        userFilters.sortOrder === "asc"
                            ? "desc"
                            : "asc"
                    )
                }
            >

                {userFilters.sortOrder === "asc"
                    ? "↑ Ascending"
                    : "↓ Descending"}

            </button>


            <button
                className="reset-btn"
                onClick={resetUserFilters}
            >
                Reset
            </button>

        </div>
    );
};

export default UserFilters;