import UserFilters from "./UserFilters";
import UserTable from "./UserTable";

const AdminUsers = ({
    users,
    usersLoading,
    userFilters,
    updateUserFilter,
    resetUserFilters,
    openUserDetails,
    onAddUser
}) => {
    return (
        <section className="admin-content">

            <div className="admin-section-header">

                <div>

                    <span>
                        PLATFORM USERS
                    </span>

                    <h2>
                        All Users
                    </h2>

                    <p>
                        Manage registered users and administrators.
                    </p>

                </div>


                <button
                    className="admin-primary-btn"
                    onClick={onAddUser}
                >
                    + Add User
                </button>

            </div>


            <UserFilters
                userFilters={userFilters}
                updateUserFilter={updateUserFilter}
                resetUserFilters={resetUserFilters}
            />


            <UserTable
                users={users}
                usersLoading={usersLoading}
                openUserDetails={openUserDetails}
            />

        </section>
    );
};

export default AdminUsers;