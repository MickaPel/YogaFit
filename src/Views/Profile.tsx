import { useContext, useEffect, useState, useRef } from "react"
import { AuthContext } from "../context/AuthContext"
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore"
import { db, storage } from "../firebase"
import { getDownloadURL, ref } from "firebase/storage";
import { useNavigate } from "react-router-dom"
import { UserProgramInfos, UserProgramNames } from "../interfaces/Poses"
import { uploadProduct } from "../firebase/index";
import { ArrowRight, X } from "react-feather";

const Profile = () => {

  const { currentUser, signOut } = useContext(AuthContext)

  const navigate = useNavigate()

  const [names, setNames] = useState<UserProgramNames[]>([])
  const [userPrograms, setUserPrograms] = useState<UserProgramInfos[]>([])
  const [urlAvatar, setUrlAvatar] = useState<string | undefined>()
  const [selectedProg, setSelectedProg] = useState<UserProgramInfos>()
  const [selectedProgName, setSelectedProgName] = useState<UserProgramNames[]>([])
  const [showModal, setShowModal] = useState(false);

  const getProgramNames = async () => {
    const querySnapshot = await getDocs(collection(db, `users`, `${currentUser?.uid}`, 'Program Names'));
    const names = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        name: data.name,
        id: doc.id,
      }
    });
    setNames(names);
  }

  const getUserPrograms = () => {
    names.forEach(async (n) => {
      const querySnapshot = await getDocs(collection(db, `users`, `${currentUser?.uid}`, `${n.name}`));
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
      const filter = userPrograms.filter((par) => par.name === n.name)
      if (filter.length === 0) {
        setUserPrograms([...userPrograms, { name: n.name, poses }])
      }
    })
  }

  useEffect(() => {
    getProgramNames()
  }, [currentUser])

  useEffect(() => {
    if (names.length !== 0) {
      getUserPrograms()
    }
  }, [names, userPrograms])

  const docRef = doc(db, 'users', `${currentUser?.uid}`);
  const progNameColRef = collection(docRef, `Program Names`)
  const progColRef = collection(docRef, `${selectedProg?.name}`)

  

  // console.log(selectedProg)
  console.log(selectedProgName[0]?.id)
  
  const openModal = (selectedProgram: UserProgramInfos) => {
    setShowModal(true)
    setSelectedProg(selectedProgram)
    console.log(names)
    console.log(selectedProg)
    const filter = names.filter((n) => n.name === selectedProg?.name)
    console.log(filter)
    // if (filter.length !== 0) {
      setSelectedProgName(filter);
      // console.log('filter')
    // }
    
    

  }

  const deleteProgram = async () => {
    
    await deleteDoc(doc(progNameColRef, `${selectedProgName[0]?.id}`))
    
    
    selectedProg?.poses.forEach(async(item) => {
      await deleteDoc(doc(progColRef, `${item.id}`))
    })
    // console.log(names)
    // console.log(selectedProg?.name)
    
    
}

  const fileRef = useRef(null)
  const [fileUpload, setFileUpload] = useState<FileList | null>(null)
  const [disabled, setDisabled] = useState(false)
  const [fileAdded, setFileAdded] = useState(false)

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setDisabled(true);
    setFileAdded(false)

    if (fileUpload) {
      const inputFile = fileRef.current as HTMLInputElement | null;
      const res = await uploadProduct( 
        fileUpload[0],
        currentUser?.uid
      );

      if (res && inputFile) {
        setDisabled(false);
        setFileUpload(null);
        setFileAdded(true)

        // Clear the file upload value.
        inputFile.value = '';
      }
    }
  }

  // Fetch initial products.
  useEffect(() => {
    const getProfileAvatar = async () => {
      const imageRef = ref(storage, `images/${currentUser?.uid}`);
      getDownloadURL(imageRef)
        .then((url) => {
          setUrlAvatar(url);
        })
        .catch((error) => {
          console.log(error.message, "error getting the image url");
        });
    }

    getProfileAvatar();
  }, [fileAdded, currentUser])

  return (
    <div className="min-h-[calc(100vh-102px)] flex flex-col md:flex-row xl:pt-10">
      <div className="flex flex-row md:flex-col justify-center md:justify-start pt-8 text-[#C9A95D] font-bold md:basis-1/3">
        <div className="w-full">
          <img
            src={urlAvatar}
            alt={urlAvatar}
            className="rounded-full border-4 w-28 h-28 m-auto object-cover"
          />
          <form onSubmit={handleSubmit} className="flex flex-col items-center text-sm">
            <label htmlFor="upload-photo" className="text-xs">Choose a new file</label>
            <input
              ref={fileRef}
              id="upload-photo"
              className='w-2/3'
              type="file"
              name="image"
              accept=".png, .jpg, .jpeg"
              placeholder="choose a picture"
              disabled={disabled}
              onChange={(e) => setFileUpload(e.target.files)}
              required
            />
            <button disabled={disabled} type="submit">
              {disabled ? 'Loading' : 'Change'}
            </button>
          </form>
        </div>
        <div className="flex flex-col w-full justify-between items-start md:items-center md:mt-6">
          <div>
            <p className="md:text-center text-2xl md:text-3xl">{currentUser?.displayName}</p>
            <p className="md:text-center text-sm md:text-base">{currentUser?.email}</p>
          </div>
          <div className="flex flex-row items-center justify-center md:mt-10">
            <button className="text-[#D39E24] px-2 border-rose-500 hover:bg-red-400 hover:bg-opacity-50 hover:rounded hover:text-[#423411]" onClick={signOut}>Logout</button>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-start  text-[#D39E24] font-bold text-lg md:text-xl xl:text-2xl mt-10 md:basis-2/3">
        <h2 className="text-center">My Programs</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 justify-start text-[#D4D68B] pt-8">
          {
            userPrograms?.map((pr: UserProgramInfos, id) => {
              return (
                <div key={id} className="relative flex flex-col items-center m-auto w-2/3 h-full lg:h-64 py-5 rounded border-2 border-[#D4D68B] cursor-pointer overflow-auto scrollbar-thin scrollbar-thumb-[#D4D68B]">
                  <p className="text-large underline underline-offset-4 pb-4 text-center" onClick={() => console.log(pr) }>{pr.name}</p>
                  <button
                                                    onClick={() => {
                                                      // setSelectedProg(pr); 
                                                      openModal(pr)}}
                                                    className="
                                                    absolute
                                                    top-0 right-0 cursor-pointer">
                                                    <X color="red" size={40}/>
                                                </button>
                  {pr.poses.map((p) => {
                    return (
                      <div className="flex flex-row pt-1 justify-center items-center">
                        <img src={p.image} alt={p.name} className="w-8 xl:w-12 mr-2" />
                        <p className="text-sm mr-1">{p.name}</p>
                        <p className="text-sm">({p.time}s)</p>
                      </div>
                    )
                  })}
                  <button onClick={() => navigate(`/program/${pr.name}`)} className='py-1 px-2 sm:px-4 w-24 shadow-md shadow-stone-950/50 mt-4 sm:mt-6 rounded-md text-base sm:text-lg text-[#FFFC97] font-semibold border-2 border-[#FFFC97]  hover:text-white hover:border-white hover:shadow-slate-200/50 flex flex-row items-center justify-center'>Start<ArrowRight className="text-[#FFFC97] mt-1" size={25}/></button>
                </div>
              )
            })
          }
        </div>
        <button onClick={deleteProgram}>de</button>
      </div>
      {showModal ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto md:w-72 my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-[#87a330] outline-none focus:outline-none">
                <div className="flex items-end justify-end p-5">
                  <button
                    className="bg-transparent border-0 text-black float-right"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="text-black opacity-7 h-6 w-6 text-xl block py-0 rounded-full">
                      <X />
                    </span>
                  </button>
                </div>
                <div className="relative px-4 flex-auto">
                <p className="text-xl font=semibold text-center">Delete {selectedProg?.name} ?</p>
                </div>
                <div className="flex justify-center p-6">
                  <button
                    className="text-[#D39E24] bg-[#2a3c24] active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default Profile