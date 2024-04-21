import { useState, useEffect } from "react";
import { redirect, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { SIGN_IN } from "../utils/redux/actions";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import logo from "/assets/x-twitter.svg";


const Login = () => {
    const [username, setUsernam] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");
    const [show, setShow] = useState(true); 


    const handleClose = () => setShow(false);


    const handleSignIn = async (e) => {
        e.preventDefault();
        if (username === "") {
                setErrorMsg("Invalid username");
                return;
            } else {    
            localStorage.setItem("token", username);  
            window.location.assign("http://127.0.0.1:5000/");
        }
        
    };

    
    

    return (
        <Modal show={show} onHide={handleClose} > 
            <Modal.Header closeButton className="bg-dark text-light">
                <Modal.Title> <span className=" mb-2"></span>
                <img src={logo} alt="" height={50} />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark text-light"> 

                <form onSubmit={handleSignIn}> 
                    <div className="input-container mb-3">
                        <label className="ms-1">username:</label>
                        <input
                            type="username"
                            placeholder="username"
                            className="form-control mt-2"
                            value={username}
                            onChange={(e) => setUsernam(e.target.value)}
                        />
                        <label className="ms-1 mt-2 text-danger">{errorMsg}</label>

                    </div>
                    <Button variant="primary" onClick={handleSignIn}>
                        Sign In
                    </Button>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default Login;
