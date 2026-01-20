import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Plus, UserPlus, Mail, Shield, Trash2, Settings } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Team, TeamMember } from "@shared/schema";

export default function Teams() {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: "", description: "", slug: "" });
  const [newMember, setNewMember] = useState({ email: "", role: "viewer" });

  const { data: teams = [], isLoading } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  const { data: members = [] } = useQuery<TeamMember[]>({
    queryKey: ["/api/teams", selectedTeam?.id, "members"],
    enabled: !!selectedTeam,
  });

  const createTeamMutation = useMutation({
    mutationFn: async (team: typeof newTeam) => {
      return apiRequest("/api/teams", { method: "POST", body: JSON.stringify(team) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      setIsCreateOpen(false);
      setNewTeam({ name: "", description: "", slug: "" });
    },
  });

  const addMemberMutation = useMutation({
    mutationFn: async (member: typeof newMember) => {
      return apiRequest(`/api/teams/${selectedTeam?.id}/members`, { 
        method: "POST", 
        body: JSON.stringify(member) 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams", selectedTeam?.id, "members"] });
      setIsAddMemberOpen(false);
      setNewMember({ email: "", role: "viewer" });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (memberId: number) => {
      return apiRequest(`/api/team-members/${memberId}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams", selectedTeam?.id, "members"] });
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: async (teamId: number) => {
      return apiRequest(`/api/teams/${teamId}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      setSelectedTeam(null);
    },
  });

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin": return "destructive";
      case "editor": return "default";
      default: return "secondary";
    }
  };

  const getInitials = (email: string) => {
    return email.split("@")[0].slice(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-muted-foreground">Loading teams...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Teams
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your organization's teams and access control
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-team">
              <Plus className="h-4 w-4 mr-2" />
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Team Name</Label>
                <Input
                  id="name"
                  data-testid="input-team-name"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ 
                    ...newTeam, 
                    name: e.target.value,
                    slug: e.target.value.toLowerCase().replace(/\s+/g, "-")
                  })}
                  placeholder="Engineering"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Team Slug</Label>
                <Input
                  id="slug"
                  data-testid="input-team-slug"
                  value={newTeam.slug}
                  onChange={(e) => setNewTeam({ ...newTeam, slug: e.target.value })}
                  placeholder="engineering"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  data-testid="input-team-description"
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                  placeholder="Team responsible for..."
                />
              </div>
              <Button 
                className="w-full" 
                data-testid="button-submit-team"
                onClick={() => createTeamMutation.mutate(newTeam)}
                disabled={!newTeam.name || !newTeam.slug}
              >
                Create Team
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold">All Teams</h2>
          {teams.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No teams yet. Create your first team to get started.
              </CardContent>
            </Card>
          ) : (
            teams.map((team) => (
              <Card 
                key={team.id}
                className={`cursor-pointer transition-colors hover-elevate ${selectedTeam?.id === team.id ? "border-primary" : ""}`}
                onClick={() => setSelectedTeam(team)}
                data-testid={`card-team-${team.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{team.name}</h3>
                        <p className="text-sm text-muted-foreground">@{team.slug}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedTeam ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {selectedTeam.name}
                    <Badge variant="outline">@{selectedTeam.slug}</Badge>
                  </CardTitle>
                  <CardDescription>
                    {selectedTeam.description || "No description"}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" data-testid="button-add-member">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Member
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Team Member</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            data-testid="input-member-email"
                            value={newMember.email}
                            onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                            placeholder="user@example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Select
                            value={newMember.role}
                            onValueChange={(value) => setNewMember({ ...newMember, role: value })}
                          >
                            <SelectTrigger data-testid="select-member-role">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="editor">Editor</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button 
                          className="w-full"
                          data-testid="button-submit-member"
                          onClick={() => addMemberMutation.mutate(newMember)}
                          disabled={!newMember.email}
                        >
                          Add Member
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    data-testid="button-delete-team"
                    onClick={() => deleteTeamMutation.mutate(selectedTeam.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Team Members
                  </h3>
                  {members.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      No members yet. Add team members to collaborate.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {members.map((member) => (
                        <div 
                          key={member.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                          data-testid={`member-${member.id}`}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{getInitials(member.email)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">{member.email}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getRoleBadgeVariant(member.role)}>
                              {member.role}
                            </Badge>
                            <Button
                              size="icon"
                              variant="ghost"
                              data-testid={`button-remove-member-${member.id}`}
                              onClick={() => removeMemberMutation.mutate(member.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a team to view and manage members</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
