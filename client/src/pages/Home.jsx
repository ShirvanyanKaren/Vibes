import logo from "/assets/x-twitter.svg"
import ParticleSystem from "../components/ParticleSystem"
const Home = () => {
  return (
    <>
    <div className="intro-wrapper">
      <div className="intro">
          <div style={{dispaly:"flex"}}>
            <img  src={logo} alt="" height={50}/>
            <h2>Evolutions</h2>
            </div>
          <h1 style={{fontFamily:"TwitterChirpExtendedHeavy", fontSize:"50px"}}>Seek <br/> Self-Discovery</h1>
          <button>
            <div >
              <a className="sign-text" href="http://127.0.0.1:5000/">Sign In</a>
            </div>
          </button>
      </div>
    
    </div>
      <ParticleSystem/>
    </>
  );
}

export default Home;