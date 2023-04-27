import { useEffect, useState } from "react"
import { PosesData } from "../interfaces/Poses"
import { useNavigate } from "react-router-dom"
import data from '../data.json'
import LevelFilter from "../Components/LevelFilter"

const Exercices: React.FC = () => {

    const navigate = useNavigate()

    const [dataPoses, setDataPoses] = useState<PosesData[] | null>(null)
    const [dataPosesLevel, setDataPosesLevel] = useState<PosesData[] | null>(null)

    const poses = data

    const levels = ['All poses', 'Beginner', 'Intermediate', 'Expert']
    const [poseLevel, setPoseLevel] = useState<string>('')
    // const [filteredPoses, setFilteredPoses] = useState<PosesData[]>(poses)

    

    // const pose = () => {
    //     if(poseLevel === 'Beginner'){
    //         const filter = poses.filter((p) => p.level === 'Beginner')
    //         setFilteredPoses(filter)
    //     } else if(poseLevel === 'Intermediate'){
    //         const filter = poses.filter((p) => p.level === 'Intermediate')
    //         setFilteredPoses(filter)
    //     } else if(poseLevel === 'Expert'){
    //         const filter = poses.filter((p) => p.level === 'Expert')
    //         setFilteredPoses(filter)
    //     } else if(poseLevel === 'All poses'){
    //         setFilteredPoses(poses)
    //     }
    // }

    // console.log(poseLevel)
    // console.log(filteredPoses)

    useEffect(() => {
        
        const getPoses = async() => {
            const response = await fetch(`https://yoga-api-nzy4.onrender.com/v1/poses`)
            const data : PosesData[] = await response.json()
            setDataPoses(data)
        }

        getPoses()

    }, [])
    
    // useEffect(() => {

    //     // const getPosesLevel = async(level: string) => {
    //     //     const response = await fetch(`https://yoga-api-nzy4.onrender.com/v1/poses?level=${level}`)
    //     //     const data : PosesData[] = await response.json()
    //     //     setDataPosesLevel(data)
    //     // }

    //     // if(poseLevel !== '' && poseLevel !== 'all poses'){
    //     //     getPosesLevel(poseLevel)
    //     // }

    //     pose()

    // }, [poseLevel])

    const [filteredPoses] = LevelFilter(poseLevel);

    return (
        <div className="min-h-[calc(100vh-102px)]">
            <div className="flex flex-row flex-wrap justify-around m-auto my-6 sm:w-2/3 md:w-3/4 xl:w-1/3 font-bold text-[#243010] text-sm sm:text-base lg:text-lg">
                {levels.map((pose) => {
                    return(
                        <div className="rounded-full border-sm bg-[#D6D194] p-2 mt-2" onClick={() => setPoseLevel(pose)}>{pose}</div>
                    )
                })}
            </div>
            {/* {data1 === null 
                ? 
                    <div className="flex items-center justify-center ">
                        <div id="loading"></div>
                    </div>
                :  */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 justify-center gap-3 lg:gap-6 mt-5 lg:mt-20 mx-5 pb-10 min-h-[calc(100vh-102px)]">
                        {filteredPoses?.map((pose) => {
                            return (
                                <div className="flex flex-col items-center" key={pose.id}>
                                    <img src={pose.url_png} alt={pose.english_name} className="w-20 lg:w-36" onClick={() => navigate(`/pose/${pose.english_name}`)}/>
                                    <h3 className="font-bold text-sm text-[#D6D194] lg:mt-4">{pose.english_name}</h3>
                                </div>
                            )
                        })}
                    </div>
            {/* } */}
            {/* {dataPosesLevel === null 
                ? 
                    <div className="flex items-center justify-center min-h-[calc(100vh-102px)]">
                        <div id="loading"></div>
                    </div>
                : 
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 justify-center gap-3 lg:gap-6 mt-5 lg:mt-20 mx-5 pb-10 min-h-[calc(100vh-102px)]">
                        {dataPosesLevel?.map((pose) => {
                            return (
                                <div className="flex flex-col items-center">
                                    <img src={pose.url_png} alt={pose.english_name} className="w-20 lg:w-36" onClick={() => navigate(`/pose/${pose.english_name}`)}/>
                                    <h3 className="font-bold text-sm text-[#D6D194] lg:mt-4">{pose.english_name}</h3>
                                </div>
                            )
                        })}
            </div>
            } */}
        </div>
    )
}

export default Exercices