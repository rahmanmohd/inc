import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HackathonManagement } from './HackathonManagement'
import { IncubationManagement } from './IncubationManagement'
import { MvpLabManagement } from './MvpLabManagement'
import { IncLabManagement } from './IncLabManagement'
import { 
  Zap, 
  Building, 
  Code, 
  FlaskConical,
  Users,
  TrendingUp,
  Calendar,
  Star
} from 'lucide-react'

export const ProgramsManagement: React.FC = () => {
  // Summary statistics for all programs
  const programStats = {
    hackathons: { total: 8, active: 2, participants: 450 },
    incubation: { total: 12, active: 3, startups: 89 },
    mvpLab: { total: 4, active: 1, participants: 40 },
    incLab: { total: 6, active: 2, researchers: 23 }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
            Programs Management
          </h2>
          <p className="text-muted-foreground">
            Manage all Inc Combinator programs from one central location
          </p>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Hackathons</CardTitle>
            <Zap className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {programStats.hackathons.active}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Active programs
            </p>
            <div className="flex items-center justify-between mt-3">
              <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                {programStats.hackathons.total} total
              </Badge>
              <span className="text-xs text-muted-foreground">
                {programStats.hackathons.participants} participants
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Incubation</CardTitle>
            <Building className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {programStats.incubation.active}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Active programs
            </p>
            <div className="flex items-center justify-between mt-3">
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                {programStats.incubation.total} total
              </Badge>
              <span className="text-xs text-muted-foreground">
                {programStats.incubation.startups} startups
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">MVP Lab</CardTitle>
            <Code className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {programStats.mvpLab.active}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Active programs
            </p>
            <div className="flex items-center justify-between mt-3">
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                {programStats.mvpLab.total} total
              </Badge>
              <span className="text-xs text-muted-foreground">
                {programStats.mvpLab.participants} participants
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Inc Lab</CardTitle>
            <FlaskConical className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {programStats.incLab.active}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Active programs
            </p>
            <div className="flex items-center justify-between mt-3">
              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                {programStats.incLab.total} total
              </Badge>
              <span className="text-xs text-muted-foreground">
                {programStats.incLab.researchers} researchers
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Program Sections */}
      <Card className="shadow-lg border-0 bg-black/90 backdrop-blur-sm">
        <CardContent className="p-8">
          <Tabs defaultValue="hackathons" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 h-14 p-1 bg-gray-800/80 border border-gray-700 rounded-xl">
              <TabsTrigger 
                value="hackathons" 
                className="flex items-center gap-2 font-medium text-gray-300 hover:text-white data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
              >
                <Zap className="h-4 w-4" />
                Hackathons
              </TabsTrigger>
              <TabsTrigger 
                value="incubation" 
                className="flex items-center gap-2 font-medium text-gray-300 hover:text-white data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
              >
                <Building className="h-4 w-4" />
                Incubation
              </TabsTrigger>
              <TabsTrigger 
                value="mvplab" 
                className="flex items-center gap-2 font-medium text-gray-300 hover:text-white data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
              >
                <Code className="h-4 w-4" />
                MVP Lab
              </TabsTrigger>
              <TabsTrigger 
                value="inclab" 
                className="flex items-center gap-2 font-medium text-gray-300 hover:text-white data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
              >
                <FlaskConical className="h-4 w-4" />
                Inc Lab
              </TabsTrigger>
            </TabsList>

            <TabsContent value="hackathons" className="space-y-6">
              <HackathonManagement />
            </TabsContent>

            <TabsContent value="incubation" className="space-y-6">
              <IncubationManagement />
            </TabsContent>

            <TabsContent value="mvplab" className="space-y-6">
              <MvpLabManagement />
            </TabsContent>

            <TabsContent value="inclab" className="space-y-6">
              <IncLabManagement />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
