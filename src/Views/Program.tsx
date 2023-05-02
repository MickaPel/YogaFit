import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { db } from "../firebase"
import { AuthContext } from "../context/AuthContext"
import Beep from '../media/yogaBeep.mp3'
import Beep2 from '../media/Beep Countdown - Sound Effect.mp3'
import StartBeep from '../media/one_beep.mp3'

import { Play, Pause, Square } from "react-feather"

interface UserProgramInfos {
    name: string | undefined,
    description: string | undefined,
    time: number,
    image: string | undefined,
}

const Program: React.FC = () => {

    const {name} = useParams()
    const { currentUser } = useContext(AuthContext)

    const [userProgram, setUserProgram] = useState<UserProgramInfos[]>([])

    const getProgram = async (): Promise<void> => {  
        const querySnapshot = await getDocs(collection(db, `users`, `${currentUser?.uid}`, `${name}`));
        const poses = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return { 
                    name: data.name, 
                    description: data.description, 
                    time: data.time, 
                    image: data.image,
                    id: doc.id,
                    }
                }); 
                setUserProgram(poses);
    }

    useEffect(() => {
        // getTodoItems()
        getProgram()
        
    }, [])

    const [timerRun, setTimerRun] = useState<boolean>(false)
    const [beforeStart, setBeforeStart] = useState<boolean>(false)
    const [beforeStartCount, setBeforeStartCount] = useState<number>(5)
    const [start, setStart] = useState<boolean>(false)
    const [count, setCount] = useState<number>(0)
    const [seconds, setSeconds] = useState<number>(0)
    const [endMsg, setEndMsg] = useState<string>('')

    const alarm = new Audio(Beep);
    const alarm2 = new Audio(StartBeep);

    const running = () => {
        
        // setTimerRun(true)
        setBeforeStart(true)
        setTimeout(() => {
            setBeforeStart(false)
            setStart(true)
            setBeforeStartCount(5)
            alarm.play()
        }, 5000);
    }
    // const pause = () => {
    //     setTimerRun(false)
    // }
    const stop = () => {
        setSeconds(0)
        setCount(0)
        setStart(false)
    }

    var timer : ReturnType<typeof setInterval>;
    var timer2 : ReturnType<typeof setInterval>;

    const beforeStartTimer = () => {
    
        if(beforeStart){
            timer = setInterval(() => {
                if(beforeStartCount > 0){
                    setBeforeStartCount(beforeStartCount -1)
                }
                if(beforeStartCount > 1){
                    alarm2.play()
                } else if(beforeStartCount < 1){
                    alarm.play()
                }
                console.log(beforeStartCount)
            }, 1000)
        }
    }

    const programTimer = () => {
    
        // if(timerRun){
            timer2 = setInterval(() => {
                
                setSeconds(userProgram[count]?.time)
                if(start === true) {
                    setSeconds(seconds - 1)
                    if(seconds === 1){
                        alarm.play()
                    }
                    if(seconds < 1){
                        if(count < userProgram?.length -1){
                            setCount(count+1)
                            setSeconds(userProgram[count]?.time)
                            
                        } else {
                            setStart(false)
                            setEndMsg('Bravo ! Vous avez terminé !')
                            setTimeout(() => {
                                setEndMsg('')
                            }, 3000);
                        }
                    }
                } else {
                    setCount(0)
                    setTimerRun(false)
                }
            }, 1000)
        // }
    }

    useEffect(() => {
        
        beforeStartTimer()
        programTimer()

        return () => {
            clearInterval(timer)
            clearInterval(timer2)
        }
    })

    return (
        <div className="min-h-[calc(100vh-102px)]">
            <div className="flex flex-col items-center md:pt-24">
                <h1 className="mt-5 font-bold text-3xl text-[#D39E24]">{name}</h1>
                    <div className="flex flex-col items-center text-[#D4D68B] text-xl"> 
                        <img src={userProgram[count]?.image} alt='' className="w-36 mt-5 md:mt-8" />
                        <p className="mt-4 text-center">{userProgram[count]?.name}</p>
                        <p className="mt-4 w-80 text-center text-sm xl:text-base">{userProgram[count]?.description}</p>
                    </div>
                    {endMsg !== '' ? <p className="text-[#D4D68B] mt-5 text-xl">{endMsg}</p> : <></>}
                    {
                        beforeStart === true 
                        ?   <div className="mt-5 text-[#D4D68B] text-4xl font-bold">{beforeStartCount >= 0 ? beforeStartCount : null}</div>
                        :   <></>
                    }
                    {
                        start === true 
                        ?   <div>
                                <div className="mt-5 text-[#D4D68B] text-4xl font-bold">{seconds >= 0 ? seconds : null}</div>
                            </div>
                        :   <></>
                    }
                    <div className="mt-5 flex flex-row w-32 justify-around">
                        {start === true ? <Square size={40} className=" text-[#D4D68B]" onClick={stop}/> : <Play size={40} className=" text-[#D4D68B]" onClick={running}/>}
                        {/* {
                            timerRun === false 
                            ?   <Play size={40} className=" text-[#D4D68B]" onClick={running}/>
                            :   <Pause size={40} className=" text-[#D4D68B]" onClick={pause}/>
                        } */}
                    </div>
            </div>
        </div>
    )
}

export default Program