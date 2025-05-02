# API Documentation

## Auth 模块

### register
- **方法**：POST  
- **URL**：`localhost:3000/api/auth/register`  
- **权限**：无权限要求  
- **说明**：注册  
- **请求体**：
```json
{
    "fname": "fname", 
    "lname": "lname", 
    "phone": "123-123-1234", 
    "email": "test1@test.com", 
    "idtype": "Passport", 
    "idno": "123", 
    "username": "testusername", 
    "passwd": "1234567"
}
```


### login
- **方法**：GET  
- **URL**：`localhost:3000/api/auth/login`  
- **权限**：无权限要求  
- **说明**：无  
- **请求体**：
```json
{
    "username": "Admin",
    "password": "123456"
}
```


### setAdmin（管理员）
- **方法**：PUT  
- **URL**：`localhost:3000/api/auth/setAdmin`  
- **权限**：管理员  
- **说明**：设为管理员/非管理员  
- **请求体**：
```json
{
    "id":2,
    "isAdmin":0
}
```


## Customer 模块

### getAllCustomers（管理员）
- **方法**：GET  
- **URL**：`localhost:3000/api/customers`  
- **权限**：管理员  
- **说明**：获取所有customer信息（管理员）  


### getById
- **方法**：GET  
- **URL**：`localhost:3000/api/customers/id?id=1`  
- **权限**：无权限要求  
- **说明**：获取用户基础信息  
- **请求参数**：
  - `id`: （示例：1）


### getInfoById（管理员）
- **方法**：GET  
- **URL**：`localhost:3000/api/customers/info?id=1`  
- **权限**：管理员  
- **说明**：获取用户所有信息（管理员）  
- **请求参数**：
  - `id`: （示例：1）


### updateProfile（登录）
- **方法**：PUT  
- **URL**：`localhost:3000/api/customers/update?id=1`  
- **权限**：登录  
- **说明**：更新用户信息，不更新的值留空  
- **请求参数**：
  - `id`: （示例：1）
- **请求体**：
```json
{
    "fname":"testF",
    "lname": "testL",
    "phone": "987-654-3210",
    "email": "test@test.com",
    "idType": "SSN",
    "idno": "666"
}
```


### resetPassword（登录）
- **方法**：PUT  
- **URL**：`localhost:3000/api/customers/reset`  
- **权限**：登录  
- **说明**：更新密码（登陆）  
- **请求体**：
```json
{
    "oldPassword": "test111",
    "newPassword": "test222"
}
```


### getMyProfile（登录）
- **方法**：GET  
- **URL**：`localhost:3000/api/customers/me`  
- **权限**：登录  
- **说明**：获取当前登录用户的信息（登录）  


## Event 模块

### getAllEvents
- **方法**：GET  
- **URL**：`localhost:3000/api/events?type=HXY_SEMINAR&sdate=&edate=`  
- **权限**：无权限要求  
- **说明**：无  
- **请求参数**：
  - `type`: 留空时查所有type的event（示例：HXY_SEMINAR）
  - `sdate`: startDate，可单独使用查某日的event（示例：）
  - `edate`: endDate，用于和sdate合并为时间段，不可单独使用（示例：）


### getBasicInfoById
- **方法**：GET  
- **URL**：`localhost:3000/api/events/id?id=11`  
- **权限**：无权限要求  
- **说明**：根据eventID获取event的基本信息  
- **请求参数**：
  - `id`: （示例：11）


### getAllInfoById（管理员）
- **方法**：GET  
- **URL**：`localhost:3000/api/events/info?id=1`  
- **权限**：管理员  
- **说明**：获取包括赞助商、预算等全部信息（管理员）  
- **请求参数**：
  - `id`: （示例：1）


### getByName
- **方法**：GET  
- **URL**：`localhost:3000/api/events/search?name=ai`  
- **权限**：无权限要求  
- **说明**：根据event名搜索  
- **请求参数**：
  - `name`: （示例：ai）


### addSeminar（管理员）
- **方法**：POST  
- **URL**：`localhost:3000/api/events/seminar/add`  
- **权限**：管理员  
- **说明**：添加一个seminar（管理员——）  
- **请求体**：
```json
{
    "name": "TESts111",  
    "sdate":"2001-11-22", 
    "edate":"2023-11-22", 
    "topic": 3, 
    "authorNO": 6, 
    "invid": "test111",
    "amount": 11111,
    "sponsorNO": 1
}
```


### addExhibition（管理员）
- **方法**：POST  
- **URL**：`localhost:3000/api/events/exhibition/add`  
- **权限**：管理员  
- **说明**：添加一个exhibition（管理员）  
- **请求体**：
```json
{
    "name": "TEStEE111",  
    "sdate":"2001-11-22", 
    "edate":"2023-11-22", 
    "topic": 3, 
    "authorNO": 6, 
    "expense": 999
}
```


