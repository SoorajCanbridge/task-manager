
## Prerequisites

- Node.js 18 or higher
- npm
- A [Supabase](https://supabase.com) account

## Database Setup

1. Create a new project in Supabase.
2. Open the **SQL Editor** in your Supabase dashboard.
3. Copy and run the **entire** contents of [`backend/sql/schema.sql`](backend/sql/schema.sql).
4. Confirm the query output lists both `users` and `tasks` tables.
5. Go to **Project Settings → API** and copy:
   - Project URL
   - `service_role` key (keep this secret — backend only)

Verify the connection before seeding:

```bash
cd backend
npm run check:db
```

If you see `Could not find the table 'public.users' in the schema cache`, the schema SQL has not been run yet (or the API cache has not refreshed). Re-run `schema.sql` — it includes `NOTIFY pgrst, 'reload schema'` to refresh the cache automatically.


## Environment Variables

### Backend

Copy the example file and fill in your values:

```bash
cd backend
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `7d`) |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Supabase **secret** / service_role key (not the publishable anon key) |
| `ADMIN_EMAIL` | Email for the seeded admin account |
| `ADMIN_PASSWORD` | Password for the seeded admin account |
| `CORS_ORIGIN` | Frontend URL (default: `http://localhost:5173`) |

### Frontend

```bash
cd frontend
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend URL (default: `http://localhost:5000`) |

## Running the Application

### Backend

```bash
cd backend
npm install
npm run seed    # creates/updates the admin user
npm run dev     # starts server on http://localhost:5000
```

### Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev     # starts app on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Default Admin Account

After running `npm run seed`, sign in with the credentials from your `.env`:

- Email: value of `ADMIN_EMAIL`
- Password: value of `ADMIN_PASSWORD`

Change the admin password after your first login in production.

## API Reference

### Authentication

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/register` | `{ email, password }` | Register a new user (role: user) |
| POST | `/login` | `{ email, password }` | Login and receive JWT |

### Tasks (requires `Authorization: Bearer <token>`)

| Method | Endpoint | Query / Body | Description |
|--------|----------|--------------|-------------|
| GET | `/tasks` | `page`, `limit`, `search`, `status` | List tasks with pagination |
| POST | `/tasks` | `{ title, description?, status? }` | Create a task |
| PUT | `/tasks/:id` | `{ title?, description?, status? }` | Update a task |
| DELETE | `/tasks/:id` | — | Delete a task |

### Response Examples

**GET /tasks**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Finish report",
      "description": "Q4 summary",
      "status": "pending",
      "created_at": "2026-01-15T10:00:00Z",
      "user_id": "uuid",
      "owner_email": "user@example.com"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### HTTP Status Codes

| Code | When |
|------|------|
| 200 | Success |
| 201 | Resource created |
| 400 | Validation error |
| 401 | Missing or invalid token |
| 403 | Not allowed (e.g. editing another user's task) |
| 404 | Task not found |
| 409 | Email already registered |
| 500 | Server error |

## Role Behavior

| Action | Admin | User |
|--------|-------|------|
| View tasks | All tasks | Own tasks only |
| Create task | Yes | Yes |
| Update task | Any task | Own tasks only |
| Delete task | Any task | Own tasks only |

Authorization is enforced on the server — the frontend reflects roles for UX but never controls access.


