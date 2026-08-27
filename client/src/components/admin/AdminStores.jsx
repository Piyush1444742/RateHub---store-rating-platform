import StoreFilters from "./StoreFilters";
import StoreTable from "./StoreTable";

const AdminStores = ({
    stores,
    storesLoading,
    storeFilters,
    updateStoreFilter,
    resetStoreFilters,
    stars,
    onAddStore
}) => {
    return (
        <section className="admin-content">

            <div className="admin-section-header">

                <div>

                    <span>
                        BUSINESS DIRECTORY
                    </span>

                    <h2>
                        All Stores
                    </h2>

                    <p>
                        Manage stores registered on the platform.
                    </p>

                </div>


                <button
                    className="admin-primary-btn"
                    onClick={onAddStore}
                >
                    + Add Store
                </button>

            </div>


            <StoreFilters
                storeFilters={storeFilters}
                updateStoreFilter={updateStoreFilter}
                resetStoreFilters={resetStoreFilters}
            />


            <StoreTable
                stores={stores}
                storesLoading={storesLoading}
                stars={stars}
            />

        </section>
    );
};

export default AdminStores;