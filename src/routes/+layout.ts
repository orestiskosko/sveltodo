import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit'
import { redirect } from '@sveltejs/kit'

export const load = async ({ fetch, data, depends }) => {
    depends('supabase:auth')

    const supabase = createSupabaseLoadClient({
        supabaseUrl: PUBLIC_SUPABASE_URL,
        supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
        event: { fetch },
        serverSession: data.session,
    })

    const {
        data: { session },
    } = await supabase.auth.getSession()

    const { data: profile, error } = await supabase.from('profiles')
        .select(`username`)
        .eq('id', session?.user.id)
        .single()

    return { supabase, session, profile }
}