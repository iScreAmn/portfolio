"use client";

import { motion } from "motion/react"
import "./LoadingCircle.css"

function LoadingCircleSpinner() {
    return (
        <div className="circle-container">
            <motion.div
                className="spinner"
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
        </div>
    )
}

export default LoadingCircleSpinner
