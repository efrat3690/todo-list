// פונקציה להוספת  אירועים לאחר טעינת התבנית
function addEventListeners() {
    //הוספת אירוע ללחצן כניסה למערכת
    const loginButton = document.getElementById('Login');
    if (loginButton) {
        loginButton.addEventListener('click', function () {
            let history = [];
            history.push('loginPage');
            sessionStorage.setItem("history", JSON.stringify(history));
            if (form["password"].value.length >= 8) {
                let currentUser = { userName: form["userName"].value, password: form["password"].value, tasks: [] }
                //חדשה http יצירת בקשת  
                let xhr = new FXMLHttpRequest();
                xhr.open('GET', "https://www.ToDoList.co.il/" + "login", true);
                xhr.onload = function () {
                    currentUser.tasks = xhr.responseData;
                    localStorage.setItem("currentUser", JSON.stringify(currentUser));
                    //בניית עמוד המשימות של הלקוח לפי התגובה שהתקבלה מהשרת
                    CreatesToDoList(xhr.responseData);
                };
                xhr.onerror = function () {
                    //במקרה של לקוח חדש
                    alert("Your details do not exist, please sign up");
                    //מעבר לעמוד הרשמה
                    showTemplate(signUpPage);
                };
                xhr.send(currentUser);
            }
            else {
                alert("Invalid password - minimum 8 characters are required");
                form["password"].value = "";
            }
        });
    }

    //יצירת אירוע ללחצן התחברות משתמש חדש למערכת
    const signUpButton = document.getElementById('btnSignup');
    if (signUpButton) {
        signUpButton.addEventListener('click', function () {
            let history = JSON.parse(sessionStorage.getItem("history"));
            history.push('signUpPage');
            sessionStorage.setItem("history", JSON.stringify(history));
            //בדיקות תקינות לקלט מהמשתמש
            let currentUser = { userName: form["userName"].value, password: form["password"].value, tasks: [] }
            if (form["userName"].value === "" || form["password"].value === "" || form["Authentication"].value === "") {
                alert("One or more fields are empty");
                form["userName"].value = "";
                form["password"].value = "";
                form["Authentication"].value = "";
            }
            else {
                if (form["password"].value.length >= 8) {
                    if (currentUser.password === form["Authentication"].value) {
                        //חדשה http יצירת בקשת 
                        let xhr = new FXMLHttpRequest();
                        xhr.open('POST', "https://www.ToDoList.co.il/" + "signUp", true);
                        xhr.onload = function () {
                            alert("Your details have been successfully saved in the system");
                            currentUser.tasks = xhr.responseData;
                            localStorage.setItem("currentUser", JSON.stringify(currentUser));
                            //בניית עמוד המשימות של הלקוח לפי התגובה שהתקבלה מהשרת-במקרה הזה עמוד ריק
                            CreatesToDoList(xhr.responseData);
                        };
                        xhr.onerror = function () {
                            //במקרה שלקוח כבר שמור במערכת
                            alert("Your details already exist");
                            currentUser.tasks = xhr.responseData;
                            localStorage.setItem("currentUser", JSON.stringify(currentUser));
                            //בניית עמוד המשימות של הלקוח לפי התגובה שהתקבלה מהשרת
                            CreatesToDoList(currentUser.tasks);
                        };
                        xhr.send(currentUser);
                    }
                    else {
                        //השוואה בין הסיסמה והאימות
                        alert("The authentication and password are not the same");
                        showTemplate(signUpPage);
                        form["userName"].value = currentUser.userName;
                    }
                }
                else {
                    alert("Invalid password - minimum 8 characters are required");
                    form["password"].value = "";
                    form["Authentication"].value = "";
                }
            }
        });
    }

    //יצירת ארוע ללחצן של חיפוש משימה
    const searchButton = document.getElementById('searchBtn');
    if (searchButton) {
        searchButton.addEventListener('click', function () {
            let history = JSON.parse(sessionStorage.getItem("history"));
            history.push('tasksPage');
            sessionStorage.setItem("history", JSON.stringify(history));
            let currentUser = JSON.parse(localStorage.getItem("currentUser"));
            let searchValue = document.getElementById('search').value;
            //חדשה http יצירת בקשת 
            let xhr = new FXMLHttpRequest();
            xhr.open('GET', "https://www.ToDoList.co.il/" + "searchTask", true);
            xhr.onload = function () {
                localStorage.setItem("currentUser", JSON.stringify(currentUser));
                //בניית עמוד המשימות של הלקוח בהתאם לתוצאות החיפוש
                CreatesToDoList(xhr.responseData);
            };
            xhr.onerror = function () {
                //הודעת שגיאה כאשר לא נמצאו תוצאות חיפוש מתאימות
                localStorage.setItem("currentUser", JSON.stringify(currentUser));
                showTemplate(errorPage);
                document.getElementById('Massage').innerHTML = xhr.status + " " + xhr.statusText;

            };
            xhr.send({ Search: searchValue, user: currentUser });
        });
    }


    // יצירת ארוע ללחצן להוספת משימה חדשה 
    const newTaskButton = document.getElementById('NewTask');
    if (newTaskButton) {
        newTaskButton.addEventListener('click', function () {
            let history = JSON.parse(sessionStorage.getItem("history"));
            history.push('addTaskPage');
            const receivedDate = new Date(form["date"].value);
            const currentDate = new Date();
            sessionStorage.setItem("history", JSON.stringify(history));
            if (form["title"].value && form["date"].value && form["Description"].value && receivedDate >= currentDate) {
                let currentUser = JSON.parse(localStorage.getItem("currentUser"));
                let NewTask = { title: form["title"].value, date: form["date"].value, Description: form["Description"].value }
                //חדשה http יצירת בקשת 
                let xhr = new FXMLHttpRequest();
                xhr.open('POST', "https://www.ToDoList.co.il/" + "addTask", true);
                xhr.onload = function () {
                    currentUser.tasks = xhr.responseData;
                    localStorage.setItem("currentUser", JSON.stringify(currentUser));
                    //בניית עמוד המשימות של הלקוח לפי התגובה שהתקבלה מהשרת לאחר הוספת המשימה
                    CreatesToDoList(currentUser.tasks);
                };
                xhr.onerror = function () {
                    //שגיאה במקרה שהמשימה לא נוספה בהצלחה
                    localStorage.setItem("currentUser", JSON.stringify(currentUser));
                    showTemplate(errorPage);
                };
                xhr.send({ task: NewTask, user: currentUser });
            }
            else {
                alert("One or more fields are incorrect.");
                form["title"].value = "";
                form["date"].value = "";
                form["Description"].value = "";
            }
        });
    }

    // הוספת אירוע ללחצן התנתקות
    const LogOutButton = document.getElementById('LogOut');
    if (LogOutButton) {
        LogOutButton.addEventListener('click', LogOut);
    }



    // יצירת ארוע ללחצן-מעבר לטופס רישום למערכת
    const newUserPageButton = document.getElementById('newUser');
    if (newUserPageButton) {
        newUserPageButton.addEventListener('click', function () {
            let history = [];
            history.push('loginPage');
            sessionStorage.setItem("history", JSON.stringify(history));
            showTemplate(signUpPage);
        });
    }

    // // הוספת אירוע ללחצן ניתוב בין עמודים
    const PrevPageButton = document.getElementById('Prev');
    if (PrevPageButton) {
        PrevPageButton.addEventListener('click', function () {
            let currentUser = JSON.parse(localStorage.getItem("currentUser"));
            let history = JSON.parse(sessionStorage.getItem("history"));
            let prevPage = "";
            // if (history) {
            prevPage = history.pop();
            switch (prevPage) {
                case "loginPage": LogOut();
                    break;
                case "signUpPage": LogOut();
                    showTemplate(signUpPage);
                    break;
                case "tasksPage": CreatesToDoList(currentUser.tasks);
                    break;
                case "addTaskPage": showTemplate(addTaskPage);
                    break;
            }

            sessionStorage.setItem("history", JSON.stringify(history));
        });
    }

}

