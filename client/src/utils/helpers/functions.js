import axios from "axios";

import jwtDecode from "jwt-decode";

const url = 'http://127.0.0.1:8000'


export const getUserPage = async (token) => {
    try {


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

export const dummyData = {
    "1": { name: "Breaking News", proportion: 0.11263127 },
    "2": { name: "Sports Updates", proportion: 0.03656410 },
    "3": { name: "Technology Trends", proportion: 0.04129831 },
    "4": { name: "Celebrity Gossip", proportion: 0.04136362 },
    "5": { name: "Business News", proportion: 0.04473340 },
    "6": { name: "Science Discoveries", proportion: 0.01105989 },
    "7": { name: "Music Industry", proportion: 0.11068537 },
    "8": { name: "Health & Wellness", proportion: 0.01336416 },
    "9": { name: "Travel Destinations", proportion: 0.04110427 },
    "10": { name: "Fashion Trends", proportion: 0.03693615 },
    "11": { name: "Political Commentary", proportion: 0.05136519 },
    "12": { name: "Environmental Issues", proportion: 0.07283326 },
    "13": { name: "Educational Content", proportion: 0.07262983 },
    "14": { name: "Comedy and Humor", proportion: 0.01941374 },
    "15": { name: "Art & Culture", proportion: 0.00121182 },
    "16": { name: "Gaming News", proportion: 0.01075560 },
    "17": { name: "DIY and Home Improvement", proportion: 0.02458654 },
    "18": { name: "Parenting Tips", proportion: 0.02787167 },
    "19": { name: "Pet Care", proportion: 0.09629438 },
    "20": { name: "Fitness Tips", proportion: 0.10581761 },
    "21": { name: "Food and Recipes", proportion: 0.02747982 }
    // "22": { name: "Startups & Entrepreneurship", proportion: 0.697 },
    // "23": { name: "Stock Market Insights", proportion: 0.832 },
    // "24": { name: "Film and Television", proportion: 0.879 },
    // "25": { name: "Motivational Quotes", proportion: 0.601 }
};

export const colors = [
    "#FF00FF", // Neon Magenta
    "#00FFFF", // Neon Cyan
    "#FFFF00", // Neon Yellow
    "#00FF00", // Neon Green
    "#FF0000", // Neon Red
    "#FFA500", // Neon Orange
    "#FF1493", // Neon Deep Pink
    "#00FF7F", // Neon Spring Green
    "#FFD700", // Neon Gold
    "#7FFF00", // Neon Chartreuse
    "#FF4500", // Neon Orange Red
    "#FF69B4", // Neon Hot Pink
    "#00CED1", // Neon Dark Turquoise
    "#FF6347", // Neon Tomato
    "#40E0D0", // Neon Turquoise
  ];


// export const getUserPage = async (token) => {
//     try {

//         // const decoded = jwtDecode(token);
//         // const username = decoded.username;
//         let token = await localStorage.getItem("token");
//         console.log(typeof token)
//         const queries = 25;

//         const response = await axios.get(`${url}/fetch_tweets`,
//             {
//                 params: {
//                     username: token,
//                     max_tweets: queries
//                 }

//             }
//         )
//         return response.data;
//     }
//     catch (error) {
//         console.error(error);
//     }
// } 

// export const askGronk = async (data) =>{
//     try {
//         const response = await axios.post(`${url}/receive_word`, 
//         data,
//         {
//             headers: {
//                 'Content-Type': 'application/json',

//             }
//         }

//         )
//         return response.data;
//     }
//     catch (error) {
//         console.error(error);
//     }
// }