### cancelEvent（管理员）
- **方法**：DELETE  
- **URL**：`localhost:3000/api/events/cancel?id=30`  
- **权限**：管理员  
- **说明**：无  
- **请求参数**：
  - `id`: （示例：30）


### registerExhibition（登录）
- **方法**：POST  
- **URL**：`localhost:3000/api/events/exhibition/register`  
- **权限**：登录  
- **说明**：无  
- **请求体**：
```json
{
    "regID": "test",
    "eventID": 11,
    "userID":  1
}
```


### cancelExhibitionRegisteration（登录）
- **方法**：DELETE  
- **URL**：`localhost:3000/api/events/exhibition/cancel`  
- **权限**：登录  
- **说明**：无  
- **请求体**：
```json
{
    "regID":"test"
}
```


### getByTopic
- **方法**：GET  
- **URL**：`localhost:3000/api/events/topic?topicID=3`  
- **权限**：无权限要求  
- **说明**：无  
- **请求参数**：
  - `topicID`: （示例：3）


### getSeminarByAuthor
- **方法**：GET  
- **URL**：`localhost:3000/api/events/seminar/author?author=1`  
- **权限**：无权限要求  
- **说明**：根据authorID获取seminar  
- **请求参数**：
  - `author`: （示例：1）


## Invoices 模块

### getAllInvoices（管理员）
- **方法**：GET  
- **URL**：`localhost:3000/api/invoices`  
- **权限**：管理员  
- **说明**：无  


### getById（管理员）
- **方法**：GET  
- **URL**：`localhost:3000/api/invoices/id?id=1`  
- **权限**：管理员  
- **说明**：无  
- **请求参数**：
  - `id`: （示例：1）


### getByCustomer（管理员）
- **方法**：GET  
- **URL**：`localhost:3000/api/invoices/customer?id=1`  
- **权限**：管理员  
- **说明**：无  
- **请求参数**：
  - `id`: （示例：1）


### getInvoiceStatus（管理员）
- **方法**：GET  
- **URL**：`localhost:3000/api/invoices/status?rentId=1`  
- **权限**：管理员  
- **说明**：查看invoice是否全额支付及剩余额度  
- **请求参数**：
  - `rentId`: （示例：1）


### getCustomerUnpaid（管理员）
- **方法**：GET  
- **URL**：`localhost:3000/api/invoices/unpaid/customer?id=3`  
- **权限**：管理员  
- **说明**：根据custid获取未支付invoice  
- **请求参数**：
  - `id`: （示例：3）


### getUnpaid（管理员）
- **方法**：GET  
- **URL**：`localhost:3000/api/invoices/unpaid`  
- **权限**：管理员  
- **说明**：获取所有未支付invoice  


### getMyInvoice（登录）
- **方法**：GET  
- **URL**：`localhost:3000/api/invoices/my`  
- **权限**：登录  
- **说明**：获取当前用户的所有invoice  


### getMyUnpaidInvoice（登录）
- **方法**：GET  
- **URL**：`localhost:3000/api/invoices/my/unpaid`  
- **权限**：登录  
- **说明**：获取当前用户未支付invoice  


## Payment 模块

### myPayments（登录）
- **方法**：GET  
- **URL**：`localhost:3000/api/payments/my`  
- **权限**：登录  
- **说明**：获取当前用户的所有支付记录  


### getAllPayment（管理员）
- **方法**：GET  
- **URL**：`localhost:3000/api/payments?sdate=2025-03-01&edate=2025-05-02`  
- **权限**：管理员  
- **说明**：获取所有payment，edate留空查询sdate当天的payment，不留空查询时间段内的payment  
- **请求参数**：
  - `sdate`: （示例：2025-03-01）
  - `edate`: （示例：2025-05-02）


### getPaymentById（管理员）
- **方法**：GET  
- **URL**：`localhost:3000/api/payments/id?id=1`  
- **权限**：管理员  
- **说明**：无  
- **请求参数**：
  - `id`: （示例：1）


### getByInvoice（管理员）
- **方法**：GET  
- **URL**：`localhost:3000/api/payments/invoice?id=1`  
- **权限**：管理员  
- **说明**：无  
- **请求参数**：
  - `id`: （示例：1）


### getByCustomerId（管理员）
- **方法**：GET  
- **URL**：`localhost:3000/api/payments/customer?id=1`  
- **权限**：管理员  
- **说明**：获取某customer对应的所有支付  
- **请求参数**：
  - `id`: （示例：1）


### makePayment（登录）
- **方法**：POST  
- **URL**：`localhost:3000/api/payments/pay`  
- **权限**：登录  
- **说明**：无  
- **请求体**：
```json
{
   "method":"Cash", "amount": 0.0, "rentId": 26

}
```


