const AddStoreModal = ({
    show,
    formLoading,
    formMessage,
    formError,
    storeForm,
    handleStoreChange,
    handleCreateStore,
    closeStoreModal,
    ownerUsers
}) => {

    if (!show) return null;

    return (
        <div
            className="admin-modal-overlay"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    closeStoreModal();
                }
            }}
        >
            <div className="admin-modal">

                <div className="modal-header">
                    <div>
                        <span>BUSINESS MANAGEMENT</span>
                        <h2>Add New Store</h2>
                    </div>

                    <button
                        className="modal-close"
                        onClick={closeStoreModal}
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
                    onSubmit={handleCreateStore}
                    className="admin-form"
                >
                    <div className="admin-field">
                        <label>Store Name</label>

                        <input
                            name="name"
                            value={storeForm.name}
                            onChange={handleStoreChange}
                            placeholder="Store name"
                            required
                        />
                    </div>

                    <div className="admin-field">
                        <label>Store Email</label>

                        <input
                            type="email"
                            name="email"
                            value={storeForm.email}
                            onChange={handleStoreChange}
                            placeholder="store@example.com"
                            required
                        />
                    </div>

                    <div className="admin-field">
                        <label>Address</label>

                        <textarea
                            name="address"
                            value={storeForm.address}
                            onChange={handleStoreChange}
                            maxLength="400"
                            rows="3"
                            placeholder="Store address..."
                            required
                        />
                    </div>

                    <div className="admin-field">
                        <label>Store Owner</label>

                        <select
                            name="ownerId"
                            value={storeForm.ownerId}
                            onChange={handleStoreChange}
                            required
                        >
                            <option value="">
                                Select an owner
                            </option>

                            {ownerUsers.length === 0 ? (
                                <option disabled>
                                    No owners available
                                </option>
                            ) : (
                                ownerUsers.map((owner) => (
                                    <option
                                        key={owner.id}
                                        value={owner.id}
                                    >
                                        {owner.name}
                                        {" — "}
                                        {owner.email}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    <div className="modal-actions">

                        <button
                            type="button"
                            className="admin-secondary-btn"
                            onClick={closeStoreModal}
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
                                : "Create Store"}
                        </button>

                    </div>
                </form>

            </div>
        </div>
    );
};

export default AddStoreModal;