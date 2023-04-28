import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { db } from "../firebase"
import { AuthContext } from "../context/AuthContext"
import Beep from '../media/Mi Beep Sound.mp3'
import Beep2 from '../media/Beep Countdown - Sound Effect.mp3'

import { Play, Pause, Square } from "react-feather"

interface UserProgramInfos {
    name: string | undefined,
    description: string | undefined,
    time: number,
    image: string | undefined,
    // id: string | undefined
}

const Program: React.FC = () => {

    // const {name} = useParams()
    const { currentUser } = useContext(AuthContext)

    const [userPrograms, setUserPrograms] = useState<UserProgramInfos[]>([])

    console.log(userPrograms)

    const handleFetchAll = async (): Promise<void> => { 
        // const colRef = collection(docRef, `${programmName}`)   
        const querySnapshot = await getDocs(collection(db, `users`, `${currentUser?.uid}`, 'yftytr'));
        // console.log(querySnapshot)
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
                setUserPrograms(poses); 


        // console.log(currentUser?.uid)
        // const docRef = doc(db, 'users', `${currentUser?.uid}`);
        // const docSnap = await getDoc(docRef);


        // if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        // } else {
        // // docSnap.data() will be undefined in this case
        // console.log("No such document!");
        // }
    }

    

    useEffect(() => {
        // getTodoItems()
        handleFetchAll()
    }, [])

    const [timerRun, setTimerRun] = useState<boolean>(false)
    const [start, setStart] = useState<boolean>(false)
    const [count, setCount] = useState<number>(0)
    const [seconds, setSeconds] = useState<number>(0)
    const [endMsg, setEndMsg] = useState<string>('')

    console.log(count)
    console.log(userPrograms?.length -2)

    const alarm = new Audio(Beep);

    const running = () => {
        setTimerRun(true)
        setStart(true)
    }
    const pause = () => {
        setTimerRun(false)
    }

    useEffect(() => {

        var timer : ReturnType<typeof setInterval>;

        if(timerRun){
            timer = setInterval(() => {
                setSeconds(userPrograms[count]?.time)
                if(start === true) {
                    setSeconds(seconds - 1)
                    if(seconds === 1){
                        alarm.play()
                    }
                    if(seconds < 1){
                        if(count <= userPrograms?.length -2){
                            setCount(count+1)
                            setSeconds(userPrograms[count]?.time)
                            
                        } else {
                            setStart(false)
                            setEndMsg('Bravo ! Vous avez terminé !')
                        }
                    }
                } else {
                    setCount(0)
                    setTimerRun(false)
                }
            }, 100)
        }

        return () => {
            clearInterval(timer)
        }
    })

    const stop = () => {
        setSeconds(0)
        setCount(0)
        setStart(false)
    }
    

    return (
        <div className="min-h-[calc(100vh-102px)]">
            <div className="flex flex-col items-center md:pt-28">
                <h1 className="mt-5 font-bold text-3xl text-[#D39E24]">Nom programme</h1>
                {
                    start === true ?
                    <img src={userPrograms[count]?.image} alt='' className="w-36 mt-5" />
                    :
                    <p className="text-[#D4D68B] mt-5 text-xl">{endMsg}</p>
                }
                {
                    start === true ?
                    <div className="mt-5 text-[#D4D68B] text-4xl font-bold">{seconds >= 0 ? seconds : null}</div>
                    : <></>
                }
                <div className="mt-5 flex flex-row w-32 justify-around">
                    {start === true ? <Square size={40} className=" text-[#D4D68B]" onClick={stop}/> : <></>}
                    {
                        timerRun === false 
                        ?
                            <Play size={40} className=" text-[#D4D68B]" onClick={running}/>
                        : 
                            <Pause size={40} className=" text-[#D4D68B]" onClick={pause}/>
                            
                    }
                </div>
            </div>
        </div>
    )
}

export default Program