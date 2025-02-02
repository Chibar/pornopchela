"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Declare the telegram WebApp object
declare global {
  interface Window {
    Telegram?: {
      WebApp?: any
    }
  }
}

interface Product {
  id: number
  name: string
  price: number
  description: string
}

const products: Product[] = [
  { id: 1, name: "Кайф", price: 300, description: "Описание 1", image: '/products/0.jpg' },
  { id: 2, name: "Балдёж", price: 400, description: "Описание 2", image: '/products/1.jpg' },
  { id: 3, name: "Красота", price: 500, description: "Описание 3", image: '/products/2.jpg' },
  { id: 4, name: "Идеально", price: 200, description: "Описание 4", image: '/products/3.jpg' },
]

export default function TelegramShop() {
  const [cart, setCart] = useState<{ [key: number]: number }>({})
  const [mainButtonText, setMainButtonText] = useState("View Cart")
  const [isInTelegramWebApp, setIsInTelegramWebApp] = useState(false)

  useEffect(() => {
    // Check if Telegram WebApp is available
    if (window.Telegram?.WebApp) {
      setIsInTelegramWebApp(true)
      window.Telegram.WebApp.ready()
      window.Telegram.WebApp.MainButton.setText("View Cart").show()
    }
  }, [])

  useEffect(() => {
    if (isInTelegramWebApp) {
      const totalItems = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0)
      const newButtonText = `View Cart (${totalItems})`
      setMainButtonText(newButtonText)
      window.Telegram.WebApp.MainButton.setText(newButtonText)
    }
  }, [cart, isInTelegramWebApp])

  const addToCart = (productId: number) => {
    setCart((prevCart) => ({
      ...prevCart,
      [productId]: (prevCart[productId] || 0) + 1,
    }))
  }

  const getTotalPrice = () => {
    return Object.entries(cart)
      .reduce((total, [productId, quantity]) => {
        const product = products.find((p) => p.id === Number(productId))
        return total + (product ? product.price * quantity : 0)
      }, 0)
      .toFixed(2)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Telegram Shop</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <img style={customCss.Image} src={product.image} />
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>{product.price.toFixed(2)} ₽</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{product.description}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => addToCart(product.id)}>В корзину</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Корзина</h2>
        {Object.keys(cart).length === 0 ? (
          <p>Пусто</p>
        ) : (
          <div>
            {Object.entries(cart).map(([productId, quantity]) => {
              const product = products.find((p) => p.id === Number(productId))
              return product ? (
                <div key={productId} className="flex justify-between items-center mb-2">
                  <span>
                    {product.name} x {quantity}
                  </span>
                  <span>{(product.price * quantity).toFixed(2)} ₽</span>
                </div>
              ) : null
            })}
            <div className="font-bold mt-4">Итого: {getTotalPrice()} ₽</div>
          </div>
        )}
      </div>
    </div>
  )
}

const customCss = {
  Image: {
    display: "flex",
    maxWidth: '100%',
    marginBottom: "10px",
  }
}