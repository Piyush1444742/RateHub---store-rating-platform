const UserDetailsModal = ({
    selectedUser,
    closeUserDetails
}) => {

    if (!selectedUser) return null;

    return (
        <div
            className="admin-modal-overlay"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    closeUserDetails();
                }
            }}
        >
            <div className="admin-modal details-modal">

                <div className="modal-header">

                    <div>
                        <span>USER PROFILE</span>

                        <h2>
                            User Details
                        </h2>
                    </div>

                    <button
                        className="modal-close"
                        onClick={closeUserDetails}
                    >
                        ×
                    </button>

                </div>


                {selectedUser.loading ? (

                    <div className="modal-loading">

                        <div className="admin-spinner"></div>

                        Loading details...

                    </div>

                ) : selectedUser.error ? (

                    <div className="admin-alert error">
                        ! {selectedUser.error}
                    </div>

                ) : (

                    <>
                        <div className="detail-profile">

                            <div className="detail-avatar">

                                {(selectedUser.name || "U")
                                    .charAt(0)
                                    .toUpperCase()}

                            </div>

                            <div>

                                <h3>
                                    {selectedUser.name}
                                </h3>

                                <span
                                    className={`role-badge ${String(
                                        selectedUser.role
                                    ).toLowerCase()}`}
                                >
                                    {selectedUser.role}
                                </span>

                            </div>

                        </div>


                        <div className="detail-grid">

                            <div>
                                <span>Email</span>

                                <strong>
                                    {selectedUser.email}
                                </strong>
                            </div>

                            <div>
                                <span>Address</span>

                                <strong>
                                    {selectedUser.address ||
                                        "Not provided"}
                                </strong>
                            </div>

                            <div>
                                <span>User ID</span>

                                <strong>
                                    #{selectedUser.id}
                                </strong>
                            </div>

                            <div>
                                <span>Role</span>

                                <strong>
                                    {selectedUser.role}
                                </strong>
                            </div>

                        </div>


                        {selectedUser.stores &&
                            selectedUser.stores.length > 0 && (

                                <div className="owner-store-details">

                                    <h3>
                                        Owned Stores
                                    </h3>

                                    {selectedUser.stores.map(
                                        (store) => (

                                            <div
                                                className="owner-store-row"
                                                key={store.id}
                                            >

                                                <div>

                                                    <strong>
                                                        {store.name}
                                                    </strong>

                                                    <span>
                                                        {store.email}
                                                    </span>

                                                </div>

                                                <div>

                                                    <strong>
                                                        {Number(
                                                            store.average_rating ||
                                                            0
                                                        ).toFixed(1)}
                                                    </strong>

                                                    <span>
                                                        ★ Rating
                                                    </span>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                    </>
                )}

            </div>
        </div>
    );
};

export default UserDetailsModal;