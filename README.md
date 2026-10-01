# Student Register — CRUD Web App (Node.js + Express + MongoDB, MVC)

## 1. Run it
1. Install Node.js (v18+) and MongoDB Community (or create a free MongoDB Atlas cluster).
2. `cd student-register && npm install`
3. Set `MONGO_URI` in `.env` to your MongoDB connection string.
4. Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `.env` to credentials of your choice.
5. `npm start` → open http://localhost:3000

The public page lets visitors view students and register. Student IDs are only shown in `/admin`; edit and delete actions are also restricted to that route. Admins sign in at `/admin/login` using the credentials in `.env`. Use HTTPS when deploying outside your local machine.

## 2. Directory structure (MVC)
```
student-register/
├── server.js                    # app entry: middleware + DB connection
├── models/Student.js            # MODEL      – schema, talks to MongoDB
├── views/                       # VIEW       – EJS templates
│   ├── index.ejs                #   student list + search
│   ├── form.ejs                 #   create / edit form
│   └── partials/header|footer.ejs
├── controllers/studentController.js  # CONTROLLER – CRUD logic
├── routes/studentRoutes.js      # URL → controller mapping
└── public/ (css/style.css, js/theme.js)   # styling + day/dark toggle
```
Request flow: Browser → Route → Controller → Model → MongoDB → Controller → View → Browser.

## 3. CRUD map
| Operation | HTTP route | Mongoose call | MongoDB shell |
|---|---|---|---|
| Create | POST /students | `Student.create()` | `insertOne()` |
| Read | GET / (+ `?q=`) and GET /admin | `Student.find()` | `find()` |
| Update | PUT /admin/students/:id | `findByIdAndUpdate()` | `updateOne()` |
| Delete | DELETE /admin/students/:id | `findByIdAndDelete()` | `deleteOne()` |

## 4. NoSQL (MongoDB) guideline
- **Concept:** NoSQL = "not only SQL". MongoDB stores flexible JSON-like **documents** (BSON), no fixed tables or JOINs.
- **Vocabulary:** database → database | table → **collection** | row → **document** | column → **field** | primary key → **_id** (auto ObjectId).
- **Example document** (collection `students`):
```json
{ "_id": "ObjectId(...)", "studentId": "66010123", "fullName": "Somchai Jaidee",
  "email": "somchai@uni.ac.th", "major": "Computer Science", "year": 2,
  "courses": ["Database Systems", "Web Development"] }
```
- **Embedding:** `courses` is an array inside the student document, so one read returns everything (SQL would need a join table). Use *referencing* instead when data is large or shared by many documents.
- **Try in mongosh:**
```js
use student_register
db.students.insertOne({studentId:"1", fullName:"Test", email:"t@x.com", major:"IT", year:1, courses:["DB"]})
db.students.find({ major: "IT" })
db.students.updateOne({studentId:"1"}, { $set: { year: 2 }, $push: { courses: "Web" } })
db.students.deleteOne({studentId:"1"})
```
- **Tips:** unique index (`studentId`) prevents duplicates; schemas (Mongoose) add validation; MongoDB Compass gives a GUI to view data.

## 5. Day / dark mode
`public/js/theme.js` toggles `data-theme="light|dark"` on `<html>` and saves it in `localStorage`. CSS variables in `style.css` switch the palette while keeping the colorful accents.

## 6. Submission checklist
1. Presentation: problem, MVC diagram, NoSQL reason, directory structure, screenshots, demo.
2. Document: this README + screenshots of list, create, edit, delete, dark mode.
3. Source code: zip of this folder (without `node_modules`).
