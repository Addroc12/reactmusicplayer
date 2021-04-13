import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlay, faAngleLeft, faAngleRight, faPause } from "@fortawesome/free-solid-svg-icons"
const Player = ({ setSongs, setCurrentSong, songs, currentSong, isPlaying, setPlaying, audioRef, setSongInfo, songInfo }) => {



    const activeLibraryHandler = (nextPrev) => {
        const newSongs = songs.map((song) => {
            if (song.id === nextPrev.id) {
                return {
                    ...song,
                    active: true,
                }
            } else {
                return {
                    ...song,
                    active: false,
                }
            }
        })
        setSongs(newSongs)
    }


    const playSongHandler = () => {
        if (isPlaying) {
            audioRef.current.pause()
            setPlaying(!isPlaying)
        } else {
            audioRef.current.play()
            setPlaying(!isPlaying)

        }
    }



    const getTime = (time) => {
        return (
            Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
        )
    }
    const dragHandler = (e) => {
        audioRef.current.currentTime = e.target.value
        setSongInfo({ ...songInfo, currentTime: e.target.value })
    }
    const skipTrackhandler = async (direction) => {
        let currentIndex = songs.findIndex((song) => song.id === currentSong.id)
        if (direction === 'skip-forward') {
            await setCurrentSong(songs[(currentIndex + 1) % songs.length])
            activeLibraryHandler(songs[(currentIndex + 1) % songs.length])
        }
        if (direction === 'skip-back') {
            if ((currentIndex - 1) % songs.length === -1) {
                await setCurrentSong(songs[songs.length - 1])
                activeLibraryHandler(songs[songs.length - 1])
                if (isPlaying) audioRef.current.play()
                return
            }
            await setCurrentSong(songs[(currentIndex - 1) % songs.length])
            activeLibraryHandler(songs[(currentIndex - 1) % songs.length])
        }
        if (isPlaying) audioRef.current.play()
    }
    // add style 
    const trackAnim = {
        transform: `translateX(${songInfo.animationPercentage}%)`
    }
    return (
        <div className="player">
            <div className="time-control">
                <p>{getTime(songInfo.currentTime)}</p>
                <div style={{ background: `linear-gradient(to right, ${currentSong.color[0]},${currentSong.color[1]} )` }} className="track"> <input min={0} max={songInfo.duration || 0} value={songInfo.currentTime} onChange={dragHandler} type="range" />
                    <div style={trackAnim} className="animate-track"> </div>
                </div>
                <p>{songInfo.duration ? getTime(songInfo.duration) : '0:00'}</p>
            </div>
            <div className="play-control">
                <FontAwesomeIcon className="skip-back" size="2x" onClick={() => skipTrackhandler('skip-back')} icon={faAngleLeft} />
                <FontAwesomeIcon className="play" size="2x" icon={isPlaying ? faPause : faPlay} onClick={playSongHandler} />
                <FontAwesomeIcon className="skip-forward" size="2x" onClick={() => skipTrackhandler('skip-forward')} icon={faAngleRight} />
            </div>

        </div>
    )
}

export default Player