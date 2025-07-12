//מחלקה-רשת
class NetWork{
    static transferRequest(ajax){
        //עדכון על יצירת חיבור לשרת
        ajax.readyState=1;
        //שליחת הבקשה לשרת
        Server.HandlingRequests(ajax);
    }
}