"use client"
import { motion } from "framer-motion"

interface CardAnimationProps {
  cards: string[]
}

export function CardAnimation({ cards }: CardAnimationProps) {
  return (
    <div className="flex justify-center items-center py-4">
      <div className="relative h-40 w-full max-w-md">
        {cards.map((card, index) => {
          const isRed = card.includes("♥") || card.includes("♦")

          return (
            <motion.div
              key={index}
              className={`absolute top-0 bg-white rounded-lg shadow-lg border border-gray-300 w-16 h-24 flex items-center justify-center text-xl font-bold ${isRed ? "text-red-500" : "text-black"}`}
              style={{ left: "calc(50% - 40px)" }}
              initial={{
                y: -100,
                opacity: 0,
                rotateY: 180,
                x: (index - 2) * 30,
              }}
              animate={{
                y: 0,
                opacity: 1,
                rotateY: 0,
                x: (index - 2) * 70, // Aumentado o espaçamento entre as cartas
              }}
              transition={{
                delay: index * 0.15,
                duration: 0.5,
                type: "spring",
                stiffness: 200,
              }}
            >
              {card}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

