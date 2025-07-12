//מחלקת שרת
class Server {
    static HandlingRequests(ajax) {
        let parts = ajax.url.split('/');
        let lastPart = parts.pop();
        ajax.readyState = 2;//ההודעה התקבלה אצל השרת
        switch (ajax.method) {
            case 'GET': ajax.readyState = 3;//הבקשה בעיבוד
                switch (lastPart) {
                    case 'login': Server.Login(ajax);
                        break;
                    case 'searchTask': Server.searchTasks(ajax);
                        break;
                    default: ajax.status = 404;
                        ajax.statusText = "Not Found";
                        break;
                };
                break;
            case 'POST': ajax.readyState = 3;//הבקשה בעיבוד
                switch (lastPart) {
                    case 'signUp': Server.SignUp(ajax);
                        break;
                    case 'addTask': Server.AddTask(ajax);
                        break;
                    default: ajax.status = 404;
                        ajax.statusText = "Not Found";
                        break;
                };
                break;
            case 'PUT': ajax.readyState = 3;//הבקשה בעיבוד
                switch (lastPart) {
                    case 'updateTask': Server.UpdateTask(ajax);
                        break;
                    default: ajax.status = 404;
                        ajax.statusText = "Not Found";
                        break;
                };
                break;
            case 'DELETE': ajax.readyState = 3;//הבקשה בעיבוד
                switch (lastPart) {
                    case 'deleteTask': Server.DeleteTask(ajax);
                        break;
                    default: ajax.status = 404;
                        ajax.statusText = "Not Found";
                        break;
                };
                break;
            default: ajax.status = 405;
                ajax.statusText = "Method Not Allowed";
                break;
        }
        ajax.readyState = 4;//טיפול בבקשה הסתיים בצד השרת
    }

    //כניסה למערכת
    static Login(ajax) {
        //לקיחת הנתונים מהאוביקט שנשלח ברשת
        let currentUserTask;
        try {
            currentUserTask = DataBase.getTasksForUser(ajax.body);
            if (currentUserTask) {
                ajax.status = 200;
                ajax.statusText = "OK";
            }
            else {
                ajax.status = 401;
                ajax.statusText = "Unauthorized";
            }
            ajax.responseData = currentUserTask;
        }
        catch (e) {
            ajax.status = 503;
            ajax.statusText = "Service Unavailable, try again later";
        }
    }

    //התחברות משתמש חדש למערכת
    static SignUp(ajax) {
        let currentUserTask;
        try {
            currentUserTask = DataBase.getTasksForUser(ajax.body);
            if (!currentUserTask) {
                DataBase.AddUser(ajax.body);
                ajax.status = 200;
                ajax.statusText = "OK";
                ajax.responseData = [];
            }
            else {
                ajax.status = 409;
                ajax.statusText = "Conflict";
                ajax.responseData = currentUserTask;
            }
        }
        catch (e) {
            ajax.status = 503;
            ajax.statusText = "Service Unavailable";
        }
    }

    //פונקציה לחיפוש משימות
    static searchTasks(ajax) {
        let body;
        let ArrayQuery;
        try {
            body = ajax.body;
            ArrayQuery = DataBase.GetTasksBySearch(body.user, body.Search);
            if (ArrayQuery.length != 0) {
                ajax.status = 200;
                ajax.statusText = "OK";
            }
            else {
                ajax.status = 409;
                ajax.statusText = "Conflict";
            }
            ajax.responseData = ArrayQuery;
        }
        catch (e) {
            ajax.status = 503;
            ajax.statusText = "Service Unavailable";
        }
    }

    //פונקציה להוספת משימה חדשה
    static AddTask(ajax) {
        let body;
        let newArray;
        try {
            body = ajax.body;
            newArray = DataBase.AddTask(body.task, body.user);
            if (newArray) {
                ajax.status = 200;
                ajax.statusText = "OK";
                ajax.responseData = newArray;
            }
        }
        catch (e) {
            ajax.status = 503;
            ajax.statusText = "Service Unavailable";
        }
    }

    //פונקציה לעדכון משימה    
    static UpdateTask(ajax) {
        let body;
        let newArray;
        try {
            body = ajax.body;
            newArray = DataBase.UpdateTask(body.index, body.task, body.user);
            if (newArray) {
                ajax.status = 200;
                ajax.statusText = "OK";
                ajax.responseData = newArray;
            }
        }
        catch (e) {
            ajax.status = 503;
            ajax.statusText = "Service Unavailable";
        }
    }

    //פונקציה למחיקת משימה מהמערך
    static DeleteTask(ajax) {
        let body;
        let newArray;
        try {
            body = ajax.body;
            newArray = DataBase.DeleteTask(body.index, body.user);
            if (newArray) {
                ajax.status = 200;
                ajax.statusText = "OK";
                ajax.responseData = newArray;
            }
        }
        catch (e) {
            ajax.status = 503;
            ajax.statusText = "Service Unavailable";
        }
    }
}







