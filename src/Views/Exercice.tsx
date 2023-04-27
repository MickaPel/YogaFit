import { useEffect, useState } from "react"
import { Pose } from "../interfaces/Pose"
import { Heart } from "react-feather"
import { useParams } from "react-router-dom"
import data from '../data.json'

const Exercice: React.FC = () => {

    const {name} = useParams()

    const [dataPose, setDataPose] = useState<Pose | null>(null)

    const pose = data.filter((p) => p.english_name === name)

    console.log(pose)

    useEffect(() => {
        const getPose = async() => {
            const response = await fetch(`https://yoga-api-nzy4.onrender.com/v1/poses?name=${name}`)
            const data : Pose = await response.json()
            setDataPose(data)
        }
        getPose()
    }, [])

    return (
        <div>
            {pose === null 
                ? 
                    <div className="flex items-center justify-center min-h-[calc(100vh-102px)]">
                        <div id="loading"></div>
                    </div>
                : 
                <div className="flex flex-col xl:flex-row items-center xl:items-start my-10 xl:pt-24 min-h-[calc(100vh-102px)]">
                    <div className="xl:basis-1/3 relative">
                        <img src={pose[0]?.url_png} alt={pose[0]?.english_name} className="mr-2"/>
                        {/* <button
                            // onClick={() => { toggleModalSuppressionFavori(); setSelectedItem(fav) }}
                            className="absolute right-5 top-5 cursor-pointer">
                            <Heart color="white" size={40} className="hidden xl:block"/>
                        </button>
                        <Heart color="white" size={40} className="xl:hidden m-auto mt-10"/> */}
                    </div>
                    <div className="text-center mx-3 xl:basis-2/3">
                        <h1 className="mt-5 font-bold text-3xl text-[#D39E24]">{pose[0]?.english_name}</h1>
                        <h2 className="mt-5 font-bold text-xl text-[#C9A95D]">{pose[0]?.level}</h2>
                        <h2 className="mt-5 font-bold text-xl text-[#C9A95D] underline">Description</h2>
                        <p className="mt-5 text-[#ECE9AA]">{pose[0]?.pose_description}</p>
                        <h2 className="mt-5 font-bold text-xl text-[#C9A95D] underline">Benefits</h2>
                        <p className="mt-5 text-[#ECE9AA]">{pose[0]?.pose_benefits}</p>
                        <h3 className="mt-5 font-bold text-xl text-[#C9A95D] underline">Sanscrit Name</h3>
                        <p className="mt-5 text-[#ECE9AA]">{pose[0]?.sanskrit_name}</p>
                        <h3 className="mt-5 font-bold text-xl text-[#C9A95D] underline">Translation</h3>
                        <p className="mt-5 text-[#ECE9AA]">{pose[0]?.translation_name}</p>
                    </div>
                </div>
            }
        </div>
    )
}

export default Exercice