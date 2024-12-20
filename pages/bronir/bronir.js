import React, { useState, useEffect } from 'react';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import { supabase } from '../../lib/supabaseClient'; // Import koneksi Supabase

// Fungsi untuk Global Filter (Pencarian)
function GlobalFilter({ globalFilter, setGlobalFilter }) {
    return (
        <div>
            <input
                value={globalFilter || ''}
                onChange={e => setGlobalFilter(e.target.value)}
                placeholder="Cari data..."
                className="form-control mb-3"
            />
        </div>
    );
}

export default function MenuBerasPolos() {
    const [showModal, setShowModal] = useState(false);
    const [transactionData, setTransactionData] = useState({
        date: '',
        description: '',
        type: 'masuk', // Default ke 'masuk'
        quantity: '',
    });

    const [transactions, setTransactions] = useState([]);

    // Mengambil data transaksi dari Supabase
    const fetchData = async () => {
        const { data, error } = await supabase
            .from('bronir')
            .select('*');

        if (error) {
            console.error('Error fetching data:', error);
        } else {
            setTransactions(data); // Update state dengan data terbaru
        }
    };

    // Gunakan useEffect untuk fetch data pertama kali
    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTransactionData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (transactionData.date && transactionData.quantity) {
            if (editTransaction) {
                // Update data di Supabase
                const { data, error } = await supabase
                    .from('bronir')
                    .update({
                        date: transactionData.date,
                        description: transactionData.description,
                        type: transactionData.type,
                        quantity: transactionData.quantity,
                    })
                    .eq('id', editTransaction.id);

                if (error) {
                    console.error('Error updating transaction:', error);
                    alert('Gagal mengupdate data');
                } else {
                    fetchData();
                    setEditTransaction(null);
                    setTransactionData({ date: '', description: '', type: 'masuk', quantity: '' });
                    setShowModal(false);
                    alert('Data berhasil diupdate');
                }
            } else {
                // Insert data baru
                const { data, error } = await supabase
                    .from('bronir')
                    .insert([{
                        date: transactionData.date,
                        description: transactionData.description,
                        type: transactionData.type,
                        quantity: transactionData.quantity,
                    }]);

                if (error) {
                    console.error('Error inserting transaction:', error);
                    alert('Gagal menambahkan data');
                } else {
                    fetchData();
                    setTransactionData({ date: '', description: '', type: 'masuk', quantity: '' });
                    setShowModal(false);
                    alert('Data berhasil disimpan');
                }
            }
        } else {
            alert('Tanggal dan Quantity wajib diisi!');
        }
    };


    const [editTransaction, setEditTransaction] = useState(null);

    const handleUpdate = (transaction) => {
        setEditTransaction(transaction);
        setTransactionData({
            date: transaction.date,
            description: transaction.description,
            type: transaction.type,
            quantity: transaction.quantity,
        });
        setShowModal(true);
    };


    {/* Modal Input Transaksi */ }
    {
        showModal && (
            <div
                className="modal show"
                style={{ display: 'block' }}
                onClick={() => setShowModal(false)}
            >
                <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{editTransaction ? 'Edit Transaksi' : 'Tambah Transaksi'}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowModal(false)}
                            ></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Tanggal</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={transactionData.date}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Deskripsi</label>
                                    <input
                                        type="text"
                                        name="description"
                                        value={transactionData.description}
                                        onChange={handleChange}
                                        className="form-control"
                                        autoComplete='off'
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Jenis Transaksi</label>
                                    <div className="form-check">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            id="masuk"
                                            name="type"
                                            value="masuk"
                                            checked={transactionData.type === 'masuk'}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label" htmlFor="masuk">Masuk</label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            id="keluar"
                                            name="type"
                                            value="keluar"
                                            checked={transactionData.type === 'keluar'}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label" htmlFor="keluar">Keluar</label>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Quantity (Sak)</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={transactionData.quantity}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Close
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editTransaction ? 'Update' : 'Simpan'}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        )
    }


    const handleDelete = async (id) => {
        // Tampilkan konfirmasi sebelum menghapus
        const isConfirmed = confirm('Yakin anda ingin menghapus data ini?');

        if (isConfirmed) {
            console.log("Hapus ID:", id); // Menampilkan ID yang akan dihapus
            const { error } = await supabase
                .from('bronir') // Ganti sesuai nama tabel Anda
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting:', error);
                alert('Gagal menghapus data!');
            } else {
                // Hapus data dari state setelah berhasil dihapus dari database
                setTransactions((prevTransactions) =>
                    prevTransactions.filter((transaction) => transaction.id !== id)
                );
                alert('Data berhasil dihapus!');
            }
        } else {
            console.log('Penghapusan dibatalkan');
        }
    };






    const sakToKg = 50; // 1 sak = 50 kg
    const sakToTon = sakToKg / 1000; // 1 sak = 0.05 ton

    const totalBarangMasukSak = transactions.filter(t => t.type === 'masuk')
        .reduce((sum, t) => sum + parseInt(t.quantity || 0), 0);
    const totalBarangKeluarSak = transactions.filter(t => t.type === 'keluar')
        .reduce((sum, t) => sum + parseInt(t.quantity || 0), 0);

    const totalBarangMasukKg = totalBarangMasukSak * sakToKg;
    const totalBarangKeluarKg = totalBarangKeluarSak * sakToKg;
    const sisaStokSak = totalBarangMasukSak - totalBarangKeluarSak;
    const sisaStokKg = totalBarangMasukKg - totalBarangKeluarKg;

    // Konversi ke Ton
    const totalBarangMasukTon = totalBarangMasukKg / 1000;
    const totalBarangKeluarTon = totalBarangKeluarKg / 1000;
    const sisaStokTon = sisaStokKg / 1000;




    const columns = React.useMemo(
        () => [
            { Header: 'Tanggal', accessor: 'date', Cell: ({ value }) => formatDate(value) },
            { Header: 'Deskripsi', accessor: 'description' },
            {
                Header: 'Jenis Transaksi',
                accessor: 'type',
                Cell: ({ value }) => (
                    <span
                        style={{
                            fontWeight: 'bold',
                            color: value === 'masuk' ? 'blue' : 'red'
                        }}
                    >
                        {value === 'masuk' ? 'Masuk' : 'Keluar'}
                    </span>
                ),
            },
            { Header: 'Quantity', accessor: 'quantity' },
            {
                Header: 'Action',
                accessor: 'action',
                Cell: ({ row }) => (
                    <div className="d-flex gap-2">
                        <button
                            key={`update-${row.id}`}
                            className="btn btn-warning btn-sm"
                            onClick={() => handleUpdate(row.original)}
                        >
                            Update
                        </button>

                        <button
                            key={`delete-${row.id}`}
                            className="btn btn-danger btn-sm"
                            onClick={handleDelete.bind(null, row.original.id)}
                        >
                            Hapus
                        </button>
                    </div>
                ),
            },

        ],
        [transactions]
    );


    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state: { globalFilter, pageIndex, pageSize },
        setGlobalFilter,
        canNextPage,
        canPreviousPage,
        pageOptions,
        nextPage,
        previousPage,
        gotoPage,
    } = useTable(
        {
            columns,
            data: transactions,
        },
        useGlobalFilter,  // Menambahkan global filter untuk pencarian
        useSortBy,        // Menambahkan useSortBy untuk penyortiran
        usePagination     // Menambahkan usePagination untuk pagination
    );

    const formatDate = (date) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('id-ID', options);
    };

    return (
        <div>
            <h1 className="text-center text-primary fw-bold fs-2 mt-2">Bronir</h1>

            {/* Card Row */}
            <div className="container mt-4">
                <div className="row">
                    {/* Total Barang Masuk Card */}
                    <div className="col-md-4 mb-4">
                        <div className="card text-white bg-primary">
                            <div className="card-body d-flex justify-content-between">
                                <div>
                                    <h5 className="card-title">Total Barang Masuk</h5>
                                    <p className="card-text">
                                        {totalBarangMasukKg} Kg / {totalBarangMasukTon.toFixed(2)} Ton
                                    </p>
                                </div>
                                <div className="text-right">
                                    <h5 className="card-title" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                        {totalBarangMasukSak} Sak
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Total Barang Keluar Card */}
                    <div className="col-md-4 mb-4">
                        <div className="card text-white bg-danger">
                            <div className="card-body d-flex justify-content-between">
                                <div>
                                    <h5 className="card-title">Total Barang Keluar</h5>
                                    <p className="card-text">
                                        {totalBarangKeluarKg} Kg / {totalBarangKeluarTon.toFixed(2)} Ton
                                    </p>
                                </div>
                                <div className="text-right">
                                    <h5 className="card-title" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                        {totalBarangKeluarSak} Sak
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sisa Stok Card */}
                    <div className="col-md-4 mb-4">
                        <div className="card text-white bg-success">
                            <div className="card-body d-flex justify-content-between">
                                <div>
                                    <h5 className="card-title">Sisa Stok</h5>
                                    <p className="card-text">
                                        {sisaStokKg} Kg / {sisaStokTon.toFixed(2)} Ton
                                    </p>
                                </div>
                                <div className="text-right">
                                    <h5 className="card-title" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                        {sisaStokSak} Sak
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Button to show Modal */}
            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="input-group" style={{ maxWidth: '300px', width: '100%' }}>
                        <input
                            value={globalFilter || ''}
                            onChange={e => setGlobalFilter(e.target.value)}
                            placeholder="Cari data..."
                            className="form-control"
                        />
                    </div>
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                            Transaksi
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Input Transaksi */}
            {showModal && (
                <div
                    className="modal show"
                    style={{ display: 'block' }}
                    onClick={() => setShowModal(false)}
                >
                    <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Tambah Transaksi</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Tanggal</label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={transactionData.date}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Deskripsi</label>
                                        <input
                                            type="text"
                                            name="description"
                                            value={transactionData.description}
                                            onChange={handleChange}
                                            className="form-control"
                                            autoComplete='off'
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Jenis Transaksi</label>
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                id="masuk"
                                                name="type"
                                                value="masuk"
                                                checked={transactionData.type === 'masuk'}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label" htmlFor="masuk">Masuk</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                id="keluar"
                                                name="type"
                                                value="keluar"
                                                checked={transactionData.type === 'keluar'}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label" htmlFor="keluar">Keluar</label>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Quantity (Sak)</label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={transactionData.quantity}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Close
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Simpan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Table to show transactions using react-table */}
            <div className="container mt-4">
                <h3>Data Transaksi</h3>
                <div className="table-responsive">
                    <table className="table table-bordered" {...getTableProps()}>
                        <thead>
                            {headerGroups.map((headerGroup, idx) => (
                                <tr {...headerGroup.getHeaderGroupProps()} key={idx}>
                                    {headerGroup.headers.map((column, columnIdx) => (
                                        <th {...column.getHeaderProps(column.getSortByToggleProps())} key={columnIdx}>
                                            {column.render('Header')}
                                            {/* Indikator Penyortiran */}
                                            <span key={column.id}>
                                                {column.isSorted
                                                    ? column.isSortedDesc
                                                        ? ' 🔽'
                                                        : ' 🔼'
                                                    : ''}
                                            </span>

                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {rows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize).map((row, idx) => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()} key={idx}>
                                        {row.cells.map((cell, idx) => (
                                            <td {...cell.getCellProps()} key={idx}>
                                                {cell.render('Cell')}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                </div>
                {/* Pagination */}
                <div className="d-flex justify-content-between mt-3" >
                    <button
                        className="btn btn-secondary"
                        onClick={() => previousPage()}
                        disabled={!canPreviousPage}
                    >
                        Previous
                    </button>
                    <span>Page {pageIndex + 1} of {pageOptions.length}</span>
                    <button
                        className="btn btn-secondary"
                        onClick={() => nextPage()}
                        disabled={!canNextPage}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
