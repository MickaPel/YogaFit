
const Home: React.FC = () => {

    return (
        <div>
            <div className="homeText flex flex-col items-center min-h-[calc(100vh-102px)] text-xl md:text-3xl font-bold text-[#FFFC97]">
                <h1 className="mt-20">Welcome to Yoga Fit</h1>
                <h2 className="">Create your own Yoga routine</h2>
                    <img src="https://res.cloudinary.com/dko1be2jy/image/upload/fl_sanitize/v1676483074/yoga-api/5_i64gif.png" alt="yoga" className="mt-10"/>
                
            </div>
        </div>
    )
}

export default Home