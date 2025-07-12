class DataBase {
    // פונקציה שבודקת האם המשתמש קיים במערך המשתמשים
    static getUserByNameAndPassword(name,password){
        let usersArray = JSON.parse(localStorage.getItem("users"));
        if (!usersArray) {
            usersArray = [];
        }
        for (let i = 0; i < usersArray.length; i++) {
            if (usersArray[i].userName == name && usersArray[i].password == password) {
                return usersArray[i];
            }
        }
        return null;
    }

    //פונקציה לקבלת המשימות של לקוח קיים
    static getTasksForUser(user){
        let existUser=DataBase.getUserByNameAndPassword(user.userName,user.password);
        if(existUser){
            return existUser.tasks;
        }
        return null;
    }

    //פונקציה להוספת משתמש חדש למערכת
    static AddUser(user) {
        let usersArray = JSON.parse(localStorage.getItem("users"));
        if (!usersArray) {
            usersArray = [];
        }
        usersArray.push(user);
        localStorage.setItem("users", JSON.stringify(usersArray));
    }

    //חיפוש משימה במערך המשימות
    static GetTasksBySearch(user, query) {
        let tasks = this.getTasksForUser(user);
        let results = [];
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].title.includes(query)) {
                results.push(tasks[i]);
            }
        }
        return results;
    }

    // בקשת פוסט - הוספת משימה למערך
    static AddTask(task, user) {
        let usersArray = JSON.parse(localStorage.getItem("users"));
        for (let i = 0; i < usersArray.length; i++) {
            if (usersArray[i].userName == user.userName && usersArray[i].password == user.password) {
                user.tasks.push(task);
                usersArray[i].tasks.push(task);
            }
        }
        localStorage.setItem("users", JSON.stringify(usersArray));
        return user.tasks;
    }

    //בקשת דליט - מחיקת משימה מהמערך
    static DeleteTask(index, user) {
        let usersArray = JSON.parse(localStorage.getItem("users"));
        let ArrayTasks = user.tasks;
        // בדיקה אם יש משימות במערך והאינדקס תקין
        if (ArrayTasks && ArrayTasks.length > 0 && index >= 0 && index < ArrayTasks.length) {
            // מחיקת המשימה מהמערך
            ArrayTasks.splice(index, 1);
            for (let i = 0; i < usersArray.length; i++) {
                if (usersArray[i].userName == user.userName && usersArray[i].password == user.password) {
                    user.tasks = ArrayTasks;
                    usersArray[i].tasks = ArrayTasks;
                }
            }
            localStorage.setItem("users", JSON.stringify(usersArray));
            return user.tasks;       
        }
    }

    //בקשת פוט - עדכון משימה במערך
    static UpdateTask(index, task, user) {
        let usersArray = JSON.parse(localStorage.getItem("users"));
        let ArrayTasks = user.tasks;
        for (let i = 0; i < usersArray.length; i++) {
            if (usersArray[i].userName == user.userName && usersArray[i].password == user.password) {
                ArrayTasks[index] = task;
                user.tasks = ArrayTasks;
                usersArray[i] = user;
            }
        }
        localStorage.setItem("users", JSON.stringify(usersArray));
        return user.tasks;
    }
}
