import arrow from "/assets/x-arrow.svg"
import search from "/assets/x-search.svg"
const Evolutions = () => {
    return (
      <>
       <div className="evolutions-page-wrapper">
        <div className="spacer"></div>
        <div className="evolutions-wrapper">
            <div className="evolutions">
            <div className="evolutions-header">
                    <img id="x-arrow" src={arrow}/>
                    <span id="header-title">Evolutions</span>
            </div>
          
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