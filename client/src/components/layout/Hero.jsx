import ParticleAnimation from "@/components/layout/ParticleAnimation.jsx";
import { motion } from "framer-motion"
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";

const PhysicsHero = () => {
    const user = useSelector(state => state.user)
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
            <ParticleAnimation />
            <div className="relative z-10 text-center text-white px-4">
                <motion.h1
                    className="text-5xl md:text-7xl font-bold mb-6"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Fizika olamini kashf qiling
                </motion.h1>
                <motion.p
                    className="text-xl md:text-2xl mb-8"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {/*Kosmosning kvant olamidan tortib galaktik miqyosgacha bo'lgan sirlarini oching.*/}
                    Hush kelibsiz {user.name}
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <Link
                        to="/definetest"
                        className="bg-white text-blue-900 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-100 transition duration-300"
                    >
                        Test Yechish
                    </Link>
                </motion.div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent z-10"></div>

        </div>
    )
}

export default PhysicsHero