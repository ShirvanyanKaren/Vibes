import arrow from "/assets/x-arrow.svg";
import * as React from "react";
import search from "/assets/x-search.svg";
import "react-bubble-ui/dist/index.css";
import BubbleUI from "react-bubble-ui";
import { json, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserPage, askGronk } from "../utils/helpers/functions";
import jwtDecode from "jwt-decode";
import HtmlTooltip from "../components/ToolTip";
import ToolTip from "../components/ToolTip";
import Typography from "@mui/material/Typography";



const Evolutions = (props) => {
  const [searchParams] = useSearchParams();

  const [userPage, setUserPage] = useState({});
  const [baseData, setData] = useState({});
  const [children, setChildren] = useState([]);
  const [bubbleStyle, setBubbleStyle] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [gronkLoaded, setGronkLoaded] = useState(false);
  const [gronkResponse, setGronkResponse] = useState({});

  useEffect(() => {
    let token = localStorage.getItem("token");
    getUserPage(token).then((data) => {
      setUserPage(data);
    });
    console.log("user page", userPage);

    let tempData = {};
    for (let i = 0; i < userPage.length; i++) {
      let id = userPage[i].id.toString();
      tempData[id] = {};
      tempData[id]["name"] = userPage[i].name;
      tempData[id]["value"] =
        userPage[i].count / 14
          ? userPage[i].count / 12 > 0.15
          : userPage[i].count / 12;

      console.log("tempData", tempData);
    }
    setData(tempData);

    const getGronkData = async (data) => {
      setGronkLoaded(false);

      console.log("data", data);

      let gronkResponseData = {
        keyword: data,
      };
      console.log(typeof gronkResponseData);
      data = JSON.stringify(gronkResponseData);
      console.log("data", gronkResponseData, typeof gronkResponseData);
      let response = await askGronk(data);
      console.log("response", response);
      setGronkResponse(response);
      setGronkLoaded(true);
      console.log("gronk response", gronkResponse);

    };




    setChildren(
      Object.values(tempData).map((data, i) => {
        const bubbleStyle = {
          fontSize: 50 * data.value,
        };
        return (
          <div className="bubble-entry" style={bubbleStyle}>
            <HtmlTooltip
              props={data}
              title={
                <React.Fragment>
                  <Typography
                    // style={{ color: 'white', fontSize: '24px' }}
                    color="inherit"
                  >
                    <a 
                    onClick={() => getGronkData(data.name)}
                    className="fw-italic fs-12 bubble-text text-light text-decoration-none">{`Ask Grok To Get Insights on ${data.name}?`}
            
                    </a>
                  </Typography>

                  <em
                    style={{ color: "white" }}
                    className="tool-tip"
                    dangerouslySetInnerHTML={{ __html: `` }}
                  />
                </React.Fragment>
              }
            >
              <li className="list-group-item">
                <p className="bubble-text">{data.name}</p>
              </li>
            </HtmlTooltip>
          </div>
        );
      })
    );
    setIsLoaded(true);
  }, [isLoaded]);

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
    gravitation: 5,
  };

  return (
    <>
      <div className="evolutions-page-wrapper">
        <div className="spacer"></div>
        <div className="evolutions-wrapper">
          <div className="evolutions">
            <div className="evolutions-header">
              <img id="x-arrow" src={arrow} />
              <span id="header-title">Evolutions</span>
            </div>
            <BubbleUI options={options} className="bubbleUI">
              {isLoaded ? children : <></>}
            </BubbleUI>
          </div>
          <div className="tool-bar-wrapper">
            <div className="search">
              <img src={search} />
              <span>Search</span>
            </div>
            <div className="tweet-query-container">
              <div className="tool-bar-heading">
                <h2>Relevant Posts</h2>
              </div>
            </div>
            <div className="grok-response-container">
            <div className="tool-bar-heading text-center">
                <h2>Get Insights</h2>
                {gronkLoaded ? (
                  <div>
                    {/* Text class for smaller text size and paragraph formatting */}
                    <p className=" fs-6 mt-4">{gronkResponse.summary}</p>
                  </div>
                ) : null}
                {/* Input field with Bootstrap classes for styling */}
                <input className="form-control grok-input"
                placeholder="Type here..." />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Evolutions;
