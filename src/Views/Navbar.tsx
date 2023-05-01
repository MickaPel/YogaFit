import { useState } from "react"
import { Search, X, Menu, User } from "react-feather"
import { useNavigate } from "react-router-dom"
import data from '../data.json'

interface SearchResults {
    id: number;
    english_name: string;
    sanskrit_name_adapted: string;
    sanskrit_name: string;
    level: string;
    translation_name: string;
    pose_description: string;
    pose_benefits: string;
    url_svg: string;
    url_png: string;
    url_svg_alt: string;
}

const Navbar = () => {

    const navigate = useNavigate()


    const [searchIcon, setSearchIcon] = useState<boolean>(true)
    const [searchBar, setSearchBar] = useState<boolean>(false)
    const [searchInput, setSearchInput] = useState<string>('')
    const [searchResults, setSearchResults] = useState<boolean>(false)
    const [searchResultsDiv, setSearchResultsDiv] = useState<SearchResults[]>([])
    const [searchResultsDivMobile, setSearchResultsDivMobile] = useState<SearchResults[]>([])
    const [openMenu, setOpenMenu] = useState<boolean>(false)

    // console.log(searchResults)

    const showSearchBar = () => {
        setSearchIcon(false)
        setSearchBar(true)
    }
    const closeSearchBar = () => {
        setSearchIcon(true)
        setSearchBar(false)
        setSearchResults(false)
        setSearchResultsDivMobile([])
    }
    const openTheMenu = () => {
        setOpenMenu(!openMenu)
    }
    const redirectTo = (page : string) => {
        navigate(`/${page}`)
        setOpenMenu(!openMenu)
    }
    const resultsRedirectTo = (page : string) => {
        navigate(`/pose/${page}`)
        setSearchResults(false)
        setSearchBar(false)
        setSearchIcon(true)
        setSearchInput('')
    }

    const searchPoseMobile = (e : React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value)
        if(searchInput !== ''){
            setSearchResults(true)
        }
        setSearchResultsDivMobile(data.filter((s) => s.english_name.toLowerCase().includes(e.target.value)))
    }
    const searchPose = (e : React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value)
        if(searchInput !== ''){
            setSearchResults(true)
        }
        setSearchResultsDiv(data.filter((s) => s.english_name.toLowerCase().includes(e.target.value)))
    }

    // console.log(searchResultsDivMobile)

    return (
        <div className="bg-gradient-to-t from-[#2a3c24] to-[#141D11]">
            <div className="flex flex-row items-center text-[#D4D68B]">
                <div className='flex flex-row justify-around items-center h-16 relative w-full'>
                    <div className='text-xl md:text-3xl font-bold cursor-pointer' onClick={() => navigate('/')}>Yoga Fit</div>
                    <div className="flex flex-row items-center">
                        <div className="text-xl inline-block">
                            <div className="lg:hidden">
                                {searchIcon ? <Search size={24} onClick={showSearchBar} /> : <X size={24} onClick={closeSearchBar} />}
                            </div>
                            <div className="hidden lg:flex justify-end items-center relative">
                                <input
                                    placeholder="Find a pose"
                                    className="border-2 border-[#D4D68c] bg-inherit rounded-xl w-80 placeholder:text-[#D4D68c] pl-2"
                                    value={searchInput}
                                    onChange={(e) => searchPose(e)}
                                />
                                {searchInput === '' ? <></> : <X size={24} className="absolute mr-1 w-10" onClick={() => setSearchInput('')}/>}
                                {searchResults ?
                                    <div className="absolute flex flex-col items-center left-0 right-0 top-8 ml-auto mr-auto w-2/3 sm:w-1/2 md:w-1/3 lg:w-80 text-[#243010] bg-yellow-100 rounded divide-y">
                                        {searchResultsDiv.slice(0,5).map((res) => {
                                            return(
                                                <div key={res.id} className="flex flex-row items-center w-full py-1" onClick={() => resultsRedirectTo(`${res.english_name}`)}>
                                                    <img src={res.url_png} alt={res.english_name} className="w-10 ml-5" />
                                                    <p className="ml-4">{res.english_name}</p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    : <></>
                                }
                            </div>
                        </div>
                        <div className="hidden md:flex flex-row ml-5 font-bold text-lg md:text-xl">
                            <p className="cursor-pointer" onClick={() => navigate('/poses')}>Poses</p>
                            <p className="ml-4 cursor-pointer" onClick={() => navigate('/create-program')}>Programs</p>
                        </div>
                        <User size={30} className="ml-5 hidden md:block cursor-pointer" onClick={() => navigate('/profile')}/>
                    </div>
                </div>
                <div className="mr-2 md:hidden flex flex-row items-center">
                    <User size={30} className="mr-3" onClick={() => navigate('/profile')}/>
                    { openMenu === false ?
                        <Menu size={30} onClick={openTheMenu}/>
                        :
                        <X size={30} onClick={openTheMenu}/>
                    }
                </div>
            </div>
            {searchBar ?
                <div className="flex flex-row justify-center">
                    <input type="text" placeholder="Find a pose" className="relative border rounded-xl m-auto w-2/3 sm:w-1/2 md:w-1/3 lg:w-80 pl-2 bg-inherit text-[#D4D68B] placeholder:text-[#D4D68c]" onChange={(e) => searchPoseMobile(e)}/>
                </div>
                : <></>
            }
            {searchResults ?
                <div className="absolute flex flex-col items-center left-0 right-0 ml-auto mr-auto w-2/3 sm:w-1/2 md:w-1/3 lg:w-80 bg-yellow-100 rounded divide-y">
                    {searchResultsDivMobile.slice(0,5).map((res) => {
                        return(
                            <div key={res.id} className="flex flex-row items-center w-full py-1" onClick={() => resultsRedirectTo(`${res.english_name}`)}>
                                <img src={res.url_png} alt={res.english_name} className="w-10 ml-5" />
                                <p className="ml-4">{res.english_name}</p>
                            </div>
                        )
                    })}
                </div>
                : <></>
            }
            {openMenu ?
                <div className="flex flex-col items-center py-5 font-bold text-[#D4D68B] border-b-2  border-[#D4D68c]">
                    <p className="mb-3" onClick={() => redirectTo('poses')}>Poses</p>
                    <p onClick={() => redirectTo('create-program')}>Programs</p>
                </div>
                : <></>
            }
        </div>
    )
}

export default Navbar

