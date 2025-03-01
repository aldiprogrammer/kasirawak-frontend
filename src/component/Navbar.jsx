import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';


export default function Navbar({ updatekeranjang }) {
    const urlapi = import.meta.env.VITE_API_URL;
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [keranjang, setKeranjang] = useState([]);
    const [totalharga, setTotalharga] = useState(0)
    const [bayar, setBayar] = useState(0);
    const [valkembalian, setValkembalian] = useState(0);
    const [hidebutton, setHidebutton] = useState(true)
    const navigate = useNavigate();


    const getlist = async () => {
        try {
            const response = await axios.get(urlapi + "Keranjang?kode=" + localStorage.getItem('cart'));
            // console.log(response.data);
            setKeranjang(response.data);
            getTotalharga()

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



    const hapuslist = async (id) => {
        try {
            const response = await axios.get(urlapi + "Hapuslist?id=" + id);
            console.log(response.data);
            getlist();
            getTotalharga()
            notifyhapus();
        } catch (error) {
            console.log(error.message);

        }
    }

    const getTotalharga = async () => {
        try {
            const response = await axios.get(urlapi + "Totalharga?kode=" + localStorage.getItem('cart'));
            setTotalharga(response.data.total)
            console.log(response.data);

        } catch (error) {

        }
    }

    const minusQty = async (id) => {

        await axios.post(urlapi + "Minusqty", {
            id: id,
            kode: localStorage.getItem('cart'),
        })
            .then((response) => {
                getlist();
                getTotalharga();
            }).catch((err) => {
                console.log(err.message);
            });
    }

    const addkeranjang = async (id, notif) => {
        await axios.post(urlapi + "Keranjang", {
            id: id,
            kode: localStorage.getItem('cart')
        })
            .then((response) => {

                if (notif == 'notif') {
                    notify();
                }
                getlist();
                getTotalharga()
            }).catch((err) => {
                console.log(err.message);

            });
    }

    const handleLogout = () => {
        Swal.fire({
            title: "Hay " + localStorage.getItem('username'),
            text: "Apakah anda ingin keluar dari halaman ini",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, logout"
        }).then((result) => {
            if (result.isConfirmed) {

                Swal.fire({
                    title: "Yess!",
                    text: "Anda berhasil keluar",
                    icon: "success"
                });

                localStorage.removeItem('username');
                navigate('/');

            }
        });
    }


    const kembalian = (val) => {
        if (val < Number(totalharga)) {
            setValkembalian(0)
            setHidebutton(true);
        } else {
            setBayar(val)
            setValkembalian(val - totalharga)
            setHidebutton(false);
        }
    }


    const notifCetak = () => {
        Swal.fire({
            title: "Hay " + localStorage.getItem('username'),
            text: "Aakah anda yakin untuk mencetak struk ini",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
        }).then((result) => {
            if (result.isConfirmed) {

                // Swal.fire({
                //     title: "Yess!",
                //     text: "Struk berhasil dicetak",
                //     icon: "success"
                // });
                cetakstruk()


            }
        });
    }

    const cetakstruk = async () => {
        await axios.post(urlapi + "Cetakstruk", {
            kode: localStorage.getItem('cart'),
            total: totalharga,
            uang: bayar,
            kembalian: valkembalian,
        })
            .then((response) => {

                // localStorage.removeItem('cart');
                // let angkaAcak = Math.floor(Math.random() * 10000000) + 1;
                // localStorage.setItem('cart', 'KR-' + angkaAcak);
                getlist();
                // notifycetak();
                setBayar(0);
                setValkembalian(0)
                kembalian(0);
                navigate('/struk')
            }).catch((err) => {
                console.log(err.message);

            });
    }

    useEffect(() => {
        getlist();
    }, [updatekeranjang])

    return (
        <>
            <nav className="navbar navbar-light bg-light">
                <div className='container'>
                    <div className="d-flex justify-content-between">
                        <span className="navbar-brand mb-0 h1 fw-bold"><img src="kasirawak.png" className="img-fluid" alt="Gambar Responsif" style={{ height: '40px' }} /></span>
                    </div>
                    <div>
                        <span className="navbar-brand mb-0 h1 fw-bold text-danger" id='notifcart' onClick={handleShow}><i className='fas fa-cart-shopping'></i></span>
                        <small className='fw-bold text-danger' onClick={() => handleLogout()} style={{ cursor: 'pointer' }}><i className='fas fa-user-circle'></i> {localStorage.getItem('username')}</small>

                    </div>
                </div>

            </nav >

            <Offcanvas show={show} onHide={handleClose} placement='end' name='end'>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Orderan</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {keranjang == '' ?
                        <div className=''>
                            <center>
                                <img src='food-cart.png' className="img-fluid" style={{ height: '150px' }} />
                                <h5 className='text-danger'>List pesanan untuk saat ini masih kosong</h5>
                            </center>
                        </div>
                        : ''}
                    {keranjang.map((data, index) => {
                        return (
                            <div key={index}>
                                <div className='d-flex justify-content-between mt-2'>
                                    <div>
                                        <label htmlFor="">{data.nama_produk}</label><br />
                                        <small className='text-secondary'>{data.qty} x {formatRupiah(data.harga)} =  {formatRupiah(data.qty * data.harga)}</small>
                                        <div><button className='btn btn-danger btn-sm rounded-pill' onClick={() => hapuslist(data.id)}><i className='fas fa-trash'></i></button></div>
                                    </div>
                                    <div>
                                        <button className='btn btn-success btn-sm rounded-pill' onClick={() => minusQty(data.id_produk)}><i className='fas fa-minus'></i></button> <label className='fw-bold'> {data.qty} </label> <button className='btn btn-success btn-sm rounded-pill' onClick={() => addkeranjang(data.id_produk, 'nonotif')}><i className='fas fa-plus'></i></button>
                                    </div>
                                </div>
                                <hr />
                            </div>
                        )
                    })}

                    {keranjang == '' ? '' : <><h5 className='fw-bold'>Total : {formatRupiah(totalharga)} </h5></>}

                    <hr />
                    <div className={keranjang == '' ? 'd-none' : 'row g-2'}>
                        <div className='col-md'>
                            <label>Bayar</label>
                            <input type='number' onChange={(e) => kembalian(e.target.value)} className='form-control' />
                        </div>
                        <div className='col-md'>
                            <label>Kembalian</label>
                            <input type='text' value={valkembalian} className='form-control' />
                        </div>
                    </div>
                    <div className={keranjang == '' ? 'd-none' : ''}>
                        {hidebutton == true ? <button className='btn btn-danger w-100 mt-4' disabled><i className='fas fa-print'></i> CETAK STRUK</button> : <button className='btn btn-danger w-100 mt-4' onClick={() => notifCetak()}><i className='fas fa-print'></i> CETAK STRUK</button>}
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </>

    )
}
