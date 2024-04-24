import logo from "/assets/x-logo.svg"
import ParticleSystem from "../components/ParticleSystem"
const Home = () => {


  return (
    <>
    <div className="intro-wrapper">
      <div className="intro">
          <div>
            <img  src={logo} alt="" height={50}/>
            <h2>Evolutions</h2>
            </div>
          <h1 style={{fontFamily:"TwitterChirpExtendedHeavy", fontSize:"50px"}}>Seek <br/> Self-Discovery</h1>
          <button>
            <div onClick={()=>{window.location.assign("http://localhost:8000/start")}}>
              Sign In
            </div>
          </button>
      </div>
    
    </div>
      <ParticleSystem/>
    </>
  );
}

export default Home;