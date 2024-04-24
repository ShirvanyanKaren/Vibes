import axios from "axios";

import jwtDecode from "jwt-decode";

const url = 'http://127.0.0.1:8000'


export const getUserPage = async (token) => {
    try {

        // const decoded = jwtDecode(token);
        // const username = decoded.username;
        let token = await localStorage.getItem("token");
        console.log(typeof token)
        const queries = 25;

        const response = await axios.get(`${url}/fetch_tweets`,
            {
                params: {
                    username: token,
                    max_tweets: queries
                }

            }
        )
        return response.data;
    }
    catch (error) {
        console.error(error);
    }
} 

export const askGronk = async (data) =>{
    try {
        const response = await axios.post(`${url}/receive_word`, 
        data,
        {
            headers: {
                'Content-Type': 'application/json',

            }
        }

        )
        return response.data;
    }
    catch (error) {
        console.error(error);
    }
}
import axios from "axios";

import jwtDecode from "jwt-decode";

const url = 'http://0.0.0.0:8000'


export const getUserPage = async (token) => {
    try {

        // const decoded = jwtDecode(token);
        // const username = decoded.username;
        let token = await localStorage.getItem("token");
        console.log(typeof token)
        const queries = 25;

        const response = await axios.get(`${url}/fetch_tweets`,
            {
                params: {
                    username: token,
                    max_tweets: queries
                }

            }
        )
        return response.data;
    }
    catch (error) {
        console.error(error);
    }
} 

export const askGronk = async (data) =>{
    try {
        const response = await axios.post(`${url}/receive_word`, 
        data,
        {
            headers: {
                'Content-Type': 'application/json',

            }
        }

        )
        return response.data;
    }
    catch (error) {
        console.error(error);
    }
}


