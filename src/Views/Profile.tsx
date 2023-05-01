import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { collection, getDocs } from "firebase/firestore"
import { auth, db } from "../firebase"

interface UserProgramInfos {
  name: string | undefined | any,
  description: string | undefined | any,
  time: number | undefined | any,
  image: string | undefined | any,
  // poses: [
  //   name: string | undefined,
  //   description: string | undefined,
  //   time: number | undefined,
  //   image: string | undefined,
  // ]
  id: string | undefined
}
interface UserProgramInfos2 {
  name: string,
  // id: string | undefined,
  poses: {
    name?: string;
    description?: string;
    time?: string;
    image?: string;
    id?: string;
  }[]
}
interface UserProgramNames {
  name: string,
  id: string
}

const Profile = () => {

  const { currentUser, signOut, deleteUser } = useContext(AuthContext)

  // const [userProgram, setUserProgram] = useState<UserProgramInfos[]>([])
  const [userPrograms, setUserPrograms] = useState
    <UserProgramInfos2[] 
    //   | 
    // { name: string,
    //   id: string | undefined,
    //   poses: {
    //     name: string | undefined,
    //     description: string | undefined,
    //     time: number | undefined,
    //     image: string | undefined,
    //     id: string | undefined
    //   }
    // } 
    >([])
    
  

  const [names, setNames] = useState<UserProgramNames[]>([])

  // console.log(names)
  
  // console.log(userPrograms[0].name === 'pr1')
  // userPrograms.filter((item: UserProgramInfos2) => console.log(item.name !== 'pr1') )


  const handleFetchAll = async () => { 
    // const colRef = collection(docRef, `${programmName}`)   
    
    const querySnapshot2 = await getDocs(collection(db, `users`, `${currentUser?.uid}`, 'Program Names'));
    // console.log(querySnapshot)
    const names = querySnapshot2.docs.map((doc) => {
        const data = doc.data();
        return { 
                name: data.name, 
                id: doc.id,
                }
            }); 
            setNames(names); 

    // const test: 
    // UserProgramInfos2[] = []

    

  

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


  const test = () => {
    names.forEach(async(n) => {
      const querySnapshot = await getDocs(collection(db, `users`, `${currentUser?.uid}`, `${n.name}`));
      // console.log(querySnapshot)
      const poses 
      // : 
      // {name: string | undefined, id: string | undefined, description: string | undefined, time: number | undefined, image: string | undefined,} 
      // UserProgramInfos[]
      = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return { 
                name: data.name, 
                description: data.description, 
                time: data.time, 
                image: data.image,
                id: doc.id,
                }
            }); 
            // console.log(poses)
            // setUserPrograms(poses)
            // setUserPrograms([...userPrograms, {name: n.name, poses} ]);
            // userPrograms.push(poses)
            // if(userPrograms.filter((item: UserProgramInfos2) => item?.name !== n?.name)){
              // setUserPrograms([...userPrograms,]); 
              // console.log('test' + userPrograms)
              // setUserPrograms([...userPrograms, {name: n.name, poses}]); 
              
              // test.push({name: n.name, poses})
              // console.log(n)
              const filter = userPrograms.filter((par) => par.name === n.name)
              if(filter.length === 0){
                
                setUserPrograms([...userPrograms, {name: n.name, poses}])
              }
              
              // console.log('test',test)
              
            // }
            
            // setUserPrograms([...poses]); 
    })
  }

  useEffect(() => {
    handleFetchAll()

}, [])

  useEffect(() => {
    
    if(names.length !== 0){
      console.log('names', names)
      test()
      
    }
    console.log('useeffect',userPrograms)
}, [names, userPrograms])

  return(
      <div className="h-[calc(100vh-102px)] flex flex-col md:flex-row xl:pt-10">
          <div className="flex flex-row md:flex-col justify-center md:justify-start pt-8 text-[#C9A95D] font-bold md:basis-1/3">
            <div className="w-full">
              <img 
                src='https://media-mcetv.ouest-france.fr/wp-content/uploads/2014/10/Voir-et-revoir-Il-%C3%A9tait-une-voix-avec-la-voix-fran%C3%A7aise-de-laffreux-Eric-Cartman-dans-South-Park.jpg' 
                alt='profile' 
                className="rounded-full border-4 w-28 h-28 m-auto"
              />
            </div>
            <div className="flex flex-col w-full justify-between items-start md:items-center md:mt-6">
              <div>
                <h2>{currentUser?.displayName}</h2>
                <h4>{currentUser?.email}</h4>
              </div>
              <div className="flex flex-row items-center justify-center md:mt-10">
                <button className="text-[#D39E24] px-2 border-rose-500 hover:bg-red-400 hover:bg-opacity-50 hover:rounded hover:text-[#423411]" onClick={signOut}>Logout</button>
                {/* <button className="text-[#D39E24] px-2 border-rose-500 hover:bg-red-400 hover:bg-opacity-50 hover:rounded hover:text-[#423411]" onClick={() => deleteUser(currentUser)}>Unsubscribe</button> */}
              </div>
            </div>

          </div>
          <div className="flex flex-col justify-start  text-[#D39E24] font-bold text-lg md:text-xl xl:text-2xl mt-10 md:basis-2/3">
            <h2 className="text-center">My Programs</h2>
            <ul>
              {
                userPrograms?.map((pr: UserProgramInfos2) => {
                  return(
                    <div>
                      <p>{pr.name}</p>
                      {/* {pr.poses.map((p: UserProgramInfos2) => {
                        return(
                          <p>{p.name}</p>
                      )})} */}
                    
                    </div>
                  )
                })
              }

            </ul>
          </div>
      </div>
  )
}

export default Profile