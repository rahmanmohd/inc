import React, { useEffect, useState } from 'react'
import { supabase, getTable } from '../lib/supabase'
import type { Tables } from '../types/supabase-latest'

export const SupabaseTest: React.FC = () => {
  const [profiles, setProfiles] = useState<Tables<'profiles'>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    testSupabaseConnection()
  }, [])

  const testSupabaseConnection = async () => {
    try {
      setLoading(true)
      
      // Test basic connection
      const { data, error: connectionError } = await supabase
        .from('profiles')
        .select('*')
        .limit(5)
      
      if (connectionError) {
        throw connectionError
      }
      
      setProfiles(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const testTypedTable = async () => {
    try {
      // Test typed table helper
      const { data, error } = await getTable('profiles')
        .select('id, email, role')
        .limit(3)
      
      if (error) throw error
      console.log('Typed table test successful:', data)
    } catch (err) {
      console.error('Typed table test failed:', err)
    }
  }

  if (loading) {
    return <div className="p-4">Testing Supabase connection...</div>
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <h3 className="text-red-800 font-semibold">Connection Error</h3>
        <p className="text-red-600">{error}</p>
        <p className="text-sm text-red-500 mt-2">
          Make sure you have set up your .env file with VITE_SUPABASE_ANON_KEY
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded">
      <h3 className="text-green-800 font-semibold">✅ Supabase Connection Successful!</h3>
      <p className="text-green-600">Found {profiles.length} profile(s) in database</p>
      
      <button 
        onClick={testTypedTable}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Test Typed Tables
      </button>
      
      {profiles.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium">Sample Profiles:</h4>
          <ul className="mt-2 space-y-1">
            {profiles.slice(0, 3).map((profile) => (
              <li key={profile.id} className="text-sm">
                {profile.email} - {profile.role}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
