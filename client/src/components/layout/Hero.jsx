import ParticleAnimation from "@/components/layout/ParticleAnimation.jsx";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import { useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"


// export default function PhysicsHeroV2() {
//     const ref = useRef(null)
//     const { scrollYProgress } = useScroll({
//         target: ref,
//         offset: ["start start", "end start"],
//     })
//
//     const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
//
//     useEffect(() => {
//         const observerOptions = {
//             root: null,
//             rootMargin: "0px",
//             threshold: 0.1,
//         }
//
//         const observerCallback = (entries) => {
//             entries.forEach((entry) => {
//                 if (entry.isIntersecting) {
//                     entry.target.classList.add("fade-in-element")
//                 }
//             })
//         }
//
//         const observer = new IntersectionObserver(observerCallback, observerOptions)
//         const elements = document.querySelectorAll(".fade-in")
//         elements.forEach((el) => observer.observe(el))
//
//         return () => observer.disconnect()
//     }, [])
//
//     return (
//         <div
//             ref={ref}
//             className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 text-white"
//         >
//             <div className="absolute inset-0 overflow-hidden">
//                 <svg
//                     className="absolute left-[calc(50%-11rem)] top-[calc(50%-37rem)] -z-10 h-[21.1875rem] max-w-none transform-gpu blur-3xl sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
//                     viewBox="0 0 1155 678"
//                     xmlns="http://www.w3.org/2000/svg"
//                 >
//                     <path
//                         fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
//                         fillOpacity=".3"
//                         d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
//                     />
//                     <defs>
//                         <linearGradient
//                             id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
//                             x1="1155.49"
//                             x2="-78.208"
//                             y1=".177"
//                             y2="474.645"
//                             gradientUnits="userSpaceOnUse"
//                         >
//                             <stop stopColor="#9089FC" />
//                             <stop offset={1} stopColor="#FF80B5" />
//                         </linearGradient>
//                     </defs>
//                 </svg>
//             </div>
//             <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
//                 <motion.div style={{ y }} className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
//                     <div className="flex flex-col justify-center">
//                         <h1 className="fade-in text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
//                             Unravel the Mysteries of
//                             <span className="block text-blue-400">Physics</span>
//                         </h1>
//                         <p className="fade-in mt-6 max-w-3xl text-xl text-gray-300">
//                             From the infinitesimal world of quantum mechanics to the vast expanses of the cosmos, explore the
//                             fundamental laws that shape our universe.
//                         </p>
//                         <div className="fade-in mt-10 flex items-center gap-x-6">
//                             <Link
//                                 href="/start-learning"
//                                 className="rounded-md bg-blue-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 transition-colors duration-200"
//                             >
//                                 Test Yechish
//                             </Link>
//                         </div>
//                     </div>
//                     <div className="relative mt-20 lg:mt-0">
//                         <svg viewBox="0 0 200 200" className="w-full h-auto fade-in">
//                             <defs>
//                                 <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
//                                     <stop offset="0%" stopColor="#4F46E5" />
//                                     <stop offset="100%" stopColor="#9333EA" />
//                                 </linearGradient>
//                             </defs>
//                             <circle cx="100" cy="100" r="80" fill="none" stroke="url(#gradient)" strokeWidth="2">
//                                 <animateTransform
//                                     attributeName="transform"
//                                     attributeType="XML"
//                                     type="rotate"
//                                     from="0 100 100"
//                                     to="360 100 100"
//                                     dur="10s"
//                                     repeatCount="indefinite"
//                                 />
//                             </circle>
//                             <circle cx="100" cy="100" r="40" fill="none" stroke="url(#gradient)" strokeWidth="2">
//                                 <animateTransform
//                                     attributeName="transform"
//                                     attributeType="XML"
//                                     type="rotate"
//                                     from="360 100 100"
//                                     to="0 100 100"
//                                     dur="6s"
//                                     repeatCount="indefinite"
//                                 />
//                             </circle>
//                             <circle cx="100" cy="60" r="5" fill="#60A5FA">
//                                 <animateMotion
//                                     path="M 0 0 Q 40 20 0 40 Q -40 60 0 80 Q 40 100 0 120 Q -40 140 0 160 Z"
//                                     dur="6s"
//                                     repeatCount="indefinite"
//                                 />
//                             </circle>
//                         </svg>
//                     </div>
//                 </motion.div>
//             </div>
//         </div>
//     )
// }

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