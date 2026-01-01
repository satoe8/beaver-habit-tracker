"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coins, X, Check, Lock, Sparkles } from "lucide-react"

interface ShopItem {
  id: string
  name: string
  description: string
  cost: number
  category: "beaver" | "dam"
  emoji: string
  owned: boolean
  equipped: boolean
}

interface CustomizationShopProps {
  isOpen: boolean
  onClose: () => void
  beaverCoins: number
  onPurchase: (itemId: string, cost: number) => void
  onEquip: (itemId: string, category: "beaver" | "dam") => void
}

const SHOP_ITEMS: ShopItem[] = [
  {
    id: "hat-1",
    name: "Top Hat",
    description: "A classy top hat for your beaver",
    cost: 50,
    category: "beaver",
    emoji: "🎩",
    owned: false,
    equipped: false,
  },
  {
    id: "hat-2",
    name: "Party Hat",
    description: "Celebrate every habit completion",
    cost: 40,
    category: "beaver",
    emoji: "🎉",
    owned: false,
    equipped: false,
  },
  {
    id: "hat-3",
    name: "Crown",
    description: "Become the king of habits",
    cost: 100,
    category: "beaver",
    emoji: "👑",
    owned: false,
    equipped: false,
  },
  {
    id: "acc-1",
    name: "Sunglasses",
    description: "Too cool for missed habits",
    cost: 60,
    category: "beaver",
    emoji: "😎",
    owned: false,
    equipped: false,
  },
  {
    id: "acc-2",
    name: "Bow Tie",
    description: "Distinguished and dapper",
    cost: 45,
    category: "beaver",
    emoji: "🎀",
    owned: false,
    equipped: false,
  },
  {
    id: "acc-3",
    name: "Gold Medal",
    description: "For champion habit builders",
    cost: 80,
    category: "beaver",
    emoji: "🏅",
    owned: false,
    equipped: false,
  },
  {
    id: "dam-1",
    name: "Stone Dam",
    description: "Upgrade to a stone foundation",
    cost: 120,
    category: "dam",
    emoji: "🏔️",
    owned: false,
    equipped: false,
  },
  {
    id: "dam-2",
    name: "Garden Dam",
    description: "Add flowers and greenery",
    cost: 90,
    category: "dam",
    emoji: "🌸",
    owned: false,
    equipped: false,
  },
  {
    id: "dam-3",
    name: "Winter Dam",
    description: "Snowy and cozy atmosphere",
    cost: 110,
    category: "dam",
    emoji: "❄️",
    owned: false,
    equipped: false,
  },
  {
    id: "dam-4",
    name: "Sunset Dam",
    description: "Golden hour vibes",
    cost: 100,
    category: "dam",
    emoji: "🌅",
    owned: false,
    equipped: false,
  },
  {
    id: "dam-5",
    name: "Crystal Dam",
    description: "Mystical crystal energy",
    cost: 150,
    category: "dam",
    emoji: "💎",
    owned: false,
    equipped: false,
  },
]

