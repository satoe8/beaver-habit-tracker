"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { X, UserPlus, Search, Trash2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Friend {
  id: string
  name: string
  initials: string
  color: string
  level: "seedling" | "kit" | "adult"
  xp: number
  online: boolean
}

interface FriendsPanelProps {
  friends: Friend[]
  isOpen: boolean
  onClose: () => void
  onAddFriend: (name: string) => void
  onRemoveFriend: (id: string) => void
}

export default function FriendsPanel({ friends, isOpen, onClose, onAddFriend, onRemoveFriend }: FriendsPanelProps) {
  const [newFriendName, setNewFriendName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  if (!isOpen) return null

  const handleAddFriend = () => {
    if (newFriendName.trim()) {
      onAddFriend(newFriendName.trim())
      setNewFriendName("")
    }
  }

  const filteredFriends = friends.filter((friend) => friend.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "seedling":
        return "Seedling"
      case "kit":
        return "Kit"
      case "adult":
        return "Adult Beaver"
      default:
        return level
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
        <CardHeader className="flex-shrink-0 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                Friends Management
              </CardTitle>
              <CardDescription>Add friends and build your colony together</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-6">
          {/* Add Friend Section */}
          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-2 block">Add New Friend</label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter friend's name"
                value={newFriendName}
                onChange={(e) => setNewFriendName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddFriend()}
                className="flex-1"
              />
              <Button onClick={handleAddFriend} disabled={!newFriendName.trim()}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          {/* Search Friends */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Friends List */}
          <ScrollArea className="h-[350px] pr-4">
            {filteredFriends.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {searchQuery ? "No friends found" : "No friends yet. Add someone to get started!"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors"
                  >
                    <div className="relative">
                      <Avatar className={`${friend.color} w-12 h-12`}>
                        <AvatarFallback className="text-white font-semibold">{friend.initials}</AvatarFallback>
                      </Avatar>
                      {friend.online && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-card rounded-full" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">{friend.name}</h3>
                        {friend.online ? (
                          <Badge
                            variant="outline"
                            className="text-xs bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400"
                          >
                            Online
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Offline
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{getLevelLabel(friend.level)}</span>
                        <span>•</span>
                        <span>{friend.xp} XP</span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveFriend(friend.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
