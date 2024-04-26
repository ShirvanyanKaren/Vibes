import arrow from "/assets/x-arrow.svg";
import * as React from "react";
import search from "/assets/x-search.svg";
import "react-bubble-ui/dist/index.css";
import BubbleUI from "react-bubble-ui";
import { json, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "/assets/x-logo.svg"
import axios from 'axios'
import Cookies from "js-cookie";
import decode from "jwt-decode";
import { getUserPage, askGronk, dummyData } from "../utils/helpers/functions";
import ToolTip from "../components/ToolTip";

const Evolutions = (props) => {
  const [evolutions, setEvolutions] = useState({})
  const [evolutionLoading, setEvolutionLoading] = useState(true)
  const [username, setUsername] = useState("")
  const [gronkSummary, setSummary] = useState("")
  const [grokLoading, setGrokLoading] = useState(false)
  const usingTwitter = false

  useEffect(() => {
    const token = Cookies.get("token");
    const username = decode(token).username;
    setUsername(username)
  }, []);

  useEffect(() => {
    const fetchEvolutions = async () => {
      try {
        if (usingTwitter) {
          const response = await getUserPage(username);
          setEvolutions(response);
          setEvolutionLoading(false);
        } else {
          const response =  dummyData
          console.log(response)
          setEvolutions(response)
          setEvolutionLoading(false)
        }
      } catch (error) {
        console.error(error)
      }

      }
      fetchEvolutions()
      console.log(evolutions)
  }, [username])



  const [searchParams] = useSearchParams();
  if(searchParams.get('token') != null){ 
    document.cookie=`token=${searchParams.get('token')}`
  }
  

  
  const options = {
		size: 180,
		minSize: 20,
		gutter: 8,
		provideProps: true,
		numCols: 5,
		fringeWidth: 160,
		yRadius: 130,
		xRadius: 220,
		cornerRadius: 50,
		showGuides: false,
		compact: true,
		gravitation: 5
	}

  const handleCategory = async(topic) =>{
      setGrokLoading(true)
      const question ={
        "keyword": topic,
      }
      let response =  await askGronk(question)
      setSummary(response.summary)
      setGrokLoading(false)
  }


    return (
      <>
       <div className="evolutions-page-wrapper">
        <div className="spacer">
          <div className="navigation">
              <div className="nav-section">
                <img src={logo}/>
              </div>
          </div>
          
        </div>
        <div className="evolutions-wrapper">
          <div className="evolutions">
            <div className="evolutions-header">
              <img id="x-arrow" src={arrow} />
              <span id="header-title">Evolutions</span>
            </div>
            {evolutionLoading ? 
            <div>Loading</div>
              :
              <BubbleUI options={options} className="bubbleUI">

                {Object.values(evolutions).map((data, i) => {
                  const bubbleStyle = {
                    cursor: "pointer",
                    fontWeight: (data.proportion * 100) < 5 ? "400" : `${400 + (800 * (data.proportion))}px`,
                    fontSize: (data.proportion * 100) < 5 ? "20px" : `${20 + (100 * (data.proportion))}px`,
                    height: `${(500 * (data.proportion))}px`,
                    width:  `${(500 *(data.proportion))}px`,
                    color:"white",
                    backgroundColor:"black",
                    border:"none",
                    zIndex:90,
                  };
                        return <div onClick={()=> {handleCategory(data.name)}}>
                           <ToolTip name={data.name} proportion={data.proportion} onClick={()=>{handleCategory(data.name)}} bubbleStyle={bubbleStyle}/>
                            </div>
                  })}
              </BubbleUI>
          }
          
            </div>
            <div className="tool-bar-wrapper">
                <div className="search">
                      <img src={search}/>
                      <span>Search</span>
                </div>
                <div className="grok-response-container">
                    <div className="tool-bar-heading">
                      <h2>Insight</h2>
                      <div>
                      {grokLoading ?
                      <div className="spinner-border mt-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      : 
                      <div className="grok-response text-start">  

                        {gronkSummary ? gronkSummary : ""
                        } 
                      </div>
                      }
                      </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
                   
      </>
    );


}


  
  export default Evolutions;




