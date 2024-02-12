import { redirect, type Actions, fail } from "@sveltejs/kit"
import type { PageServerLoad } from "../$types"

export const load: PageServerLoad = async ({ locals: { supabase, getSession } }) => {
    const session = await getSession()

    if (!session) {
        throw redirect(303, '/')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select(`avatar_url`)
        .eq('id', session.user.id)
        .single()

    const { data: todos } = await supabase
        .from('todos')
        .select()
        .order('created_at', { ascending: false })

    return { session, profile, todos }
}

export const actions = {
    addToDo: async ({ request, locals: { supabase, getSession } }) => {
        const session = await getSession()
        const data = await request.formData()

        await supabase
            .from('todos')
            .insert({ content: data.get('content'), user_id: session.user.id })
    },
    updateToDo: async ({ request, locals: { supabase } }) => {
        const data = await request.formData()
        var id = data.get('id')
        var completed = data.get('completed') === 'on';

        const { error } = await supabase
            .from('todos')
            .update({ completed: completed })
            .eq('id', id)

        if (error)
            return fail(500, error)
    },
    deleteToDo: async ({ request, locals: { supabase } }) => {
        const data = await request.formData()
        var todoId = data.get('id')

        const { error } = await supabase
            .from('todos')
            .delete()
            .eq('id', todoId)

        if (error)
            return fail(500, error)
    }
} satisfies Actions