import React, { useEffect, useRef, useState } from "react";
import axios from "axios";


const PrintPage = () => {
    const urlapi = import.meta.env.VITE_API_URL;
    const [keranjang, setKeranjang] = useState([]);
    const [totalharga, setTotalharga] = useState(0)
    const [pay, setPay] = useState([])

    const getData = async () => {
        try {
            const response = await axios.get(urlapi + "Keranjang?kode=" + localStorage.getItem('cart'));
            console.log(response.data);
            setKeranjang(response.data);
        } catch (error) {
            console.log(error.message);
        }
    }

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(angka);
    };

    const getTotalharga = async () => {
        try {
            const response = await axios.get(urlapi + "Totalharga?kode=" + localStorage.getItem('cart'));
            setTotalharga(response.data.total)
            console.log(response.data);

        } catch (error) {

        }
    }

    const getBayar = async () => {
        try {
            const response = await axios.get(urlapi + "Bayar?kode=" + localStorage.getItem('cart'));
            console.log(response.data);
            setPay(response.data)
        } catch (error) {

        }
    }

    useEffect(() => {
        getData();
        getTotalharga()
        getBayar();
        const timer = setTimeout(() => {
            const handleAfterPrint = () => {
                // Setelah pencetakan selesai, arahkan pengguna ke halaman home
                window.location.href = "/home";
                localStorage.removeItem('cart');
            };

            // Mengikat event listener untuk event print selesai
            window.onafterprint = handleAfterPrint;

            // Memicu jendela print  
            window.print();
            // Cleanup event listener setelah penggunaan
            return () => {
                window.onafterprint = null;
            };
        }, 1000)
    }, []);


    return (
        <div className="print-container">
            <style>
                {`
            /* Sembunyikan struk di layar */
            .receipt {
                display: none;
            }

            @media print {
                /* Tampilkan struk hanya saat print */
                .receipt {
                    display: block !important;
                }
                /* Sembunyikan elemen lain */
                body * {
                    visibility: hidden;
                }
                .receipt, .receipt * {
                    visibility: visible;
                }
                .receipt {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                }
            }
            `}
            </style>
            <div className="receipt">
                <h2 className="store-name">WARUNG WAKIYONG</h2>
                <p className="store-address">Jl. Contoh No. 123, Kota Anda</p>
                <hr />

                <div className="receipt-body">
                    <p className="d-flex justify-content-between"><strong>No. Struk :</strong> {localStorage.getItem('cart')}</p>
                    <p className="d-flex justify-content-between"><strong>Tanggal :</strong> {new Date().toLocaleString()}</p>
                    <hr />

                    <table className="receipt-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Qty</th>
                                <th>Harga</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Contoh item */}
                            {keranjang.map((data, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{data.nama_produk}</td>
                                        <td>{data.qty}</td>
                                        <td>{formatRupiah(data.harga)}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <hr />
                    <p className="d-flex justify-content-between"><strong>Total:</strong>{formatRupiah(totalharga)}</p>
                    <p className="d-flex justify-content-between"><strong>Bayar:</strong> {formatRupiah(pay.uang)}</p>
                    <p className="d-flex justify-content-between"><strong>Kembalian:</strong> {formatRupiah(pay.kembalian)}</p>
                </div>

                <hr />
                <p className="thank-you">Terima kasih telah berbelanja!</p>
            </div>
        </div>
    );
};

export default PrintPage;
