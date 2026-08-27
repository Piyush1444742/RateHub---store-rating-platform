const UserPasswordModal = ({
    showPasswordModal,
    passwordData,
    passwordLoading,
    passwordMessage,
    passwordError,
    handlePasswordChange,
    handlePasswordSubmit,
    closePasswordModal
}) => {

    if (!showPasswordModal) return null;

    return (
        <div
            className="user-modal-overlay"
            onClick={closePasswordModal}
        >

            <div
                className="user-modal password-modal"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >

                <div className="modal-top">

                    <div>

                        <span className="section-label">
                            SECURITY
                        </span>

                        <h2>
                            Change Password
                        </h2>

                        <p>
                            Keep your RateHub account
                            secure.
                        </p>

                    </div>


                    <button
                        className="modal-close"
                        onClick={closePasswordModal}
                    >
                        ×
                    </button>

                </div>


                {passwordMessage && (

                    <div className="password-success">
                        ✓ {passwordMessage}
                    </div>

                )}


                {passwordError && (

                    <div className="password-error">
                        ! {passwordError}
                    </div>

                )}


                <form
                    className="password-form"
                    onSubmit={handlePasswordSubmit}
                >

                    <div className="password-field">

                        <label>
                            Current Password
                        </label>

                        <input
                            type="password"
                            name="currentPassword"
                            value={
                                passwordData.currentPassword
                            }
                            onChange={
                                handlePasswordChange
                            }
                            placeholder="Enter current password"
                            disabled={passwordLoading}
                        />

                    </div>


                    <div className="password-field">

                        <label>
                            New Password
                        </label>

                        <input
                            type="password"
                            name="newPassword"
                            value={
                                passwordData.newPassword
                            }
                            onChange={
                                handlePasswordChange
                            }
                            placeholder="Enter new password"
                            disabled={passwordLoading}
                        />

                        <small>
                            8–16 characters, one uppercase
                            letter and one special character.
                        </small>

                    </div>


                    <div className="password-field">

                        <label>
                            Confirm New Password
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            value={
                                passwordData.confirmPassword
                            }
                            onChange={
                                handlePasswordChange
                            }
                            placeholder="Confirm new password"
                            disabled={passwordLoading}
                        />

                    </div>


                    <div className="password-actions">

                        <button
                            type="button"
                            className="password-cancel"
                            onClick={closePasswordModal}
                            disabled={passwordLoading}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="password-submit"
                            disabled={passwordLoading}
                        >
                            {passwordLoading
                                ? "Updating..."
                                : "Update Password"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default UserPasswordModal;