export default function CustomizationShop({
  isOpen,
  onClose,
  beaverCoins,
  onPurchase,
  onEquip,
}: CustomizationShopProps) {
  const [inventory, setInventory] = useState<ShopItem[]>(SHOP_ITEMS)
  const [activeTab, setActiveTab] = useState<"beaver" | "dam">("beaver")

  if (!isOpen) return null

  const handlePurchase = (item: ShopItem) => {
    if (beaverCoins >= item.cost && !item.owned) {
      onPurchase(item.id, item.cost)
      setInventory((prev) => prev.map((i) => (i.id === item.id ? { ...i, owned: true } : i)))
    }
  }

  const handleEquip = (item: ShopItem) => {
    if (item.owned) {
      setInventory((prev) =>
        prev.map((i) => ({
          ...i,
          equipped: i.id === item.id ? true : i.category === item.category ? false : i.equipped,
        })),
      )
      onEquip(item.id, item.category)
    }
  }

  const getDamPreviewGradient = (itemId: string) => {
    switch (itemId) {
      case "dam-1":
        return "bg-gradient-to-br from-slate-500 via-slate-700 to-slate-900"
      case "dam-2":
        return "bg-gradient-to-br from-green-300 via-green-600 to-green-900"
      case "dam-3":
        return "bg-gradient-to-br from-cyan-100 via-blue-400 to-blue-700"
      case "dam-4":
        return "bg-gradient-to-br from-orange-200 via-orange-500 to-purple-800"
      case "dam-5":
        return "bg-gradient-to-br from-purple-300 via-pink-500 to-indigo-800"
      default:
        return "bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900"
    }
  }

  const beaverItems = inventory.filter((item) => item.category === "beaver")
  const damItems = inventory.filter((item) => item.category === "dam")

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        <CardHeader className="border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-accent" />
                Customization Shop
              </CardTitle>
              <CardDescription className="mt-1.5">Customize your beaver and dam with Beaver Coins</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-accent/10 border-accent text-accent-foreground h-10 px-4 gap-2">
                <Coins className="w-5 h-5" />
                <span className="text-base font-semibold">{beaverCoins}</span>
              </Badge>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 flex-1 overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "beaver" | "dam")}
            className="h-full flex flex-col"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="beaver" className="gap-2">
                Beaver Outfits
                <Badge variant="secondary" className="ml-1">
                  {beaverItems.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="dam" className="gap-2">
                Dam Themes
                <Badge variant="secondary" className="ml-1">
                  {damItems.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="beaver" className="flex-1 overflow-hidden mt-0">
              <ScrollArea className="h-full pr-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {beaverItems.map((item) => (
                    <Card
                      key={item.id}
                      className={`relative overflow-hidden transition-all hover:shadow-md ${
                        item.equipped ? "ring-2 ring-accent" : ""
                      }`}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="text-5xl flex-shrink-0">{item.emoji}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="font-semibold text-foreground text-lg">{item.name}</h3>
                              {item.equipped && (
                                <Badge
                                  variant="secondary"
                                  className="gap-1 bg-accent/20 text-accent-foreground border-accent/30"
                                >
                                  <Check className="w-3 h-3" />
                                  Equipped
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{item.description}</p>
                            {item.owned ? (
                              <Button
                                size="sm"
                                variant={item.equipped ? "secondary" : "default"}
                                onClick={() => handleEquip(item)}
                                disabled={item.equipped}
                                className="w-full"
                              >
                                {item.equipped ? "Equipped" : "Equip"}
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handlePurchase(item)}
                                disabled={beaverCoins < item.cost}
                                className="w-full gap-2"
                              >
                                {beaverCoins < item.cost && <Lock className="w-4 h-4" />}
                                <Coins className="w-4 h-4" />
                                {item.cost}
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="dam" className="flex-1 overflow-hidden mt-0">
              <ScrollArea className="h-full pr-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {damItems.map((item) => (
                    <Card
                      key={item.id}
                      className={`relative overflow-hidden transition-all hover:shadow-md ${
                        item.equipped ? "ring-2 ring-accent" : ""
                      }`}
                    >
                      <div className={`h-32 ${getDamPreviewGradient(item.id)} relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent opacity-50 animate-pulse" />
                        <div className="absolute bottom-3 right-3 text-4xl opacity-40">{item.emoji}</div>
                        <div className="absolute top-3 left-3 text-2xl opacity-30">{item.emoji}</div>
                        {item.equipped && (
                          <div className="absolute top-2 left-2">
                            <Badge
                              variant="secondary"
                              className="gap-1 bg-background/80 backdrop-blur-sm text-foreground border-accent/50"
                            >
                              <Check className="w-3 h-3" />
                              Active
                            </Badge>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-foreground text-lg">{item.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{item.description}</p>
                        {item.owned ? (
                          <Button
                            size="sm"
                            variant={item.equipped ? "secondary" : "default"}
                            onClick={() => handleEquip(item)}
                            disabled={item.equipped}
                            className="w-full"
                          >
                            {item.equipped ? "Active" : "Activate"}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handlePurchase(item)}
                            disabled={beaverCoins < item.cost}
                            className="w-full gap-2"
                          >
                            {beaverCoins < item.cost && <Lock className="w-4 h-4" />}
                            <Coins className="w-4 h-4" />
                            {item.cost}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
