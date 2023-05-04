import { useEffect, useState } from 'react'
import data from '../data.json'
import { PosesData } from '../interfaces/Poses'

const LevelFilter = (poseLevel: string) => {

    const poses = data
    const [filteredPoses, setFilteredPoses] = useState<PosesData[]>(poses)

    const pose = () => {
        if(poseLevel === 'Beginner'){
            const filter = poses.filter((p) => p.level === 'Beginner')
            setFilteredPoses(filter)
        } else if(poseLevel === 'Intermediate'){
            const filter = poses.filter((p) => p.level === 'Intermediate')
            setFilteredPoses(filter)
        } else if(poseLevel === 'Expert'){
            const filter = poses.filter((p) => p.level === 'Expert')
            setFilteredPoses(filter)
        } else if(poseLevel === 'All poses'){
            setFilteredPoses(poses)
        }
    }

    useEffect(() => {
        pose()
    }, [poseLevel])

    return [filteredPoses]
}

export default LevelFilter