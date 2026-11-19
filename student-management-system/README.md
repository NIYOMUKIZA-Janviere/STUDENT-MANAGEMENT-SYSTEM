# Student Management System (React JS)

A responsive administrator dashboard for managing student records.

## Features
- Dashboard statistics: total, active, inactive students and courses
- Add, edit and delete student records
- Search by student name, email, class or course
- Filter students by active/inactive status
- Export the filtered student list to CSV
- Automatically saves records in the browser using localStorage
- Responsive layout for desktop, tablet and mobile

## Requirements
- Node.js (LTS recommended)
- npm

## Run with Git Bash

1. Extract `student-management-system.zip`.
2. Open Git Bash inside the extracted `student-management-system` folder.
3. Run:

```bash
npm install
npm run dev
```

4. Open the local URL printed in the terminal (usually `http://localhost:5173`).

## Create a production build

```bash
npm run build
```

The production files will be created in the `dist` folder.

## Important notes
- This is a front-end learning/demo project. It stores records in the current browser on the current device.
- It does not yet include a real login system, server, shared database, or role-based security. Do not use it for confidential student information until a secure backend and authentication are added.
- The sample records are demonstration data and can be deleted or edited.
