const OwnerProfileModal = ({
    show,
    ownerName,
    ownerEmail,
    ownerAddress,
    closeProfileModal
}) => {
    if (!show) return null;

    return (
        <div
            className="owner-modal-overlay"
            onMouseDown={(e) => {

                if (
                    e.target ===
                    e.currentTarget
                ) {
                    closeProfileModal();
                }

            }}
        >

            <div className="owner-modal">

                <div className="owner-modal-header">

                    <div>

                        <span className="section-label">
                            OWNER PROFILE
                        </span>

                        <h2>
                            My Profile
                        </h2>

                    </div>


                    <button
                        type="button"
                        className="owner-modal-close"
                        onClick={closeProfileModal}
                    >
                        ×
                    </button>

                </div>


                <div className="owner-profile-large">

                    <div className="owner-profile-large-avatar">

                        {ownerName
                            .charAt(0)
                            .toUpperCase()}

                    </div>

                    <div>

                        <h3>
                            {ownerName}
                        </h3>

                        <span>
                            Store Owner
                        </span>

                    </div>

                </div>


                <div className="owner-profile-details">

                    <div>

                        <span>
                            NAME
                        </span>

                        <strong>
                            {ownerName}
                        </strong>

                    </div>


                    <div>

                        <span>
                            EMAIL
                        </span>

                        <strong>
                            {ownerEmail}
                        </strong>

                    </div>


                    <div>

                        <span>
                            ADDRESS
                        </span>

                        <strong>
                            {ownerAddress}
                        </strong>

                    </div>


                    <div>

                        <span>
                            ROLE
                        </span>

                        <strong>
                            OWNER
                        </strong>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default OwnerProfileModal;