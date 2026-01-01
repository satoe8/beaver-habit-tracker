"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, X, Send, Crown, UserPlus, Settings, Trash2, MessageSquare, Bell } from "lucide-react"
import FriendBeaverView from "@/components/friend-beaver-view"

interface Friend {
  id: string
  name: string
  initials: string
  color: string
  level: "seedling" | "kit" | "adult"
  xp: number
  online: boolean
}

interface Squad {
  id: string
  name: string
  members: Friend[]
  owner: string
  habitCount: number
  totalXP: number
}

interface MultiplayerPanelProps {
  isOpen: boolean
  onClose: () => void
  friends: Friend[]
}

export default function MultiplayerPanel({ isOpen, onClose, friends }: MultiplayerPanelProps) {
  const [squads, setSquads] = useState<Squad[]>([
    {
      id: "1",
      name: "Morning Warriors",
      members: friends.slice(0, 2),
      owner: "You",
      habitCount: 12,
      totalXP: 1450,
    },
    {
      id: "2",
      name: "Evening Hustlers",
      members: [friends[2]],
      owner: "Sarah Chen",
      habitCount: 8,
      totalXP: 980,
    },
  ])
  const [newSquadName, setNewSquadName] = useState("")
  const [selectedSquad, setSelectedSquad] = useState<Squad | null>(null)
  const [messages, setMessages] = useState<{ user: string; text: string; time: string }[]>([
    { user: "Alex Rivera", text: "Just completed my morning workout!", time: "5 min ago" },
    { user: "You", text: "Nice! Keep up the streak!", time: "3 min ago" },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [viewingFriend, setViewingFriend] = useState<Friend | null>(null)
  const [nudgeNotifications, setNudgeNotifications] = useState<string[]>([])

  const handleCreateSquad = () => {
    if (newSquadName.trim()) {
      const newSquad: Squad = {
        id: Date.now().toString(),
        name: newSquadName,
        members: [],
        owner: "You",
        habitCount: 0,
        totalXP: 0,
      }
      setSquads((prev) => [...prev, newSquad])
      setNewSquadName("")
    }
  }

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedSquad) {
      setMessages((prev) => [...prev, { user: "You", text: newMessage, time: "Just now" }])
      setNewMessage("")
    }
  }

  const handleNudge = (friendId: string) => {
    const friend = friends.find((f) => f.id === friendId)
    if (friend) {
      setNudgeNotifications((prev) => [...prev, `You nudged ${friend.name}!`])
      setTimeout(() => {
        setNudgeNotifications((prev) => prev.slice(1))
      }, 3000)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Nudge notifications */}
      <div className="fixed top-4 right-4 z-60 space-y-2">
        {nudgeNotifications.map((notification, index) => (
          <Card key={index} className="bg-accent text-accent-foreground animate-in slide-in-from-top-2 shadow-lg">
            <CardContent className="p-3 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="text-sm font-medium">{notification}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        <CardHeader className="border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                Multiplayer Squads
              </CardTitle>
              <CardDescription className="mt-1.5">
                Create squads, compete with friends, and share your journey
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 flex-1 overflow-hidden">
          <Tabs defaultValue="squads" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="squads" className="gap-2">
                My Squads
                <Badge variant="secondary" className="ml-1">
                  {squads.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="gap-2">
                Leaderboard
              </TabsTrigger>
            </TabsList>

            <TabsContent value="squads" className="flex-1 overflow-hidden mt-0">
              <div className="h-full flex flex-col gap-4">
                {/* Create Squad Section */}
                <Card className="border-dashed">
                  <CardContent className="p-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="New squad name..."
                        value={newSquadName}
                        onChange={(e) => setNewSquadName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCreateSquad()}
                        className="flex-1"
                      />
                      <Button onClick={handleCreateSquad} size="sm">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Create Squad
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Squads List */}
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    {squads.map((squad) => (
                      <Card
                        key={squad.id}
                        className="cursor-pointer hover:shadow-md transition-all"
                        onClick={() => setSelectedSquad(squad)}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-lg text-foreground">{squad.name}</h3>
                                {squad.owner === "You" && (
                                  <Badge variant="secondary" className="gap-1">
                                    <Crown className="w-3 h-3" />
                                    Owner
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {squad.members.length} members • {squad.habitCount} habits • {squad.totalXP} total XP
                              </p>
                            </div>
                            {squad.owner === "You" && (
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Settings className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSquads((prev) => prev.filter((s) => s.id !== squad.id))
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>

                          {/* Members */}
                          <div className="flex items-center gap-2">
                            {squad.members.map((member) => (
                              <div key={member.id} className="relative">
                                <Avatar className={`${member.color} w-8 h-8`}>
                                  <AvatarFallback className="text-white text-xs font-semibold">
                                    {member.initials}
                                  </AvatarFallback>
                                </Avatar>
                                {member.online && (
                                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-card rounded-full" />
                                )}
                              </div>
                            ))}
                            <Button variant="ghost" size="sm" className="h-8 rounded-full px-3 text-xs">
                              <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                              Invite
                            </Button>
                          </div>

                          {/* Chat Preview */}
                          {selectedSquad?.id === squad.id && messages.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-border">
                              <div className="flex items-center gap-2 mb-3">
                                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-medium text-foreground">Squad Chat</span>
                              </div>
                              <div className="space-y-2 mb-3">
                                {messages.slice(-2).map((msg, idx) => (
                                  <div key={idx} className="text-sm">
                                    <span className="font-medium text-foreground">{msg.user}:</span>{" "}
                                    <span className="text-muted-foreground">{msg.text}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Send a message..."
                                  value={newMessage}
                                  onChange={(e) => setNewMessage(e.target.value)}
                                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                  className="h-9 text-sm"
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <Button size="sm" onClick={handleSendMessage} className="h-9">
                                  <Send className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="leaderboard" className="flex-1 overflow-hidden mt-0">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-3">
                  {[...friends]
                    .sort((a, b) => b.xp - a.xp)
                    .map((friend, index) => (
                      <Card
                        key={friend.id}
                        className="cursor-pointer hover:shadow-md transition-all"
                        onClick={() => setViewingFriend(friend)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="text-2xl font-bold text-muted-foreground w-8 text-center">{index + 1}</div>
                            <div className="relative">
                              <Avatar className={`${friend.color} w-12 h-12`}>
                                <AvatarFallback className="text-white text-sm font-semibold">
                                  {friend.initials}
                                </AvatarFallback>
                              </Avatar>
                              {friend.online && (
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">{friend.name}</h3>
                              <p className="text-sm text-muted-foreground capitalize">
                                {friend.level} Beaver • {friend.xp} XP
                              </p>
                            </div>
                            {index < 3 && (
                              <Badge
                                variant={index === 0 ? "default" : "secondary"}
                                className={
                                  index === 0 ? "bg-accent text-accent-foreground" : index === 1 ? "bg-muted" : ""
                                }
                              >
                                {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Friend Beaver View Modal */}
      {viewingFriend && (
        <FriendBeaverView friend={viewingFriend} onClose={() => setViewingFriend(null)} onNudge={handleNudge} />
      )}
    </div>
  )
}
