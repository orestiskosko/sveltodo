import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, locals: { getSession } }) => {
    const session = await getSession()

    // if the user is already logged in return them to the account page
    if (session) {
        throw redirect(303, '/todos')
    }

    return { url: url.origin }
}

export const actions = {
    login: async ({ url, request, locals: { supabase } }) => {
        const formData = await request.formData();

        const { data, authError } = await supabase.auth.signInWithOtp({
            email: formData.get("email"),
            options: {
                emailRedirectTo: `${url.origin}/auth/callback`
            }
        })

        if (authError) {
            error(authError.status, authError);
        }

        return data;
    }
}