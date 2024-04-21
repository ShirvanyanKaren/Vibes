import arrow from "/assets/x-arrow.svg"
import search from "/assets/x-search.svg"
import "react-bubble-ui/dist/index.css"
import BubbleUI from "react-bubble-ui"




const Evolutions = () => {
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
    "#40E0D0"  // Neon Turquoise
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
		gravitation: 5
	}
  var basedata = {
    "1": { name: "Azure", value: 0.748 },
    "2": { name: "Google", value: 0.621 },
    "3": { name: "Amazon", value: 0.893 },
    "4": { name: "IBM", value: 0.429 },
    "5": { name: "Salesforce", value: 0.517 },
    "6": { name: "Oracle", value: 0.673 },
    "7": { name: "Alibaba Cloud", value: 0.814 },
    "8": { name: "Huawei Cloud", value: 0.349 },
    "9": { name: "Tencent Cloud", value: 0.965 },
    "10": { name: "DigitalOcean", value: 0.202 },
    "11": { name: "Rackspace", value: 0.739 },
    "12": { name: "VMware", value: 0.158 },
    "13": { name: "Red Hat", value: 0.876 },
    "14": { name: "Cisco", value: 0.495 },
    "15": { name: "HP", value: 0.371 },
    "16": { name: "Dell", value: 0.724 },
    "17": { name: "Lenovo", value: 0.956 },
    "18": { name: "NetApp", value: 0.284 },
    "19": { name: "Juniper Networks", value: 0.632 },
    "20": { name: "Splunk", value: 0.802 },
    "21": { name: "Adobe", value: 0.417 },
    "22": { name: "NVIDIA", value: 0.729 },
    "23": { name: "Intel", value: 0.948 },
    "24": { name: "AMD", value: 0.526 },
    "25": { name: "Qualcomm", value: 0.647 },
    "26": { name: "Micron", value: 0.134 },
    "27": { name: "Western Digital", value: 0.877 },
    "28": { name: "Seagate", value: 0.381 },
    "29": { name: "Samsung", value: 0.925 },
    "30": { name: "Apple", value: 0.285 },
    "31": { name: "Microsoft", value: 0.963 },
    "32": { name: "Facebook", value: 0.541 },
    "33": { name: "Apple", value: 0.709 },
    "34": { name: "Netflix", value: 0.876 },
    "35": { name: "Uber", value: 0.603 },
    "36": { name: "Airbnb", value: 0.498 },
    "37": { name: "Twitter", value: 0.784 },
    "38": { name: "Snap", value: 0.257 },
    "39": { name: "Pinterest", value: 0.671 },
    "40": { name: "LinkedIn", value: 0.863 },
    "41": { name: "Dropbox", value: 0.325 },
    "42": { name: "Slack", value: 0.738 },
    "43": { name: "Zoom", value: 0.948 },
    "44": { name: "TikTok", value: 0.412 },
    "45": { name: "WhatsApp", value: 0.837 },
    "46": { name: "Telegram", value: 0.295 },
    "47": { name: "Signal", value: 0.671 },
    "48": { name: "WeChat", value: 0.972 },
    "49": { name: "Skype", value: 0.576 },
    "50": { name: "Discord", value: 0.318 }
  };
  
	const children = Object.values(basedata).map((data, i) => {

  const bubbleStyle = {
    fontSize: 50 * data.value,
  };

  return <div className="bubble-entry" style={bubbleStyle}>{data.name}</div>;
 });
    return (
      <>
       <div className="evolutions-page-wrapper">
        <div className="spacer">
          
        </div>
        <div className="evolutions-wrapper">
            <div className="evolutions">
            <div className="evolutions-header">
                    <img id="x-arrow" src={arrow}/>
                    <span id="header-title">Evolutions</span>
            </div>
            <BubbleUI options={options} className="bubbleUI">
		            {children}
	          </BubbleUI>
            </div>
            <div className="tool-bar-wrapper">
                <div className="search">
                      <img src={search}/>
                      <span>Search</span>
                </div>
                <div className="tweet-query-container">
                    <div className="tool-bar-heading">
                      <h2>Relevant Posts</h2>
                    </div>
                </div>
                <div className="grok-response-container">
                    <div className="tool-bar-heading">
                      <h2>Insight</h2>
                    </div>
                </div>
            </div>
        
        </div>
       </div>
      </>
    );
  }
  
  export default Evolutions;