## Reservation 模块

### myReservation（登录）
- **方法**：GET  
- **URL**：`localhost:3000/api/reservations/my`  
- **权限**：登录  
- **说明**：获取当前用户所有预约，可按日期和房间号筛选  
- **请求体**：
```json
{
    "roomNO":null,
    "rdate": null
}
```


### getAllReservation（管理员）
- **方法**：GET  
- **URL**：`localhost:3000/api/reservations`  
- **权限**：管理员  
- **说明**：无  


### getById（管理员）
- **方法**：GET  
- **URL**：`localhost:3000/api/reservations/id?id=1`  
- **权限**：管理员  
- **说明**：无  
- **请求参数**：
  - `id`: （示例：1）


### searchReservation（管理员）
- **方法**：GET  
- **URL**：`localhost:3000/api/reservations/search`  
- **权限**：管理员  
- **说明**：无  
- **请求体**：
```json
{
    "roomNO" : 101,
    "custNO" : 1,
    "rdate" : "2024-01-05"
}
```


### makeReservation（登录）
- **方法**：POST  
- **URL**：`localhost:3000/api/reservations/reserve`  
- **权限**：登录  
- **说明**：无  
- **请求体**：
```json
{
    "topic": "birthday party",
    "resDate": "2035-10-31",
    "startTime": "15:00:00",
    "endTime":"16:00:00",
    "noi": 2,
    "roomNO": 103
}
```


### cancalReservation（登录）
- **方法**：PUT  
- **URL**：`localhost:3000/api/reservations/reserve/cancel?reservation=21`  
- **权限**：登录  
- **说明**：无  
- **请求参数**：
  - `reservation`: （示例：21）


## Room 模块

### getAllRooms
- **方法**：GET  
- **URL**：`localhost:3000/api/rooms`  
- **权限**：无权限要求  
- **说明**：无  


### getByID
- **方法**：GET  
- **URL**：`localhost:3000/api/rooms/id?id=102`  
- **权限**：无权限要求  
- **说明**：无  
- **请求参数**：
  - `id`: （示例：102）


### getAvailableSlots
- **方法**：GET  
- **URL**：`localhost:3000/api/rooms/slots?roomID=102&date=2024-12-25`  
- **权限**：无权限要求  
- **说明**：无  
- **请求参数**：
  - `roomID`: （示例：102）
  - `date`: （示例：2024-12-25）
- **请求体**：
```json
{
    "capacity": 99
}
```


### addRoom（管理员）
- **方法**：POST  
- **URL**：`localhost:3000/api/rooms/add`  
- **权限**：管理员  
- **说明**：无  
- **请求体**：
```json
{
    "roomNO": 908,
    "capacity": 88
}
```


### deleteRoom（管理员）
- **方法**：DELETE  
- **URL**：`localhost:3000/api/rooms/del?id=908`  
- **权限**：管理员  
- **说明**：无  
- **请求参数**：
  - `id`: （示例：908）


## Author 模块

### getAllAuthors
- **方法**：GET  
- **URL**：`localhost:3000/api/author`  
- **权限**：无权限要求  
- **说明**：无  


### getByID
- **方法**：GET  
- **URL**：`localhost:3000/api/author/id?id=1`  
- **权限**：无权限要求  
- **说明**：根据id获取author详细信息（管理员）  
- **请求参数**：
  - `id`: （示例：1）


### addAuthor（管理员）
- **方法**：POST  
- **URL**：`localhost:3000/api/author/add`  
- **权限**：管理员  
- **说明**：添加新作者（管理员）  
- **请求参数**：
  - `id`: （示例：1）
- **请求体**：
```json
{
    "fname": "fname1", 
    "lname": "lname1", 
    "street": "123 Street St.", 
    "city" : "city", 
    "zipcode": 12345, 
    "email": "email@email.com"
}
```


### updateAuthor（管理员）
- **方法**：PUT  
- **URL**：`localhost:3000/api/author/update?id=12`  
- **权限**：管理员  
- **说明**：更新作者信息，不更新的字段可留空（管理员）  
- **请求参数**：
  - `id`: （示例：12）
- **请求体**：
```json
{
    "fname": "updatef", 
    "lname": "UPDATEL", 
    "street": "123 Street St.", 
    "city" : "city", 
    "zipcode": 12345, 
    "email": "email@email.com"
}
```


### deleteAuthor（管理员）
- **方法**：DELETE  
- **URL**：`localhost:3000/api/author/del?id=11`  
- **权限**：管理员  
- **说明**：根据id软删除author（管理员）  
- **请求参数**：
  - `id`: （示例：11）


## Book 模块

