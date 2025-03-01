import React, { useEffect, useState } from 'react'
import Navbar from '../component/Navbar'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Addcart from '../component/Addcart';
import { Navigate, useNavigate } from 'react-router';
import Swal from 'sweetalert2';


export default function Home() {
    const urlapi = import.meta.env.VITE_API_URL;
    const [makanan, setMakanan] = useState([]);
    const [pagemenu, setPagemenu] = useState(1);
    const [keranjang, setKeranjang] = useState([]);
    const [totalharga, setTotalharga] = useState(0)
    const [bayar, setBayar] = useState(0);
    const [valkembalian, setValkembalian] = useState(0);
    const [hidebutton, setHidebutton] = useState(true)
    const [cari, setCari] = useState('');
    const [kategori, setKategori] = useState([])

    const navigate = useNavigate();


    const handlemenu = (id) => {
        setPagemenu(id)
        getmakanan(id, cari);
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

    const notify = () => toast.success("Pesanan berhasil ditambah", {
        position: 'top-center',
    });


    const getmakanan = async (pagemenu, src) => {
        try {
            const response = await axios.get(urlapi + "Makanan?kategori=" + pagemenu + "&&src=" + src);
            setMakanan(response.data)
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleSearch = async (e) => {
        setCari(e)
        getmakanan(pagemenu, e)

    }


    const getlist = async () => {
        try {
            const response = await axios.get(urlapi + "Keranjang?kode=" + localStorage.getItem('cart'));
            console.log(response.data);
            setKeranjang(response.data);

        } catch (error) {
            console.log(error.message);

        }
    }


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

    const notifyhapus = () => toast.success("Pesanan berhasil dihapus", {
        position: 'bottom-right',
    });

    const getTotalharga = async () => {
        try {
            const response = await axios.get(urlapi + "Totalharga?kode=" + localStorage.getItem('cart'));
            setTotalharga(response.data.total)
            console.log(response.data);

        } catch (error) {

        }
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
                notifycetak();
                setBayar(0);
                setValkembalian(0)
                kembalian(0);
                navigate('/struk')
            }).catch((err) => {
                console.log(err.message);

            });
    }

    const notifycetak = () => toast.success("Pesanan berhasil dicetak", {
        position: 'bottom-right',
    });


    const formatRupiah = (angka) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(angka);
    };

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

    const getKategori = async () => {
        try {
            const response = await axios.get(urlapi + "Kategori");
            // console.log(response.data);
            setKategori(response.data)
        } catch (error) {

        }
    }
    useEffect(() => {
        if (localStorage.getItem('cart') == null) {
            let angkaAcak = Math.floor(Math.random() * 10000000) + 1;
            localStorage.setItem('cart', 'KR-' + angkaAcak);
        }
        getmakanan(pagemenu, 'null');
        getlist();
        getTotalharga();
        getKategori();
    }, [])
    return (
        <div>
            <Navbar updatekeranjang={keranjang} />
            <div className='container'>
                <div className='row mt-4'>
                    <div className='col-sm-8 col-12'>
                        <div className="d-flex justify-content-between">
                            {kategori.map((data, index) => {
                                return (
                                    <><button type="button" className={pagemenu == data.id ? 'btn btn-danger w-100' : 'btn btn-outline-danger w-100'} onClick={() => handlemenu(data.id)} style={{ marginRight: '20px' }}> <i className='fas fa-bowl-food'></i> {data.nama_kategori}</button></>
                                )
                            })}
                        </div>
                        <h5 className='mt-3'> <i className='fas fa-list'></i> List menu</h5>
                        <div className='produk'>
                            <div className="row">
                                <div className='mt-3 mb-2' >
                                    <input type='text' className='form-control rounded-pill' name='search' placeholder='Cari item menu disini' onChange={(e) => handleSearch(e.target.value)} />
                                </div>

                                {makanan.map((data, index) => {
                                    return (
                                        <>
                                            <div className="col-md-4 mt-3 col-6">
                                                <div className="card card-produk shadow-sm">
                                                    <img src={data.img} className="card-img-top" alt="Produk" />
                                                    <div className="card-body">
                                                        <h5 className="card-title text-center">{data.nama_produk}</h5>
                                                        <h6 className="text-danger fw-bold text-center">{formatRupiah(data.harga)}</h6>
                                                        <button className="btn btn-danger w-100" onClick={() => addkeranjang(data.id, 'notif')}><i className='fas fa-plus'></i> Add cart</button>
                                                    </div>
                                                </div>
                                            </div >
                                        </>
                                    )
                                })}

                                {makanan == '' ?
                                    <div className='mt-5 text-center'>
                                        <img src="icons8-search.gif" className="img-fluid mt-3" alt="..."></img>
                                        <p className='text-danger'>Item menu tidak ditemukan</p>
                                    </div> : ''}

                            </div >
                        </div>
                    </div>
                    <div className='col-sm-4' id='keranjangpesanan'>
                        <div className='keranjang '>
                            <h5><i className='fas fa-receipt'></i> Keranjang Pesanan</h5>
                        </div>
                        <h5 className='mt-2 fw-bold'>#{localStorage.getItem('cart')}</h5>
                        <div className='listkeranjang mt-3'>
                            <div className='card'>
                                <div className='card-header'>
                                    <p className=''>List keranjang</p>
                                </div>
                                <div className='card-body'>
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
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className={keranjang == '' ? 'd-none' : 'mt-3'}>
                            <h5 className='fw-bold'>Total : {formatRupiah(totalharga)}</h5>
                            <hr />
                            <div className='row g-2'>
                                <div className='col-md'>
                                    <label>Bayar</label>
                                    <input type='number' onChange={(e) => kembalian(e.target.value)} className='form-control' />
                                </div>
                                <div className='col-md'>
                                    <label>Kembalian</label>
                                    <input type='text' value={valkembalian} className='form-control' />
                                </div>
                            </div>
                            {hidebutton == true ? <button className='btn btn-danger w-100 mt-4' disabled><i className='fas fa-print'></i> CETAK STRUK</button> : <button className='btn btn-danger w-100 mt-4' onClick={() => notifCetak()}><i className='fas fa-print'></i> CETAK STRUK</button>}
                        </div>

                    </div>
                </div>
            </div>
            <ToastContainer />
        </div >
    )
}
