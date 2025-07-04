# 🌱 Volunteer Management Platform

A full-stack web application that connects **volunteers** with **NGOs** to participate in meaningful social opportunities like events, forums, and donations.

---
## <a href="https://ngo-management-1.onrender.com/">live</a>
## 🚀 Features

### 👤 Authentication
- User roles: Volunteer, NGO
- JWT-based secure login/signup

### 🎯 Opportunities
- NGOs can create volunteering opportunities
- Volunteers can browse, filter, and apply

### 💬 Forum
- Community discussions and Q&A
- Reply to posts, upvote, and engage

### 🎁 Donations
- Volunteers can donate to NGOs
- Track donation history
- NGOs can analyze donations via dashboards

### 📆 Events
- NGOs can post events
- Volunteers can join and see upcoming events

### 🔔 Notifications
- Scheduled reminders for upcoming deadlines
- Forum & opportunity alerts

---

## 🛠️ Tech Stack

| Layer         | Technology                                  |
|--------------|---------------------------------------------|
| Frontend     | React, Vite, TailwindCSS                    |
| Backend      | Node.js, Express, TypeScript                |
| Database     | MongoDB, Mongoose                           |
| Authentication | JWT                                      |
| Scheduling   | node-cron (reminders, updates)              |
| Deployment   | Render (Backend) + Vercel (Frontend)        |

---

## 🧪 Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/volunteer-management.git
cd volunteer-management
