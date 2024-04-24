import arrow from "/assets/x-arrow.svg";
import * as React from "react";
import search from "/assets/x-search.svg";
import "react-bubble-ui/dist/index.css";
import BubbleUI from "react-bubble-ui";
import { json, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie"
import logo from "/assets/x-logo.svg"
import axios from 'axios'
import { askGronk } from "../utils/helpers/functions";






const Evolutions = (props) => {
  const [evolutions, setEvolutions] = useState({})
  const [evolutionLoading, setEvolutionLoading] = useState(true)



  const [searchParams] = useSearchParams();
  if(searchParams.get('token') != null){ 
    document.cookie=`token=${searchParams.get('token')}`
  }
  


  var colors = [
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
  
  const [gronkSummary, setSummary] = useState("")
  
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
      console.log(topic.name)
      let response =  await askGronk({keyword: topic.name})
      setSummary(response.summary)
  }

  useEffect(()=>{

      fetch("http://localhost:8000/fetch_tweets",{
        method:"POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          {
            "token": Cookies.get('token')
          }
          )}
        )
        .then(response => response.json())
        .then(data => {


          setEvolutionLoading(false)
          setEvolutions(data)
          console.log(data)
        })
        .catch(error => console.error(error));

  }, [])




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

                {evolutions.domains.map((data, i) => {
                  const bubbleStyle = {
                    cursor: "pointer",
                    fontWeight: (data.proportion * 100) < 5 ? "400" : `${400 + (800 * (data.proportion))}px`,
                    fontSize: (data.proportion * 100) < 5 ? "20px" : `${20 + (50 * (data.proportion))}px`,
                    height: `${(500 * (data.proportion))}px`,
                    width:  `${(500 *(data.proportion))}px`,
                    color:"white",
                    backgroundColor:"black",
                    border:"none",
                    zIndex:90,
                  };
                        return <div className="bubble-entry" style={bubbleStyle} onClick={()=>{handleCategory(data.entities[0])}}>{data.name}</div>;
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
                        {gronkSummary != "" ? 
                        gronkSummary:
                        <></>  
                      }
                      </div>
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



// @Author https://www.geeksforgeeks.org/bitonic-sort/
  function compAndSwap(a, i, j, dir) {
    if ((a[i] > a[j] && dir === 1) || 
    (a[i] < a[j] && dir === 0))
    {
      // Swapping elements
      var temp = a[i];
      a[i] = a[j];
      a[j] = temp;
    }
  }

  /* It recursively sorts a bitonic sequence in ascending
order, if dir = 1, and in descending order otherwise
(means dir=0). The sequence to be sorted starts at
index position low, the parameter cnt is the number
of elements to be sorted.*/
  function bitonicMerge(a, low, cnt, dir) {
    if (cnt > 1) {
      var k = parseInt(cnt / 2);
      for (var i = low; i < low + k; i++) 
      compAndSwap(a, i, i + k, dir);
      bitonicMerge(a, low, k, dir);
      bitonicMerge(a, low + k, k, dir);
    }
  }

  /* This function first produces a bitonic sequence by
recursively sorting its two halves in opposite sorting
orders, and then calls bitonicMerge to make them in
the same order */
  function bitonicSort(a, low, cnt, dir) {
    if (cnt > 1) {
      var k = parseInt(cnt / 2);

      // sort in ascending order since dir here is 1
      bitonicSort(a, low, k, 1);

      // sort in descending order since dir here is 0
      bitonicSort(a, low + k, k, 0);

      // Will merge whole sequence in ascending order
      // since dir=1.
      bitonicMerge(a, low, cnt, dir);
    }
  }

  /*Caller of bitonicSort for sorting the entire array
of length N in ASCENDING order */
  function sort(a, N, up) {
    bitonicSort(a, 0, N, up);
  }
