import { useContext, useEffect, useState, ChangeEvent, useRef } from "react"
import { AuthContext } from "../context/AuthContext"
import { collection, getDocs, query, DocumentData } from "firebase/firestore"
import { auth, db, 
  // getProducts,
  storage } from "../firebase"
import { 
  getDownloadURL,
  ref, 
  uploadBytes 
} from "firebase/storage";
import { useNavigate } from "react-router-dom"
import { UserProgramInfos, UserProgramNames } from "../interfaces/Poses"
  import { uploadProduct } from "../firebase/index";
  import { Upload } from "react-feather"

  const defaultInputs = {
    name: '',
    price: 0
  }


const Profile = () => {

  const { currentUser, signOut, deleteUser } = useContext(AuthContext)

  const navigate = useNavigate()

  const [names, setNames] = useState<UserProgramNames[]>([])
  const [userPrograms, setUserPrograms] = useState<UserProgramInfos[]>([])
  

  const getProgramNames = async () => { 
    const querySnapshot = await getDocs(collection(db, `users`, `${currentUser?.uid}`, 'Program Names'));
    console.log(querySnapshot)
    const names = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        console.log("first")
        return { 
                name: data.name, 
                id: doc.id,
                }
            }); 
            setNames(names); 
  }


  const getUserPrograms = () => {
    names.forEach(async(n) => {
      const querySnapshot = await getDocs(collection(db, `users`, `${currentUser?.uid}`, `${n.name}`));
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
              const filter = userPrograms.filter((par) => par.name === n.name)
              if(filter.length === 0){
                
                setUserPrograms([...userPrograms, {name: n.name, poses}])
              }
    })
  }

  useEffect(() => {
    getProgramNames()

}, [])

  useEffect(() => {
    if(names.length !== 0){
      getUserPrograms()
      
    }
}, [names, userPrograms])

  const fileRef = useRef(null)
  const [fileUpload, setFileUpload] = useState<FileList | null>(null)
  const [disabled, setDisabled] = useState(false)

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setDisabled(true);
      
    if (fileUpload) {
      const inputFile = fileRef.current as HTMLInputElement | null;
      const res = await uploadProduct(
        // formFields, 
        fileUpload[0], 
        currentUser?.uid
      );
        
      if (res && inputFile) {
        setDisabled(false);
        setFileUpload(null);
          
        // Clear the file upload value.
        inputFile.value = '';
      }
    }
  }

  const [products, setProducts] = useState<DocumentData[]>([])
  const [url, setUrl] = useState<string | undefined>()
  console.log(url)
    
  // Fetch initial products.
  useEffect(() => {
    const getProductsMap = async () => {
      // const productsMap = await getProducts();
      // setProducts(productsMap)
      const imageRef = ref(storage, `images/${currentUser?.uid}`);
      getDownloadURL(imageRef)
          .then((url) => {
            setUrl(url);
          })
          .catch((error) => {
            console.log(error.message, "error getting the image url");
          });
    }

    return () => {
      getProductsMap();
    }
  }, [url])

    // const [profileImage, setProfileImage] = useState<FileList | null>(null)
    

    // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    //   if(e.target.files){
    //     setProfileImage(e.target.files)
    //   }
    // }
    // console.log(profileImage)

    // const handleSubmit = () => {
    //   const imageRef = ref(storage, "images");
    //   uploadBytes(imageRef, profileImage)
    //     .then(() => {
    //       getDownloadURL(imageRef)
    //         .then((url) => {
    //           setUrl(url);
    //         })
    //         .catch((error) => {
    //           console.log(error.message, "error getting the image url");
    //         });
    //         setProfileImage(null);
    //     })
    //     .catch((error) => {
    //       console.log(error.message);
    //     });
    // };

  return(
      <div className="min-h-[calc(100vh-102px)] flex flex-col md:flex-row xl:pt-10">
          <div className="flex flex-row md:flex-col justify-center md:justify-start pt-8 text-[#C9A95D] font-bold md:basis-1/3">
            <div className="w-full">
              <img 
                src={url} 
                alt='profile' 
                className="rounded-full border-4 w-28 h-28 m-auto object-cover"
              />
              <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <label className="label">
                  <input
                      ref={fileRef}
                      id="file"
                      className='inpt w-2/3'
                      type="file"
                      name="image"
                      accept=".png, .jpg, .jpeg"
                      placeholder="choose a picture"
                      disabled={disabled}
                      onChange={(e) => setFileUpload(e.target.files)}
                      required
                    />
                  <span>Select a file</span>
                </label>
                <button disabled={disabled} type="submit">
                  {disabled ? 'Loading' : 'Submit'}
                </button>
              </form>
            </div>
            <div className="flex flex-col w-full justify-between items-start md:items-center md:mt-6">
              <div>
                <p className="md:text-center text-xl md:text-2xl">{currentUser?.displayName}</p>
                <p className="md:text-center text-sm md:text-base">{currentUser?.email}</p>
              </div>
              <div className="flex flex-row items-center justify-center md:mt-10">
                <button className="text-[#D39E24] px-2 border-rose-500 hover:bg-red-400 hover:bg-opacity-50 hover:rounded hover:text-[#423411]" onClick={signOut}>Logout</button>
                {/* <button className="text-[#D39E24] px-2 border-rose-500 hover:bg-red-400 hover:bg-opacity-50 hover:rounded hover:text-[#423411]" onClick={() => deleteUser(currentUser)}>Unsubscribe</button> */}
              </div>
            </div>

          </div>
          <div className="flex flex-col justify-start  text-[#D39E24] font-bold text-lg md:text-xl xl:text-2xl mt-10 md:basis-2/3">
            <h2 className="text-center">My Programs</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 justify-start text-[#D4D68B] pt-8">
              {
                userPrograms?.map((pr: UserProgramInfos, id) => {
                  return(
                    <div key={id} onClick={() => navigate(`/program/${pr.name}`)} className="m-auto w-2/3 h-full lg:h-64 py-5 rounded border-2 border-[#D4D68B] cursor-pointer overflow-auto scrollbar-thin scrollbar-thumb-[#D4D68B]">
                      <p className="text-large underline underline-offset-4 pb-4 text-center">{pr.name}</p>
                      {pr.poses.map((p) => {
                        return(
                          <div className="flex flex-row pt-1 justify-center items-center">
                            <img src={p.image} alt={p.name} className="w-8 xl:w-12 mr-2" />
                            <p className="text-sm mr-1">{p.name}</p>
                            <p className="text-sm">({p.time}s)</p>
                          </div>
                      )})}
                    </div>
                  )
                })
              }

            </div>
            
          </div>
      </div>
  )
}

export default Profile