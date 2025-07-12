//http-מחלקת בקשת 

class FXMLHttpRequest {
    constructor() {
        this.method = "";
        this.url = "";
        this.async = true;
        this.body = "";
        this.readyState = 0;//הבקשה לא אותחלה
        this.responseData = "";
        this.status = 0;
        this.statusText = "";
        this.onload = null;
        this.onerror = null;
    }

    //פונקציה הפותחת בקשה חדשה ומעתחלת בנתונים שנשלחו
    open(method, url, async) {
        this.method = method;
        this.url = url;
        this.async = async;
    }
    
    //פונקציה האחראית על שליחת הבקשת לרשת וכן על בדיקת התגובה שחזרה מהשרת דרך הרשת
    send(body) {
        this.body = body;
        NetWork.transferRequest(this);
        if (this.readyState === 4) {
            if (this.status >= 200 && this.status < 299) {
                if(this.onload){
                    this.onload();
                } 
            }
            else {
                if(this.onerror){
                    this.onerror();
                }
            }
        }
    }

}
