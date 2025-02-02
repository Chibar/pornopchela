import dynamic from "next/dynamic"

const TelegramShop = dynamic(() => import("../TelegramShop"), { ssr: false })

export default function Home() {
  return (
    <main>
      <TelegramShop />
    </main>
  )
}

