const ChangePasswordModal = ({
    show,
    currentPassword,
    newPassword,
    confirmPassword,
    passwordMessage,
    passwordError,
    changingPassword,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    handleChangePassword,
    closePasswordModal
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
                    closePasswordModal();
                }

            }}
        >

            <div className="owner-modal">

                <div className="owner-modal-header">

                    <div>

                        <span className="section-label">
                            SECURITY
                        </span>

                        <h2>
                            Change Password
                        </h2>

                        <p>
                            Update your owner account
                            password securely.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="owner-modal-close"
                        onClick={closePasswordModal}
                    >
                        ×
                    </button>

                </div>


                {passwordMessage && (

                    <div className="alert success-alert">

                        <span>
                            ✓
                        </span>

                        {passwordMessage}

                    </div>

                )}


                {passwordError && (

                    <div className="alert error-alert">

                        <span>
                            !
                        </span>

                        {passwordError}

                    </div>

                )}


                <form
                    onSubmit={handleChangePassword}
                    className="owner-password-form"
                >

                    <div className="form-group full-width">

                        <label htmlFor="current-password">
                            Current Password
                        </label>

                        <input
                            id="current-password"
                            type="password"
                            value={currentPassword}
                            onChange={(e) =>
                                setCurrentPassword(
                                    e.target.value
                                )
                            }
                            required
                            disabled={changingPassword}
                            placeholder="Enter current password"
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="new-password">
                            New Password
                        </label>

                        <input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(
                                    e.target.value
                                )
                            }
                            minLength="6"
                            required
                            disabled={changingPassword}
                            placeholder="Enter new password"
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="confirm-password">
                            Confirm New Password
                        </label>

                        <input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                            minLength="6"
                            required
                            disabled={changingPassword}
                            placeholder="Confirm new password"
                        />

                    </div>


                    <div className="owner-password-actions">

                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={closePasswordModal}
                            disabled={changingPassword}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="primary-btn"
                            disabled={changingPassword}
                        >
                            {changingPassword
                                ? "Updating..."
                                : "Update Password"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default ChangePasswordModal;