### getAllBooks
- **方法**：GET  
- **URL**：`localhost:3000/api/books`  
- **权限**：无权限要求  
- **说明**：无  


### getById
- **方法**：GET  
- **URL**：`localhost:3000/api/books/id?id=1`  
- **权限**：无权限要求  
- **说明**：无  
- **请求参数**：
  - `id`: （示例：1）


### searchByTitle
- **方法**：GET  
- **URL**：`localhost:3000/api/books/search?title=py`  
- **权限**：无权限要求  
- **说明**：无  
- **请求参数**：
  - `title`: 书名关键词（示例：py）


### searchByAuthor
- **方法**：GET  
- **URL**：`localhost:3000/api/books/search/author?author=smith`  
- **权限**：无权限要求  
- **说明**：无  
- **请求参数**：
  - `author`: （示例：smith）


### rentBook（登录）
- **方法**：POST  
- **URL**：`localhost:3000/api/books/rental/rent`  
- **权限**：登录  
- **说明**：无  
- **请求体**：
```json
{
    "bookNO": 4,
    "copyNO": 1,
    "EReturnDate": "2025-05-13"
}
```


### returnBook（登录）
- **方法**：PUT  
- **URL**：`localhost:3000/api/books/rental/return`  
- **权限**：登录  
- **说明**：无  
- **请求体**：
```json
{
    "bookNO": 4,
    "copyNO": 1
}
```


### addBook（管理员）
- **方法**：POST  
- **URL**：`localhost:3000/api/books/add`  
- **权限**：管理员  
- **说明**：无  
- **请求体**：
```json
{
    "bname" : "aaaaa",
    "topicID" : "6",
    "authID": 4
}
```


### addCopy（管理员）
- **方法**：POST  
- **URL**：`localhost:3000/api/books/add/copy`  
- **权限**：管理员  
- **说明**：无  
- **请求体**：
```json
{
    "bookID": 16
}
```


### deleteCopy（管理员）
- **方法**：DELETE  
- **URL**：`localhost:3000/api/books/del/copy`  
- **权限**：管理员  
- **说明**：无  
- **请求体**：
```json
{
    "bookID" : 16,
    "copyID" : 12
}
```


### deleteBook（管理员）
- **方法**：DELETE  
- **URL**：`localhost:3000/api/books/del?id=16`  
- **权限**：管理员  
- **说明**：无  
- **请求参数**：
  - `id`: （示例：16）


## Sponsor 模块

### getAllSponsors（管理员）
- **方法**：GET  
- **URL**：`localhost:3000/api/sponsors`  
- **权限**：管理员  
- **说明**：无  


### getByID（管理员）
- **方法**：GET  
- **URL**：`localhost:3000/api/sponsors/id?id=1`  
- **权限**：管理员  
- **说明**：无  
- **请求参数**：
  - `id`: （示例：1）


### addSponsor（管理员）
- **方法**：POST  
- **URL**：`localhost:3000/api/sponsors/add`  
- **权限**：管理员  
- **说明**：fname词条用作organization名，插入organization时lname留空  
- **请求体**：
```json
{
    "sponsorType": "HXY_INDIVIDUAL",
    "fname": "test1",
    "lname": "test11"
}
```


### deleteSponsor（管理员）
- **方法**：DELETE  
- **URL**：`localhost:3000/api/sponsors/del?id=21`  
- **权限**：管理员  
- **说明**：无  
- **请求参数**：
  - `id`: （示例：21）


## Topic 模块

### getAllTopics
- **方法**：GET  
- **URL**：`localhost:3000/api/topics`  
- **权限**：无权限要求  
- **说明**：无  


### getById
- **方法**：GET  
- **URL**：`localhost:3000/api/topics/id?id=1`  
- **权限**：无权限要求  
- **说明**：无  
- **请求参数**：
  - `id`: （示例：1）


### getByName
- **方法**：GET  
- **URL**：`localhost:3000/api/topics/search?name=ho`  
- **权限**：无权限要求  
- **说明**：无  
- **请求参数**：
  - `name`: （示例：ho）


### addTopic（管理员）
- **方法**：POST  
- **URL**：`localhost:3000/api/topics/add`  
- **权限**：管理员  
- **说明**：无  
- **请求体**：
```json
{
    "tname":"hahaha"
}
```


### deleteTopic（管理员）
- **方法**：DELETE  
- **URL**：`localhost:3000/api/topics/del?id=11`  
- **权限**：管理员  
- **说明**：无  
- **请求参数**：
  - `id`: （示例：11）

#错误码
error code:
100：缺参数
101: 用户名/作者名重复
102: 找不到对象
103: 书/房间/活动unavailable
104: 密码错误
105: 房间容量不足
106: 时间范围非法


#相关http状态码：
200正常
500系统错误
401缺少权限