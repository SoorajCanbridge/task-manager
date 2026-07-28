const supabase = require('../config/db');



function pagination(query) {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 10));
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    return { page, limit, from, to };
}

function totalPage(page, limit, total) {
    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
    return { page, limit, total, totalPages };
}


function filters(query, { userId, search, status }) {
    if (userId) query = query.eq('user_id', userId);
    if (status) query = query.eq('status', status);
    if (search) query = query.ilike('title', `%${search}%`);
    return query;
}


function canModifyTask(user, task) {
    if (user.role === 'admin') return true;
    return task.user_id === user.id;
}

async function findTaskById(id) {
    const { data, error } = await supabase
        .from('tasks')
        .select('id, title, description, status, created_at, user_id')
        .eq('id', id)
        .maybeSingle();

    if (error) throw error;
    return data;
}

async function getTasks(req, res, next) {
    try {
        const { page, limit, from, to } = pagination(req.query);
        const { search, status } = req.query;
        const isAdmin = req.user.role === 'admin';
        let countQuery = supabase
            .from('tasks')
            .select('*', { count: 'exact', head: true });
        countQuery = filters(countQuery, {
            userId: isAdmin ? null : req.user.id,
            search: search || null,
            status: status || null,
        });
        const { count, error: countError } = await countQuery;
        if (countError) throw countError;
        let dataQuery = supabase
            .from('tasks')
            .select('id, title, description, status, created_at, user_id, users(email)')
            .order('created_at', { ascending: false })
            .range(from, to);
        dataQuery = filters(dataQuery, {
            userId: isAdmin ? null : req.user.id,
            search: search || null,
            status: status || null,
        });
        const { data, error } = await dataQuery;
        if (error) throw error;
        const tasks = data.map((task) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            created_at: task.created_at,
            user_id: task.user_id,
            owner_email: task.users?.email ?? null,
        }));
        res.json({
            data: tasks,
            pagination: totalPage(page, limit, count ?? 0),
        });
    } catch (err) {
        next(err);
    }
}



async function createTask(req, res, next) {
    try {
        const { title, description, status } = req.body;
        const { data, error } = await supabase
            .from('tasks')
            .insert({
                user_id: req.user.id,
                title,
                description: description || null,
                status: status || 'pending',
            })
            .select('id, title, description, status, created_at, user_id')
            .single();
        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        next(err);
    }
}


async function updateTask(req, res, next) {
    try {
        const { id } = req.params;
        const existing = await findTaskById(id);
        if (!existing) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (!canModifyTask(req.user, existing)) {
            return res.status(403).json({ message: 'You can only update your own tasks' });
        }
        const updates = {};
        if (req.body.title !== undefined) updates.title = req.body.title;
        if (req.body.description !== undefined) updates.description = req.body.description;
        if (req.body.status !== undefined) updates.status = req.body.status;
        const { data, error } = await supabase
            .from('tasks')
            .update(updates)
            .eq('id', id)
            .select('id, title, description, status, created_at, user_id')
            .single();
        if (error) throw error;
        res.json(data);
    } catch (err) {
        next(err);
    }
}



async function deleteTask(req, res, next) {
    try {
        const { id } = req.params;
        const existing = await findTaskById(id);
        if (!existing) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (!canModifyTask(req.user, existing)) {
            return res.status(403).json({ message: 'You can only delete your own tasks' });
        }
        const { error } = await supabase.from('tasks').delete().eq('id', id);
        if (error) throw error;
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
};
