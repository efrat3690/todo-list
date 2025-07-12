// קבועים לקבלת האלמנטים של התבניות
const loginPage = document.getElementById('loginPage');
const signUpPage = document.getElementById('signUpPage');
const tasksPage = document.getElementById('tasksPage');
const addTaskPage = document.getElementById('addTaskPage');
const errorPage = document.getElementById('ErrorPage');

//פתיחה ראשונה עמוד כניסה כברירת מחדל
showTemplate(loginPage);

//פונקציה לניווט בין העמודים - תגיות טמפלט
function showTemplate(templateId) {
    if(templateId == loginPage){
        document.getElementById('Prev').style.display='none';
    }else{
        document.getElementById('Prev').style.display='block';
    }
    //מחיקת כל האלמנטים הקיימים בתצוגה של התבניות
    const display = document.getElementById('Display');
    if (display) {
        while (display.firstChild) {
            display.removeChild(display.firstChild);
        }
    }
    //יצירת התבנית והוספתה לתצוגת הדף
    const clone = templateId.content.cloneNode(true);
    display.appendChild(clone);
    if(templateId != tasksPage){
        document.getElementById('DivSearch').style.display='none';
        addEventListeners();
    }
}
