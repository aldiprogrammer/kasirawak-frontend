import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

export default function Addcart({ kodeproduk, id }) {
    const urlapi = import.meta.env.VITE_API_URL;
    const [btn, setBtn] = useState('false')

    const addkeranjang = async () => {
        await axios.post(urlapi + "Keranjang", {
            id: id,
            kode: localStorage.getItem('cart')
        })
            .then((response) => {
                console.log(response);
                notify();
                cekproduk();
            }).catch((err) => {
                console.log(err.message);

            });
    }

    const notify = () => toast.success("Pesanan berhasil ditambah", {
        position: 'top-center',
    });

    const cekproduk = async () => {
        try {
            const response = await axios.get(urlapi + "Cekkeranjang?kodeproduk=" + kodeproduk + "&&kode=" + localStorage.getItem('cart'));
            console.log(response.data);

            if (response.data.status == 'true') {
                setBtn('true');
            } else {
                setBtn('false');
            }

        } catch (error) {
            console.log(error.message);

        }
    }

    useEffect(() => {
        cekproduk();
    }, [])
    return (
        <div>

            {btn == 'false' ? <> <button className="btn btn-danger w-100" onClick={() => addkeranjang()}><i className='fas fa-plus'></i> Add cart</button></> : <>
                <div>
                    <center>
                        <button className='btn btn-danger'><i className='fas fa-plus'></i></button>
                        <span style={{ marginLeft: '10px', marginRight: '10px' }}>3</span>
                        <button className='btn btn-danger'><i className='fas fa-minus'></i></button>
                    </center>
                </div>
            </>}



        </div>
    )
}
