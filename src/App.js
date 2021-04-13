import React , {useState,useRef} from 'react'
import Player from './components/Player'
import Song from './components/Songs'
import './styles/app.scss'
import data from './data'
import Library from './components/Library'
import Nav from './components/Nav'


function App() {
  const [libraryStatus, setLibraryStatus] = useState(false)
  const [songs, setSongs] = useState(data())
  const [currentSong, setCurrentSong] = useState(songs[0])
  const [isPlaying,setPlaying] = useState(false)
  const audioRef = useRef(null)
  const [songInfo,setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage:0,
})

const timeUpdateHandler = (e) => {
  const current = e.target.currentTime;
  const duration = e.target.duration;
  //cal per
  const roundedCurrent= Math.round(current)
  const roundedDuration= Math.round(duration)
  const animation = Math.round((roundedCurrent / roundedDuration) * 100)
  setSongInfo({...songInfo,currentTime: current, duration, animationPercentage: animation,})

}

const songEndHAndler = async () => {
  let currentIndex = songs.findIndex((song) => song.id === currentSong.id)
    await  setCurrentSong(songs[(currentIndex + 1) % songs.length])
    if(isPlaying) audioRef.current.play()
}
  return (
    <div className={`App ${libraryStatus ? 'library-active':''}`}>

        <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus} />
        <Song currentSong={currentSong} />
        <Player setSongs={setSongs} setCurrentSong={setCurrentSong} songs={songs} currentSong={currentSong} audioRef={audioRef} isPlaying={isPlaying} setPlaying={setPlaying} setSongInfo={setSongInfo} songInfo={songInfo}/>
        <Library libraryStatus={libraryStatus} setSongs={setSongs} songs={songs} isPlaying={isPlaying} setCurrentSong={setCurrentSong} audioRef={audioRef} />
        <audio  onTimeUpdate={timeUpdateHandler} ref={audioRef}  src={currentSong.audio} onLoadedMetadata={timeUpdateHandler} onEnded={songEndHAndler} ></audio>
    </div>
  );
}

export default App;