function addEventListenersForTasksBTN() {
    // יצירת ארוע ללחצן-מעבר לטופס הוספת משימה
    const addTaskPageButton = document.getElementById('AddTask');
    if (addTaskPageButton) {
        addTaskPageButton.addEventListener('click', function () {
            let history = JSON.parse(sessionStorage.getItem("history"));
            history.push('tasksPage');
            sessionStorage.setItem("history", JSON.stringify(history));
            showTemplate(addTaskPage);
        });
    }

    //יצירת ארוע ללחצן ניווט להצגת טופס עדכון משימה
    const UpdateTaskForm = document.getElementsByClassName('pencil');
    if (UpdateTaskForm) {
        for (let i = 0; i < UpdateTaskForm.length; i++) {
            UpdateTaskForm[i].addEventListener('click', function () {
                let history = JSON.parse(sessionStorage.getItem("history"));
                history.push('tasksPage');
                sessionStorage.setItem("history", JSON.stringify(history));
                document.getElementById('AllTasks').style.display = 'none';
                document.getElementById('AddTask').style.display = 'none';
                document.getElementById('DivSearch').style.display = 'none';
                document.getElementById('update').style.display = 'block';
                let currentUser = JSON.parse(localStorage.getItem("currentUser"));
                form["title"].value = currentUser.tasks[i].title;
                form["date"].value = currentUser.tasks[i].date;
                form["Description"].value = currentUser.tasks[i].Description;
                form["temp"].value = i;
                document.getElementById('index').innerHTML = "Update task number " + (i+1);
                localStorage.setItem("currentUser", JSON.stringify(currentUser));
            });
        };
    }

    //יצירת ארוע ללחצן עדכון משימה
    const UpdateTaskButton = document.getElementById('UptateTask');
    if (UpdateTaskButton) {
        UpdateTaskButton.addEventListener('click', function () {
            let currentUser = JSON.parse(localStorage.getItem("currentUser"));
            const receivedDate = new Date(form["date"].value);
            const currentDate = new Date();
            if (form["title"].value && form["date"].value && form["Description"].value && receivedDate >= currentDate) {
                let updateTask = { title: form["title"].value, date: form["date"].value, Description: form["Description"].value }
                //חדשה http יצירת בקשת 
                let xhr = new FXMLHttpRequest();
                xhr.open('PUT', "https://www.ToDoList.co.il/" + "updateTask", true);
                xhr.onload = function () {
                    currentUser.tasks = xhr.responseData;
                    localStorage.setItem("currentUser", JSON.stringify(currentUser));
                    //בניית עמוד המשימות של הלקוח לפי התגובה שהתקבלה מהשרת-לאחר עדכון המשימה
                    CreatesToDoList(currentUser.tasks);
                };
                xhr.onerror = function () {
                    //הודעה שגיאה במקרה שלא עודכנה המשימה
                    let history = JSON.parse(sessionStorage.getItem("history"));
                    history.push('tasksPage');
                    sessionStorage.setItem("history", JSON.stringify(history));
                    currentUser.tasks = xhr.responseData;
                    localStorage.setItem("currentUser", JSON.stringify(currentUser));
                    CreatesToDoList(currentUser.tasks);
                };
                xhr.send({ index: form["temp"].value, task: updateTask, user: currentUser });
            }
            else {
                alert("One or more fields are incorrect.");
                form["title"].value = "";
                form["date"].value = "";
                form["Description"].value = "";
            }
        });
}


//יצירת ארוע ללחצן מחיקת משימה
const DeleteTaskButton = document.getElementsByClassName('trash');
if (DeleteTaskButton) {
    for (let i = 0; i < DeleteTaskButton.length; i++) {
        DeleteTaskButton[i].addEventListener('click', function () {
            let currentUser = JSON.parse(localStorage.getItem("currentUser"));
            //במקרה והמשתמש אישר מחיקה
            if (confirm("This task will be permanently deleted")) {
                //חדשה http יצירת בקשת 
                let xhr = new FXMLHttpRequest();
                xhr.open('DELETE', "https://www.ToDoList.co.il/" + "deleteTask", true);
                xhr.onload = function () {
                    currentUser.tasks = xhr.responseData;
                    localStorage.setItem("currentUser", JSON.stringify(currentUser));
                    //בניית עמוד המשימות של הלקוח לפי התגובה שהתקבלה מהשרת-לאחר מחיקת המשימה
                    CreatesToDoList(currentUser.tasks);
                };
                xhr.onerror = function () {
                    //הודעה שגיאה במקרה שלא נמחקה המשימה
                    let history = JSON.parse(sessionStorage.getItem("history"));
                    history.push('tasksPage');
                    sessionStorage.setItem("history", JSON.stringify(history));
                    currentUser.tasks = xhr.responseData;
                    localStorage.setItem("currentUser", JSON.stringify(currentUser));
                    CreatesToDoList(currentUser.tasks);
                };
                xhr.send({ index: i, user: currentUser });
            }
            //אם לא אישר מציג את דף המשימות המקורי
            else {
                CreatesToDoList(currentUser.tasks);
            }
        });
    }
}
}

