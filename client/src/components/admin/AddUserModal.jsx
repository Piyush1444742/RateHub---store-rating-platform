const AddUserModal = ({
    show,
    formLoading,
    formMessage,
    formError,
    userForm,
    handleUserChange,
    handleCreateUser,
    closeUserModal
}) => {

    if (!show) return null;

    return (
        <div
            className="admin-modal-overlay"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    closeUserModal();
                }
            }}
        >

            <div className="admin-modal">

                <div className="modal-header">

                    <div>

                        <span>
                            USER MANAGEMENT
                        </span>

                        <h2>
                            Add New User
                        </h2>

                    </div>

                    <button
                        className="modal-close"
                        onClick={closeUserModal}
                    >
                        ×
                    </button>

                </div>


                {formMessage && (
                    <div className="admin-alert success">
                        ✓ {formMessage}
                    </div>
                )}


                {formError && (
                    <div className="admin-alert error">
                        ! {formError}
                    </div>
                )}


                <form
                    onSubmit={handleCreateUser}
                    className="admin-form"
                >

                    <div className="form-two-column">

                        <div className="admin-field">

                            <label>
                                Name
                            </label>

                            <input
                                name="name"
                                value={userForm.name}
                                onChange={handleUserChange}
                                placeholder="Minimum 20 characters"
                                required
                            />

                            <small>
                                {userForm.name.length}/60
                            </small>

                        </div>


                        <div className="admin-field">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={userForm.email}
                                onChange={handleUserChange}
                                placeholder="user@example.com"
                                required
                            />

                        </div>

                    </div>


                    <div className="form-two-column">

                        <div className="admin-field">

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={userForm.password}
                                onChange={handleUserChange}
                                placeholder="8-16 characters"
                                required
                            />

                        </div>


                        <div className="admin-field">

                            <label>
                                Role
                            </label>

                            <select
                                name="role"
                                value={userForm.role}
                                onChange={handleUserChange}
                            >

                                <option value="USER">
                                    Normal User
                                </option>

                                <option value="ADMIN">
                                    Administrator
                                </option>

                            </select>

                        </div>

                    </div>


                    <div className="admin-field">

                        <label>
                            Address
                        </label>

                        <textarea
                            name="address"
                            value={userForm.address}
                            onChange={handleUserChange}
                            maxLength="400"
                            rows="3"
                            placeholder="Enter address..."
                        />

                        <small>
                            {userForm.address.length}/400
                        </small>

                    </div>


                    <div className="modal-actions">

                        <button
                            type="button"
                            className="admin-secondary-btn"
                            onClick={closeUserModal}
                            disabled={formLoading}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="admin-primary-btn"
                            disabled={formLoading}
                        >
                            {formLoading
                                ? "Creating..."
                                : "Create User"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default AddUserModal;