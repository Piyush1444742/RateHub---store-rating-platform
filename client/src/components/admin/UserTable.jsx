const UserTable = ({
    users,
    usersLoading,
    openUserDetails
}) => {
    return (
        <div className="admin-table-card">

            <div className="admin-table-header">

                <div>
                    <strong>
                        Users
                    </strong>

                    <span>
                        {users.length} results
                    </span>
                </div>

                {usersLoading && (
                    <span className="table-loading">
                        Updating...
                    </span>
                )}

            </div>


            <div className="admin-table-scroll">

                <table className="admin-table">

                    <thead>

                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>

                    </thead>


                    <tbody>

                        {users.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="5"
                                    className="table-empty"
                                >
                                    No users found.
                                </td>

                            </tr>

                        ) : (

                            users.map((user) => (

                                <tr key={user.id}>

                                    <td>

                                        <div className="table-user">

                                            <div className="mini-avatar">

                                                {(user.name || "U")
                                                    .charAt(0)
                                                    .toUpperCase()}

                                            </div>

                                            <div>

                                                <strong>
                                                    {user.name}
                                                </strong>

                                                <small>
                                                    ID #{user.id}
                                                </small>

                                            </div>

                                        </div>

                                    </td>


                                    <td>
                                        {user.email}
                                    </td>


                                    <td>
                                        {user.address || "—"}
                                    </td>


                                    <td>

                                        <span
                                            className={`role-badge ${String(
                                                user.role
                                            ).toLowerCase()}`}
                                        >
                                            {user.role}
                                        </span>

                                    </td>


                                    <td>

                                        <button
                                            className="view-btn"
                                            onClick={() =>
                                                openUserDetails(
                                                    user.id
                                                )
                                            }
                                        >
                                            View Details
                                        </button>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default UserTable;