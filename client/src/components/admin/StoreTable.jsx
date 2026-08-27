const StoreTable = ({
    stores,
    storesLoading,
    stars
}) => {
    return (
        <div className="admin-table-card">

            <div className="admin-table-header">

                <div>
                    <strong>
                        Stores
                    </strong>

                    <span>
                        {stores.length} results
                    </span>
                </div>

                {storesLoading && (
                    <span className="table-loading">
                        Updating...
                    </span>
                )}

            </div>


            <div className="admin-table-scroll">

                <table className="admin-table">

                    <thead>

                        <tr>
                            <th>Store</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Rating</th>
                            <th>Owner ID</th>
                        </tr>

                    </thead>


                    <tbody>

                        {stores.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="5"
                                    className="table-empty"
                                >
                                    No stores found.
                                </td>

                            </tr>

                        ) : (

                            stores.map((store) => (

                                <tr key={store.id}>

                                    <td>

                                        <div className="table-user">

                                            <div className="store-mini-icon">
                                                ▣
                                            </div>

                                            <div>

                                                <strong>
                                                    {store.name}
                                                </strong>

                                                <small>
                                                    ID #{store.id}
                                                </small>

                                            </div>

                                        </div>

                                    </td>


                                    <td>
                                        {store.email}
                                    </td>


                                    <td>
                                        {store.address}
                                    </td>


                                    <td>

                                        <div className="table-rating">

                                            <strong>
                                                {Number(
                                                    store.overall_rating || 0
                                                ).toFixed(1)}
                                            </strong>

                                            <span>
                                                {stars(
                                                    store.overall_rating
                                                )}
                                            </span>

                                        </div>

                                    </td>


                                    <td>
                                        #{store.owner_id}
                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default StoreTable;