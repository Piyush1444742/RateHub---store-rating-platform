const AdminProfileModal = ({
    show,
    adminName,
    adminEmail,
    adminAddress,
    closeProfileModal
}) => {

    if (!show) return null;

    return (
        <div
            className="admin-modal-overlay"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    closeProfileModal();
                }
            }}
        >
            <div className="admin-modal">

                <div className="modal-header">

                    <div>

                        <span>
                            ADMINISTRATOR PROFILE
                        </span>

                        <h2>
                            My Profile
                        </h2>

                    </div>

                    <button
                        className="modal-close"
                        onClick={closeProfileModal}
                    >
                        ×
                    </button>

                </div>


                <div className="admin-profile-large">

                    <div className="admin-profile-large-avatar">

                        {adminName
                            .charAt(0)
                            .toUpperCase()}

                    </div>

                    <div>

                        <h3>
                            {adminName}
                        </h3>

                        <span>
                            System Administrator
                        </span>

                    </div>

                </div>


                <div className="admin-profile-details">

                    <div>
                        <span>NAME</span>

                        <strong>
                            {adminName}
                        </strong>
                    </div>

                    <div>
                        <span>EMAIL</span>

                        <strong>
                            {adminEmail}
                        </strong>
                    </div>

                    <div>
                        <span>ADDRESS</span>

                        <strong>
                            {adminAddress}
                        </strong>
                    </div>

                    <div>
                        <span>ROLE</span>

                        <strong>
                            ADMIN
                        </strong>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default AdminProfileModal;