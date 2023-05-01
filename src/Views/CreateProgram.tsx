import { useContext, useEffect, useState } from "react"
import { PosesData } from "../interfaces/Poses"
import data from '../data.json'
import LevelFilter from "../Components/LevelFilter"
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, where } from "firebase/firestore"
import { AuthContext } from "../context/AuthContext"
import { db } from "../firebase"

interface PoseInfos {
    name: string | undefined,
    description: string | undefined,
    time: number | undefined,
    image: string | undefined,
}
interface UserProgramInfos {
    name: string | undefined,
    description: string | undefined,
    time: number | undefined,
    image: string | undefined,
    // id: string | undefined
}

const CreateProgram: React.FC = () => {

    const periods = [
        {time:'30s', seconds:30},
        {time:'1m', seconds:60},
        {time:'1m30s', seconds:90},
        {time:'2m', seconds:120},
        {time:'2m30s', seconds:150},
        {time:'3m', seconds:180},
        {time:'3m30s', seconds:210},
        {time:'4m', seconds:240},
        {time:'4m30s', seconds:270},
        {time:'5m', seconds:300},
    ]

    const [newProgram, setNewProgram] = useState<boolean>(true)
    const levels = ['All poses', 'Beginner', 'Intermediate', 'Expert']
    const [poseLevel, setPoseLevel] = useState<string>('')
    const [filteredPoses] = LevelFilter(poseLevel);
    const [programm, setProgramm] = useState<PoseInfos[]>([])
    const [programmName, setProgrammName] = useState<string>('')
    const [pose, setPose] = useState<PosesData | null>(null)
    const [time, setTime] = useState<number>()
    const [errorPose, setErrorPose] = useState<boolean>(false)
    const [errorName, setErrorName] = useState<boolean>(false)
    const [errorProgram, setErrorProgram] = useState<boolean>(false)
    const [message, setMessage] = useState<boolean>(false)
    const [userPrograms, setUserPrograms] = useState<UserProgramInfos[]>([])

    // console.log(userPrograms)

    const addExercice = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        if(pose){
            const onePoseObject = pose
            const poseTime = {poseTime: time}
            const poseDetails = {
                name: onePoseObject?.english_name,
                description: onePoseObject?.pose_description,
                image: onePoseObject?.url_png,
                time: poseTime?.poseTime ? poseTime?.poseTime : 30
            }
            console.log(onePoseObject)
            console.log(poseTime)
            console.log(poseDetails)
            setProgramm(programm => [...programm, poseDetails])
            setPose(null)
            setErrorPose(false)
        } else {
            setErrorPose(true)
        }
        
    }
    
    const resetProgram = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        setProgramm([])
    }

    const { currentUser } = useContext(AuthContext)
    const docRef = doc(db, `${currentUser?.uid}`, 'programms');
    
    const addProgramm = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        if(programmName !== '' && programm.length !== 0) {
            try {
                programm.forEach(async(p) => {
                    // const colRef = collection(docRef, `${programmName}`)
                    await addDoc(collection(db, 'users', `${currentUser?.uid}`, `${programmName}`
                    // , `${currentUser?.uid}`, `${programmName}`
                    ), {
                        // pose: {name: p?.name, description: p?.description, time: p?.time, image: p?.image }
                        name: p?.name,
                        description: p?.description, 
                        time: p?.time, 
                        image: p?.image 
                    });
                })
                await addDoc(collection(db, 'users', `${currentUser?.uid}`, `Program Names`
                    // , `${currentUser?.uid}`, `${programmName}`
                    ), {
                        // pose: {name: p?.name, description: p?.description, time: p?.time, image: p?.image }
                        name: programmName
                })
                setMessage(true)
                setErrorName(false)
                setErrorProgram(false)
                setTimeout(() => {
                    setMessage(false)
                }, 2000);
                setTimeout(() => {
                    setNewProgram(true)
                }, 2500);
                setProgramm([])
                
            } catch (e) {
                console.error("Error adding document: ", e);
            }
            
        } 
        if(programmName === ''){
            setErrorName(true)
        }
        if(programm.length === 0){
            setErrorProgram(true)
        }
    }

    useEffect(() => {
        
        if(programm.length !== 0){
            setErrorProgram(false)
        }
    
    }, [programm])

    // const getAllFav = async () => {
    //     await getDocs(collection(db, `${currentUser?.uid}`, 'programs', 'movies'))
    //         .then((querySnapshot) => {
    //             const newData = querySnapshot.docs
    //                 .map((doc) => ({ ...doc.data(), id: doc.id }));
    //             setUserPrograms(newData);
    //         })
    // }


    // const docRef1 = collection(db,`${currentUser?.uid}`);
    const docRef1 = doc(db, 'users', `${currentUser?.uid}`);
    const colRef = collection(docRef, "aaa")


    //get one program by name
    const handleFetchAll = async (): Promise<void> => { 
        // const colRef = collection(docRef, `${programmName}`)   
        const querySnapshot = await getDocs(collection(db, `users`, `${currentUser?.uid}`, 'pr1'));
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
        const docRef = doc(db, 'users', `${currentUser?.uid}`);
        const docSnap = await getDoc(docRef);


        // if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        // } else {
        // // docSnap.data() will be undefined in this case
        // console.log("No such document!");
        // }
    }

    const getTodoItems = async () => {
        try {
            if (currentUser !== null) {
                const userId = currentUser.uid;
                const q = query(collection(db, `users`, `${currentUser?.uid}`, 'aaaa'));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    setUserPrograms((prev) => [
                        ...prev,
                        {
                            name: data.name, 
                            description: data.description, 
                            time: data.time, 
                            image: data.image,
                            id: doc.id,
                        },
                    ]);
                });
            }
        } catch (error) {
            alert(error);
        }
    };

    useEffect(() => {
        // getTodoItems()
        handleFetchAll()
    }, [])
    

    

    return (
        <div className="min-h-[calc(100vh-102px)] flex flex-col items-center">
            {
                newProgram ?
                    <div>
                        <button onClick={() => setNewProgram(false)} className='py-1 px-2 sm:px-4 shadow-md shadow-stone-950/50 mt-10 sm:mt-10 rounded-md text-base sm:text-lg text-[#FFFC97] font-semibold border-2 border-[#FFFC97] hover:text-white hover:border-white hover:shadow-slate-200/50'>Create a new Programm</button>
                        <div className="flex flex-col items-center mt-10">
                            <p className="text-[#FFFC97] text-lg lg:text-xl font-bold underline decoration-2 underline-offset-4">My Programs</p>
                        </div>
                    </div>
                :
                    <div className="w-5/6 mb-10">
                        <form
                        className="text-[#FFFC97] flex flex-col items-center "
                        // onSubmit={handleSubmit(onSubmit)}
                        >
                            {/* <label className="mt-5 mb-5 ml-2 text-base sm:text-lg opacity-98">Pseudo : </label> */}
                            
                            <div className="mt-5 text-center text-lg lg:text-xl font-bold">Chose an exercise :</div>
                            <div className="mt-5 text-center text-base font-bold">Difficult :</div>
                            <select onChange={(e) => setPoseLevel(e.target.value)} className="mt-3 rounded-xl bg-[#8C9562] border-2 border-[#243010] outline-[#243010] placeholder:text-[#D4D68c] text-[#243010] pl-2 opacity-75 focus:opacity-100 h-10 w-60">
                                {levels.map((t, id) => {
                                    return(
                                        <option key={id} value={t}>{t}</option>
                                    )
                                })}
                            </select>
                            {/* {data === null 
                                ? 
                                    <div className="flex items-center justify-center">
                                        <div id="loading"></div>
                                    </div>
                                : 
                                    <div className="grid grid-cols-4 md:grid-cols-6 justify-center gap-3 lg:gap-6 mt-5 lg:mt-20 mx-5">
                                        {data?.slice(0, 24).map((pose) => {
                                            return (
                                                <div className="flex flex-col items-center" key={pose.id}>
                                                    <img src={pose.img_url} alt={pose.english_name} className="w-20 lg:w-28"/>
                                                    <h3 className="font-bold text-xs md:text-sm text-[#D6D194] lg:mt-4">{pose.english_name}</h3>
                                                </div>
                                            )
                                        })}
                            </div>
                            } */}
                            {pose === null
                                ? 
                                    <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 justify-center gap-3 lg:gap-6 mt-5 lg:mt-20 mx-5 max-h-80 md:max-h-full	 overflow-y-auto">
                                        {filteredPoses?.map((pose) => {
                                            return (
                                                <div className="flex flex-col items-center" key={pose.id} onClick={() => setPose(pose)}>
                                                    <img src={pose.url_png} alt={pose.english_name} className="w-20 lg:w-28"/>
                                                    <h3 className="font-bold text-xs md:text-sm text-[#D6D194] lg:mt-4">{pose.english_name}</h3>
                                                </div>
                                            )
                                        })}
                                    </div>
                                : 
                                    
                                    <div className="flex flex-col items-center justify-center mt-5">
                                        <img src={pose?.url_png} alt={pose?.english_name} className="w-20 lg:w-28"/>
                                        <h3 className="font-bold text-sm text-[#D6D194] mt-1 lg:mt-4">{pose?.english_name}</h3>
                                    </div>
                            }
                            <div className="mt-5 text-center text-base font-bold">Time :</div>
                            <select onChange={(e) => setTime(+e.target.value)} defaultValue={30} className="mt-3 rounded-xl bg-[#8C9562] border-2 border-[#243010] outline-[#243010] placeholder:text-[#D4D68c] text-[#243010] pl-2 opacity-75 focus:opacity-100 w-60 h-10">
                                {periods.map((t, id) => {
                                    return(
                                        <option key={id} value={t.seconds}>{t.time}</option>
                                    )
                                })}
                            </select>
                            <div className="flex flex-row w-64 justify-around mt-2">
                                <button onClick={(e) => resetProgram(e)} className='py-1 px-2 sm:px-4 shadow-md shadow-stone-950/50 mt-5 sm:mt-10 rounded-md text-base sm:text-lg text-[#FFFC97]  font-semibold border-2 border-[#FFFC97]  hover:text-white hover:border-white hover:shadow-slate-200/50'>Reset</button>
                                <button onClick={(e) => addExercice(e)} className='py-1 px-2 sm:px-4 shadow-md shadow-stone-950/50 mt-5 sm:mt-10 rounded-md text-base sm:text-lg text-[#FFFC97]  font-semibold border-2 border-[#FFFC97]  hover:text-white hover:border-white hover:shadow-slate-200/50'>Add exercise</button>
                            </div>
                            {errorPose ? <p className="fade-in text-red-800 text-center mt-5">You need to chose a name for the program !</p> : <></>}
                            {
                                programm?.length > 0 ?
                                <div className="flex flex-col items-center mt-4">
                                    <p className='underline'>Programm preview :</p>
                                    <ul>
                                    {programm.map((p) => {
                                        return(
                                            <li className="flex flex-row items-center mt-4">
                                                <img src={p.image} alt={p.name} className="w-10" />
                                                <p className="ml-4">{p.name}</p>
                                            </li>
                                        )
                                    })}
                                    </ul>
                                </div>
                                : <></>
                            }
                            
                            <div className="mt-5 text-center text-base lg:text-lg font-bold">Create a name for the program :</div>
                            <input onChange={(e) => setProgrammName(e.target.value)} className="rounded-xl bg-[#8C9562] border-2 border-[#243010] outline-[#243010] placeholder:text-[#D4D68c] text-[#243010] pl-2 opacity-75 focus:opacity-100 w-64 sm:w-72 md:w-96 xl:w-1/4 h-10 mt-3" placeholder={`Name`}/>
                            {errorName ? <p className="fade-in text-red-800 text-center mt-5">You need to chose a name for the program !</p> : <></>}
                            {errorProgram ? <p className="fade-in text-red-800 text-center mt-5">You need to add exercises to program !</p> : <></>}
                            <button onClick={(e) => addProgramm(e)} className='py-1 px-2 sm:px-4 shadow-md shadow-stone-950/50 mt-10 sm:mt-10 rounded-md text-base sm:text-lg text-[#FFFC97]  font-semibold border-2 border-[#FFFC97]  hover:text-white hover:border-white hover:shadow-slate-200/50'>Create Programm</button>
                            {message ? <p className="fade-in text-[#FFFC97] text-center mt-5">The program was created !</p> : <></>}
                        </form>
                    </div>
            }
            
        </div>
    )
}

export default CreateProgram
