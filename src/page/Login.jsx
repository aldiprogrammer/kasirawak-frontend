import React, { useState } from 'react'
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from 'sweetalert2'
import axios from 'axios';
import { useNavigate } from 'react-router';

export default function Login() {
    const urlapi = import.meta.env.VITE_API_URL;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const handleLogin = () => {
        if (username == '' || password == '') {
            Swal.fire({
                title: "Opps",
                text: "Element input tidak boleh kosong.",
                icon: "warning",
                confirmButtonText: "OK",
            });
        } else {

            Aksilogin()
        }
    }

    const Aksilogin = async () => {
        await axios.post(urlapi + "Login", {
            username: username,
            password: password
        })
            .then((response) => {
                if (response.data.status == 'berhasil') {
                    localStorage.setItem('username', username);
                    navigate('/home');
                } else if (response.data.status == 'pass salah') {
                    Swal.fire({
                        title: "Opps",
                        text: "Password salah",
                        icon: "error",
                        confirmButtonText: "Close",
                    });
                } else {
                    Swal.fire({
                        title: "Opps",
                        text: "Username salah",
                        icon: "error",
                        confirmButtonText: "Close",
                    });

                }

            }).catch((err) => {
                console.log(err.message);

            });
    }
    return (
        <Container className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <Row>
                <Col>
                    <Card style={{ width: "400px", borderRadius: "15px" }} className="shadow-lg p-4 border-0">
                        <Card.Body>
                            <h3 className="text-center mb-4 text-danger">
                                <img src="kasirawak.png" className="img-fluid" alt="Gambar Responsif" />
                            </h3>


                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label className="fw-semibold">Username</Form.Label>
                                <Form.Control type="text" placeholder="Enter your username" className="py-2" onChange={(e) => setUsername(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label className="fw-semibold">Password</Form.Label>
                                <Form.Control type="password" placeholder="Enter your password" className="py-2" onChange={(e) => setPassword(e.target.value)} />
                            </Form.Group>
                            <Button variant="danger" type="submit" className="w-100 py-2 fw-bold shadow-sm" onClick={() => handleLogin()}>
                                Login
                            </Button>
                            <div className="text-center mt-3">
                                <a href="#" className="text-decoration-none text-primary fw-semibold">Masukan username dan password anda dengan benar</a>
                            </div>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container >
    )
}
