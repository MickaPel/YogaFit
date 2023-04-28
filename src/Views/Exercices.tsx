import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import LevelFilter from "../Components/LevelFilter"

const Exercices: React.FC = () => {

    const navigate = useNavigate()

    const levels = ['All poses', 'Beginner', 'Intermediate', 'Expert']
    const [poseLevel, setPoseLevel] = useState<string>('')

    const [filteredPoses] = LevelFilter(poseLevel);

    return (
        <div className="min-h-[calc(100vh-102px)]">
            <div className="flex flex-row flex-wrap justify-around m-auto my-6 sm:w-2/3 md:w-3/4 xl:w-1/3 font-bold text-[#243010] text-sm sm:text-base lg:text-lg">
                {levels.map((pose) => {
                    return(
                        <button className="rounded-full border-sm bg-[#D6D194] p-2 mt-2" onClick={() => setPoseLevel(pose)}>{pose}</button>
                    )
                })}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 justify-center gap-3 lg:gap-6 mt-5 lg:mt-20 mx-5 pb-10">
                {filteredPoses?.map((pose) => {
                    return (
                        <div className="flex flex-col items-center" key={pose.id}>
                            <img src={pose.url_png} alt={pose.english_name} className="w-20 lg:w-24" onClick={() => navigate(`/pose/${pose.english_name}`)}/>
                            <h3 className="font-bold text-sm text-[#D6D194] lg:mt-4">{pose.english_name}</h3>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Exercices