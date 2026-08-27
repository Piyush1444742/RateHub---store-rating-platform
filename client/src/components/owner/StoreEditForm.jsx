const StoreEditForm = ({
    editingStore,
    storeForm,
    storeError,
    savingStore,
    handleStoreChange,
    handleStoreUpdate,
    cancelEditing
}) => {
    if (!editingStore) return null;

    return (
        <section className="edit-panel">

            <div className="section-heading">

                <div>

                    <span className="section-label">
                        MANAGEMENT
                    </span>

                    <h2>
                        Edit Store
                    </h2>

                </div>

            </div>


            <form
                onSubmit={handleStoreUpdate}
                className="form-card"
            >

                {storeError && (

                    <div className="alert error-alert">

                        <span>
                            !
                        </span>

                        {storeError}

                    </div>

                )}


                <div className="form-grid">

                    <div className="form-group">

                        <label htmlFor="store-name">
                            Store Name
                        </label>

                        <input
                            id="store-name"
                            name="name"
                            value={storeForm.name}
                            onChange={handleStoreChange}
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="store-email">
                            Store Email
                        </label>

                        <input
                            id="store-email"
                            name="email"
                            type="email"
                            value={storeForm.email}
                            onChange={handleStoreChange}
                            required
                        />

                    </div>


                    <div className="form-group full-width">

                        <label htmlFor="store-address">
                            Address
                        </label>

                        <input
                            id="store-address"
                            name="address"
                            value={storeForm.address}
                            onChange={handleStoreChange}
                            required
                        />

                    </div>

                </div>


                <div className="form-actions">

                    <button
                        type="button"
                        className="secondary-btn"
                        onClick={cancelEditing}
                        disabled={savingStore}
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        className="primary-btn"
                        disabled={savingStore}
                    >
                        {savingStore
                            ? "Saving..."
                            : "Save Changes"}
                    </button>

                </div>

            </form>

        </section>
    );
};

export default StoreEditForm;