//פונקציה ליציאה מהמערכת
function LogOut() {
    if (confirm("You have logged out?")) {
        localStorage.removeItem("currentUser");
        showTemplate(loginPage);
    }
}

//בניית עמוד המשימות ללקוח לפי רשימת המשימות שהתקבלה 
function CreatesToDoList(ListTasks) {
    document.getElementById('DivSearch').style.display = 'block';
    let temp = "";
    if (ListTasks && ListTasks.length > 0) {
        for (let i = 0; i < ListTasks.length; i++) {
            temp += "<div class='task'><p>Task Title: ";
            temp += ListTasks[i].title;
            temp += "</p><p>Date: ";
            temp += ListTasks[i].date;
            temp += "</p><p>Task Description: ";
            temp += ListTasks[i].Description;
            temp += "</p><div class='task-buttons'><button class='pencil' Name = '" + i;
            temp += "'><i class='fas fa-pencil-alt'></i></button><button class='trash' Name = '" + i;
            temp += "'><i class='fas fa-trash-alt'></i></button></div></div>";
        }
        showTemplate(tasksPage);
        document.getElementById('AllTasks').innerHTML = temp;
        //בניית ארועים ללחצנים של עדכון ומחיקה לאחר שנוצרו
    }
    else {
        showTemplate(tasksPage);
    }
    addEventListenersForTasksBTN();
}
