"use client"
import { motion } from "framer-motion"

interface CardAnimationProps {
  hand: string
}

export function CardAnimation({ hand }: CardAnimationProps) {
  const getCardImages = (hand: string) => {
    // Simplified card representation based on the hand type
    switch (hand) {
      case "Par":
        return ["A♠", "A♥", "K♦", "Q♣", "J♠"]
      case "Dois Pares":
        return ["A♠", "A♥", "K♦", "K♣", "Q♠"]
      case "Trinca":
        return ["A♠", "A♥", "A♦", "K♣", "Q♠"]
      case "Straight":
        return ["A♠", "K♥", "Q♦", "J♣", "10♠"]
      case "Flush":
        return ["A♠", "J♠", "8♠", "6♠", "3♠"]
      case "Full House":
        return ["A♠", "A♥", "A♦", "K♣", "K♠"]
      case "Quadra":
        return ["A♠", "A♥", "A♦", "A♣", "K♠"]
      case "Straight Flush":
        return ["9♠", "8♠", "7♠", "6♠", "5♠"]
      case "Royal Flush":
        return ["A♠", "K♠", "Q♠", "J♠", "10♠"]
      default:
        return ["?", "?", "?", "?", "?"]
    }
  }

  const cards = getCardImages(hand)

  return (
    <div className="">
      <div className="flex mx-auto w-full justify-center space-x-0">
        {cards.map((card, index) => (
           <motion.div
           key={index}
            className="bg-white text-black rounded-lg shadow-lg border border-gray-300 w-16 h-24 flex items-center justify-center text-xl font-bold"
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
              x: (index - 2) * 60,
            }}
            transition={{
              delay: index * 0.25,
              duration: 0.7,
              type: "spring",
              // stiffness: 200,
            }}
          >
          <div 
          className="bg-white text-black rounded-lg shadow-lg border border-gray-300 w-16 h-24 flex items-center justify-center text-xl font-bold"
          key={index}>

            {card}
          </div>
            </motion.div>
         
        ))}
      </div>
    </div>
  )
}

