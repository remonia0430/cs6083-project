# API Documentation

## 所有需要登录的request应加上请求头：
key: Authorization  body: "Bearer "+登录时返回的token
key: Content-Type   body: "application/json"

## Auth 模块

### register
- **方法**：POST  
- **URL**：`https://cs6083-project.onrender.com/api/auth/register`  
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
- **URL**：`https://cs6083-project.onrender.com/api/auth/login`  
- **权限**：无权限要求  
- **说明**：无  
- **请求体**：
```json
{
    "username": "Admin",
    "passwd": "123456"
}
```
- **返回值**：
```json
{
  "success": true,
  "isAdmin": false,
  "token": token
}
```


### setAdmin（管理员）
- **方法**：PUT  
- **URL**：`https://cs6083-project.onrender.com/api/auth/setAdmin`  
- **权限**：管理员  
- **说明**：设为管理员/非管理员  
- **请求体**：
```json
{
    "id":2,
    "isAdmin":0
}
```

### requestResetPassword
- **方法**：PUT  
- **URL**：`https://cs6083-project.onrender.com/api/auth/reset/request`  
- **权限**：
- **说明**：发送修改邮箱请求，先验证该邮箱是否注册，再向邮箱发送验证码；  
- **请求体**：
```json
{
    "email":"example@email.com"
}
```

### verifyToken
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/auth/reset/verify`  
- **权限**：
- **说明**：验证输入的验证码
- **请求体**：
```json
{
    "token":"D73G8F",
    "email":"example@email.com"
}
```
- **返回值**：
```json
{
  "success": true,
  "message": "Token is valid",
  "token": token
}
```


### resetPassword
- **方法**：PUT  
- **URL**：`https://cs6083-project.onrender.com/api/auth/reset`  
- **权限**：验证token
- **说明**：更新密码  
- **请求体**：
```json
{
    "newPasswd":"newPasswd"
}
```



## Customer 模块

### getAllCustomers（管理员）
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/customers`  
- **权限**：管理员  
- **说明**：获取所有customer信息（管理员）  
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "customers": [
        {
            "CUSTNO": 1,
            "CFNAME": "pig",
            "CLNAME": "piggy",
            "PHONE": "987-654-3210",
            "EMAIL": "admin.a@email.com",
            "IDTYPE": "Passport",
            "IDNO": "666",
            "IS_ADMIN": 1,
            "USERNAME": "Admin",
            "PASSWD": "$2b$10$WvKay/jzmbUCxAoH1G0YvOoAuJ7XfDRS3DwKBHXo8YvkRNoxSM1HK",
            "TOKEN": null,
            "EXPIRATION": null
        }
      ]
}
``` 

### getById
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/customers/id?id=1`  
- **权限**：无权限要求  
- **说明**：获取用户基础信息  
- **请求参数**：
  - `id`: （示例：1）
- **返回值**：
```json
{
  "success": true,
  "customer": {
    "Username": "Username",
    "CustomerNO": "1"
  }
}
```


### getInfoById（管理员）
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/customers/info?id=1`  
- **权限**：管理员  
- **说明**：获取用户所有信息（管理员）  
- **请求参数**：
  - `id`: （示例：1）
- **返回值**：
```json
{
  "success": true,
  "customers": 
    {
      "CustomerNO": "1",
      "Username": "Username",
      "FirstName": "FirstName",
      "LastName": "LastName",
      "Phone": "123-456-7890",
      "Email": "email@email.com",
      "ID": "IDType",
      "IDNo": "IDNO",
      "IsAdmin": 0,
    }
}
```


### updateProfile（登录）
- **方法**：PUT  
- **URL**：`https://cs6083-project.onrender.com/api/customers/update?id=1`  
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
- **URL**：`https://cs6083-project.onrender.com/api/customers/reset`  
- **权限**：登录  
- **说明**：用户主动更新密码，需要登录和旧密码  
- **请求体**：
```json
{
    "oldPasswd": "test111",
    "newPasswd": "test222"
}
```


### getMyProfile（登录）
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/customers/me`  
- **权限**：登录  
- **说明**：获取当前登录用户的信息（登录）  
- **返回值**：
```json
{
  "success": true,
  "customers": [
    {
      "Username": "Username",
      "CustomerNO": "1",
      "FirstName": "FirstName",
      "LastName": "LastName",
      "Phone": "123-456-7890",
      "Email": "Email@email.com",
      "ID": "IDType"
      }
  ]
}
```


## Event 模块

### status: 0 for upcoming, 1 for cancelled, 2 for past

### getAllEvents
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/events?type=HXY_SEMINAR&sdate=&edate=`  
- **权限**：无权限要求  
- **说明**：无  
- **请求参数**：
  - `type`: 留空时查所有type的event（示例：HXY_SEMINAR）
  - `sdate`: startDate，可单独使用查某日的event（示例：）
  - `edate`: endDate，用于和sdate合并为时间段，不可单独使用（示例：）
- **返回值**：
```json
{
    "success": true,
    "events": [
        {
            "ENVENTID": 36,
            "ENAME": "TESts111",
            "ETYPE": "HXY_SEMINAR",
            "STARTDATE": "2001-11-22T05:00:00.000Z",
            "ENDDATE": "2023-11-22T05:00:00.000Z",
            "TOPICID": 3,
            "STATUS": 0,
            "TopicName": "Science Fiction",
            "AuthorName": "Sarah Taylor"
        }
    ]
}
```

### getBasicInfoById
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/events/id?id=11`  
- **权限**：无权限要求  
- **说明**：根据eventID获取event的基本信息  
- **请求参数**：
  - `id`: （示例：11）
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "events": [
        {
            "ENVENTID": 11,
            "ENAME": "Modern Art Exhibition",
            "ETYPE": "HXY_EXHIBITION",
            "STARTDATE": "2024-01-05T05:00:00.000Z",
            "ENDDATE": "2024-01-07T05:00:00.000Z",
            "TOPICID": 1,
            "STATUS": 0,
            "Topic": "Horror",
            "Author": null
        }
    ]
}
```

### getAllInfoById（管理员）
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/events/info?id=1`  
- **权限**：管理员  
- **说明**：获取包括赞助商、预算等全部信息（管理员）  
- **请求参数**：
  - `id`: （示例：1）
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "events": [
        {
            "ENVENTID": 1,
            "ENAME": "AI Technology Seminar",
            "ETYPE": "HXY_SEMINAR",
            "STARTDATE": "2024-01-10T05:00:00.000Z",
            "ENDDATE": "2024-01-12T05:00:00.000Z",
            "TOPICID": 1,
            "STATUS": 0,
            "Topic": "Horror",
            "Author": "James Smith,Michael Wilson,Robert Brown",
            "Sponsor": "Emily Davis",
            "Amount": "15000.00"
        }
    ]
}
```

### getByName
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/events/search?name=ai`  
- **权限**：无权限要求  
- **说明**：根据event名搜索  
- **请求参数**：
  - `name`: （示例：ai）
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "events": [
        {
            "ENVENTID": 1,
            "ENAME": "AI Technology Seminar",
            "ETYPE": "HXY_SEMINAR",
            "STARTDATE": "2024-01-10T05:00:00.000Z",
            "ENDDATE": "2024-01-12T05:00:00.000Z",
            "TOPICID": 1,
            "STATUS": 0,
            "TopicName": "Horror",
            "Author": "James Smith, Michael Wilson, Robert Brown"
        }
    ]
}
```


### addSeminar（管理员）
- **方法**：POST  
- **URL**：`https://cs6083-project.onrender.com/api/events/seminar/add`  
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
- **URL**：`https://cs6083-project.onrender.com/api/events/exhibition/add`  
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
- **URL**：`https://cs6083-project.onrender.com/api/events/cancel?id=30`  
- **权限**：管理员  
- **说明**：无  
- **请求参数**：
  - `id`: （示例：30）


### registerExhibition（登录）
- **方法**：POST  
- **URL**：`https://cs6083-project.onrender.com/api/events/exhibition/register`  
- **权限**：登录  
- **说明**：无  
- **请求体**：
```json
{
    "regID": "test",
    "eventID": 11
}
```


### cancelExhibitionRegisteration（登录）
- **方法**：DELETE  
- **URL**：`https://cs6083-project.onrender.com/api/events/exhibition/cancel`  
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
- **URL**：`https://cs6083-project.onrender.com/api/events/topic?topicID=3`  
- **权限**：无权限要求  
- **说明**：无  
- **请求参数**：
  - `topicID`: （示例：3）
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "events": [
        {
            "ENVENTID": 37,
            "ENAME": "TEStEE111",
            "ETYPE": "HXY_EXHIBITION",
            "STARTDATE": "2001-11-22T05:00:00.000Z",
            "ENDDATE": "2023-11-22T05:00:00.000Z",
            "TOPICID": 3,
            "STATUS": 0,
            "TopicName": "Science Fiction",
            "Author": null
        }
    ]
}
```

### getSeminarByAuthor
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/events/seminar/author?author=1`  
- **权限**：无权限要求  
- **说明**：根据authorID获取seminar  
- **请求参数**：
  - `author`: （示例：1）
- **返回值**：
```json
{
    "success": true,
    "seminars": [
        {
            "ENVENTID": 1,
            "ENAME": "AI Technology Seminar",
            "ETYPE": "HXY_SEMINAR",
            "STARTDATE": "2024-01-10T05:00:00.000Z",
            "ENDDATE": "2024-01-12T05:00:00.000Z",
            "TOPICID": 1,
            "STATUS": 0,
            "Author": "James Smith"
        }
    ]
}
```

## Invoices 模块

### getAllInvoices（管理员）
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/invoices`  
- **权限**：管理员  
- **说明**：无  
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "invoices": [
        {
            "RENTID": 1,
            "InvoiceDate": "2025-03-31T04:00:00.000Z",
            "Amount": "0.80",
            "CustomerNo": 1,
            "CustomerName": "pig piggy"
        }
    ]
}
```

### getById（管理员）
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/invoices/id?id=1`  
- **权限**：管理员  
- **说明**：无  
- **请求参数**：
  - `id`: （示例：1）
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "invoices": [
        {
            "RENTNo": 1,
            "InvoiceDate": "2025-03-31T04:00:00.000Z",
            "Amount": "0.80",
            "CustomerNo": 1,
            "CustomerName": "pig piggy",
            "PaidAmount": "0.80",
            "RemainingAmount": "0.00",
            "IsPaid": 1
        }
    ]
}
```

### getByCustomer（管理员）
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/invoices/customer?id=1`  
- **权限**：管理员  
- **说明**：无  
- **请求参数**：
  - `id`: （示例：1）
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "invoices": [
        {
            "RENTNo": 1,
            "InvoiceDate": "2025-03-31T04:00:00.000Z",
            "Amount": "0.80",
            "CustomerNo": 1,
            "CustomerName": "pig piggy",
            "PaidAmount": "0.80",
            "RemainingAmount": "0.00",
            "IsPaid": 1
        }
    ]
}
```

### getInvoiceStatus（管理员）
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/invoices/status?rentId=1`  
- **权限**：管理员  
- **说明**：查看invoice是否全额支付及剩余额度  
- **请求参数**：
  - `rentId`: （示例：1）
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "payments": [
        {
            "RentNo": 1,
            "CustomerNo": 1,
            "PaidAmount": "0.80",
            "InvoiceAmount": "0.80",
            "IsPaid": 1,
            "RemainingAmount": "0.00"
        }
    ]
}
```

### getCustomerUnpaid（管理员）
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/invoices/unpaid/customer?id=3`  
- **权限**：管理员  
- **说明**：根据custid获取未支付invoice  
- **请求参数**：
  - `id`: （示例：3）
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "invoices": [
        {
            "RentNo": 2,
            "CustomerNo": 3,
            "InvoiceAmount": "1602.20",
            "PaidAmount": "0",
            "RemainingAmount": "1602.20"
        }
    ]
}
```

### getUnpaid（管理员）
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/invoices/unpaid`  
- **权限**：管理员  
- **说明**：获取所有未支付invoice  
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "invoices": [
        {
            "RentNo": 2,
            "CustomerNo": 3,
            "InvoiceAmount": "1602.20",
            "PaidAmount": "0",
            "RemainingAmount": "1602.20"
        }
    ]
}
```

### getMyInvoice（登录）
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/invoices/my`  
- **权限**：登录  
- **说明**：获取当前用户的所有invoice  
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "invoices": [
        {
            "RENTNo": 1,
            "InvoiceDate": "2025-03-31T04:00:00.000Z",
            "Amount": "0.80",
            "CustomerNo": 1,
            "CustomerName": "pig piggy",
            "PaidAmount": "0.80",
            "RemainingAmount": "0.00",
            "IsPaid": 1
        }
    ]
}
```

### getMyUnpaidInvoice（登录）
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/invoices/my/unpaid`  
- **权限**：登录  
- **说明**：获取当前用户未支付invoice  
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "invoices": [
        {
            "RentNo": 1,
            "CustomerNo": 1,
            "InvoiceAmount": "0.80",
            "PaidAmount": "0.80",
            "RemainingAmount": "0.00"
        }
    ]
}
```

## Payment 模块

### myPayments（登录）
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/payments/my`  
- **权限**：登录  
- **说明**：获取当前用户的所有支付记录  
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "payments": [
        {
            "PaymentId": 1,
            "PayDate": "2025-04-01T04:00:00.000Z",
            "Method": "Cash",
            "Amount": "0.80",
            "RentNo": 1,
            "CustomerNo": 1,
            "CreditCardName": null,
            "CustomerName": "pig piggy"
        },
        {
            "PaymentId": 11,
            "PayDate": "2025-05-02T04:00:00.000Z",
            "Method": "Cash",
            "Amount": "0.00",
            "RentNo": 26,
            "CustomerNo": 1,
            "CreditCardName": null,
            "CustomerName": "pig piggy"
        }
    ]
}
```

### getAllPayment（管理员）
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/payments?sdate=2025-03-01&edate=2025-05-02`  
- **权限**：管理员  
- **说明**：获取所有payment，edate留空查询sdate当天的payment，不留空查询时间段内的payment  
- **请求参数**：
  - `sdate`: （示例：2025-03-01）
  - `edate`: （示例：2025-05-02）
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "payments": [
        {
            "PaymentId": 11,
            "PayDate": "2025-05-02T04:00:00.000Z",
            "Method": "Cash",
            "Amount": "0.00",
            "RentNo": 26,
            "CustomerNo": 1,
            "CreditCardName": null,
            "CustomerName": "pig piggy"
        }
    ]
}
```

### getPaymentById（管理员）
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/payments/id?id=1`  
- **权限**：管理员  
- **说明**：无  
- **请求参数**：
  - `id`: （示例：1）
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "payments": [
        {
            "PaymentId": 1,
            "PayDate": "2025-04-01T04:00:00.000Z",
            "Method": "Cash",
            "Amount": "0.80",
            "RentNo": 1,
            "CustomerNo": 1,
            "CreditCardName": null,
            "CustomerName": "pig piggy"
        }
    ]
}
```

### getByInvoice（管理员）
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/payments/invoice?id=1`  
- **权限**：管理员  
- **说明**：无  
- **请求参数**：
  - `id`: （示例：1）
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "payments": [
        {
            "PaymentId": 1,
            "PayDate": "2025-04-01T04:00:00.000Z",
            "Method": "Cash",
            "PaidAmount": "0.80",
            "RentNo": 1,
            "CustomerNo": 1,
            "CreditCardName": null,
            "CustomerName": "pig piggy"
        }
    ]
}
```

### getByCustomerId（管理员）
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/payments/customer?id=1`  
- **权限**：管理员  
- **说明**：获取某customer对应的所有支付  
- **请求参数**：
  - `id`: （示例：1）
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "payments": [
        {
            "PaymentId": 11,
            "PayDate": "2025-05-02T04:00:00.000Z",
            "Method": "Cash",
            "Amount": "0.00",
            "RentNo": 26,
            "CustomerNo": 1,
            "CreditCardName": null,
            "CustomerName": "pig piggy"
        }
    ]
}
```

### makePayment（登录）
- **方法**：POST  
- **URL**：`https://cs6083-project.onrender.com/api/payments/pay`  
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
- **URL**：`https://cs6083-project.onrender.com/api/reservations/my`  
- **权限**：登录  
- **说明**：获取当前用户所有预约，可按日期和房间号筛选  
- **请求体**：
```json
{
    "roomNO":null,
    "rdate": null
}
```
- **返回值**：
```json
{
    "success": true,
    "code": 0,
    "result": [
        {
            "RESID": 25,
            "TOPIC": "birthday party",
            "RESDATE": "2035-10-31T04:00:00.000Z",
            "STARTTIME": "15:00:00",
            "ENDTIME": "16:00:00",
            "NOI": 2,
            "CUSTNO": 1,
            "ROOMNO": 103,
            "ISACTIVE": 0
        }
    ]
}
```

### getAllReservation（管理员）
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/reservations`  
- **权限**：管理员  
- **说明**：无  
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "reservations": [
        {
            "RESID": 25,
            "TOPIC": "birthday party",
            "RESDATE": "2035-10-31T04:00:00.000Z",
            "STARTTIME": "15:00:00",
            "ENDTIME": "16:00:00",
            "NOI": 2,
            "CUSTNO": 1,
            "ROOMNO": 103,
            "ISACTIVE": 0
        }
    ]
}
```

### getById（管理员）
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/reservations/id?id=1`  
- **权限**：管理员  
- **说明**：无  
- **请求参数**：
  - `id`: （示例：1）
- **返回值**：
```json
{
    "success": true,
    "reservations": [
        {
            "RESID": 3,
            "TOPIC": "AI Ethics Discussion",
            "RESDATE": "2024-03-15T04:00:00.000Z",
            "STARTTIME": "10:00:00",
            "ENDTIME": "12:00:00",
            "NOI": 3,
            "CUSTNO": 1,
            "ROOMNO": 105,
            "ISACTIVE": 1
        }
    ]
}
```

### searchReservation（管理员）
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/reservations/search`  
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
- **返回值**：
```json
{
    "success": true,
    "code": 0,
    "result": [
        {
            "RESID": 1,
            "TOPIC": "Machine Learning Study",
            "RESDATE": "2024-01-05T05:00:00.000Z",
            "STARTTIME": "09:00:00",
            "ENDTIME": "11:00:00",
            "NOI": 4,
            "CUSTNO": 1,
            "ROOMNO": 101,
            "ISACTIVE": 1
        }
    ]
}
```

### makeReservation（登录）
- **方法**：POST  
- **URL**：`https://cs6083-project.onrender.com/api/reservations/reserve`  
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
- **URL**：`https://cs6083-project.onrender.com/api/reservations/reserve/cancel?reservation=21`  
- **权限**：登录  
- **说明**：无  
- **请求参数**：
  - `reservation`: （示例：21）


## Room 模块

### getAllRooms
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/rooms`  
- **权限**：无权限要求  
- **说明**：无  
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "rooms": [
        {
            "ROOMNO": 101,
            "CAPACITY": 50
        }
    ]
}
```

### getByID
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/rooms/id?id=102`  
- **权限**：无权限要求  
- **说明**：无  
- **请求参数**：
  - `id`: （示例：102）
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "rooms": [
        {
            "ROOMNO": 102,
            "CAPACITY": 12,
            "ISDELETED": 0
        }
    ]
}
```

### getAvailableSlots
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/rooms/slots?roomID=102&date=2024-12-25`  
- **权限**：无权限要求  
- **说明**：无  
- **请求参数**：
  - `roomNO`: （示例：102）
  - `date`: （示例：2024-12-25）
- **请求体**：
```json
{
    "capacity": 99
}
```
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "slots": [
        {
            "start": "09:00:00",
            "end": "10:00:00"
        }
    ]
}
```


### addRoom（管理员）
- **方法**：POST  
- **URL**：`https://cs6083-project.onrender.com/api/rooms/add`  
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
- **URL**：`https://cs6083-project.onrender.com/api/rooms/del?id=908`  
- **权限**：管理员  
- **说明**：无  
- **请求参数**：
  - `id`: （示例：908）


## Author 模块

### getAllAuthors
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/author`  
- **权限**：无权限要求  
- **说明**：无  
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "authors": [
        {
            "AUTHNO": 12,
            "NAME": "updatef updatel"
        }
    ]
}
```          

### getByID
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/author/id?id=1`  
- **权限**：无权限要求  
- **说明**：根据id获取author详细信息（管理员）  
- **请求参数**：
  - `id`: （示例：1）
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "authors": [
        {
            "AUTHNO": 1,
            "AFNAME": "James",
            "ALNAME": "Smith",
            "STREET": "100 Maple St",
            "CITY": "Boston",
            "ZIPCODE": "02108",
            "EMAIL": "james.smith@example.com",
            "ISDELETED": 0
        }
    ]
}
```


### addAuthor（管理员）
- **方法**：POST  
- **URL**：`https://cs6083-project.onrender.com/api/author/add`  
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
- **URL**：`https://cs6083-project.onrender.com/api/author/update?id=12`  
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
- **URL**：`https://cs6083-project.onrender.com/api/author/del?id=11`  
- **权限**：管理员  
- **说明**：根据id软删除author（管理员）  
- **请求参数**：
  - `id`: （示例：11）


## Book 模块

### getAllBooks
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/books`  
- **权限**：无权限要求  
- **说明**：无  
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "books": [
        {
            "BookNo": 15,
            "Title": "hahahaha",
            "Topic": "Romance",
            "Author": "Sarah Taylor",
            "AvailableAmount": 0
        }
    ]
}
```

### getById
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/books/id?id=1`  
- **权限**：无权限要求  
- **说明**：无  
- **请求参数**：
  - `id`: （示例：1）
- **返回值**：
```json
{
    "success": true,
    "book": {
        "BookNo": 1,
        "Title": "Mystery of the Shadows",
        "Topic": "Horror",
        "Author": "James Smith",
        "AvailableAmount": 0,
        "copies": [
            {
                "COPYNO": 3,
                "STATUS": "Not Available",
                "BOOKNO": 1,
                "ISDELETED": 0
            }
        ]
    }
}
```

### searchByTitle
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/books/search?title=py`  
- **权限**：无权限要求  
- **说明**：无  
- **请求参数**：
  - `title`: 书名关键词（示例：py）
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "books": [
        {
            "BookNo": 5,
            "Title": "History of the Internet",
            "Topic": "Children",
            "Author": "Robert Brown",
            "AvailableAmount": 0
        }
    ]
}
```

### searchByAuthor
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/books/search/author?author=smith`  
- **权限**：无权限要求  
- **说明**：无  
- **请求参数**：
  - `author`: （示例：smith）
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "books": [
        {
            "BookNo": 9,
            "Title": "Financial Planning 101",
            "Topic": "Mystery",
            "Author": "James Smith",
            "AvailableAmount": 0
        }
    ]
}
```

### searchByAuthor
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/books/trend`  
- **权限**：无权限要求  
- **说明**：无  
- **请求体**：
```json
{
    "time": "week", (可选值：day/week/month, 默认week)
    "author": "smith",
    "count": 5
}
```
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "books": [
        {
            "BookNo": 9,
            "Title": "Financial Planning 101",
            "Topic": "Mystery",
            "Author": "James Smith",
            "AvailableAmount": 0
        }
    ]
}
```


### rentBook（登录）
- **方法**：POST  
- **URL**：`https://cs6083-project.onrender.com/api/books/rental/rent`  
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
- **URL**：`https://cs6083-project.onrender.com/api/books/rental/return`  
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
- **URL**：`https://cs6083-project.onrender.com/api/books/add`  
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
- **URL**：`https://cs6083-project.onrender.com/api/books/add/copy`  
- **权限**：管理员  
- **说明**：无  
- **请求体**：
```json
{
    "bookNO": 16
}
```


### deleteCopy（管理员）
- **方法**：DELETE  
- **URL**：`https://cs6083-project.onrender.com/api/books/del/copy`  
- **权限**：管理员  
- **说明**：无  
- **请求体**：
```json
{
    "bookNO" : 16,
    "copyNO" : 12
}
```


### deleteBook（管理员）
- **方法**：DELETE  
- **URL**：`https://cs6083-project.onrender.com/api/books/del?id=16`  
- **权限**：管理员  
- **说明**：无  
- **请求参数**：
  - `id`: （示例：16）


## Sponsor 模块

### getAllSponsors（管理员）
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/sponsors`  
- **权限**：管理员  
- **说明**：无  
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "sponsors": [
        {
            "SponsorNo": 10,
            "SponsorType": "HXY_INDIVIDUAL",
            "SponsorName": "Daniel Garcia"
        },
        {
            "SponsorNo": 11,
            "SponsorType": "HXY_ORGANIZATION",
            "SponsorName": "Global Tech Solutions"
        }
    ]
}
```

### getByID（管理员）
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/sponsors/id?id=1`  
- **权限**：管理员  
- **说明**：无  
- **请求参数**：
  - `id`: （示例：1）
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "sponsors": [
        {
            "SponsorNo": 1,
            "SponsorType": "HXY_INDIVIDUAL",
            "SponsorName": "John Doe"
        }
    ]
}
```

### addSponsor（管理员）
- **方法**：POST  
- **URL**：`https://cs6083-project.onrender.com/api/sponsors/add`  
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
- **URL**：`https://cs6083-project.onrender.com/api/sponsors/del?id=21`  
- **权限**：管理员  
- **说明**：无  
- **请求参数**：
  - `id`: （示例：21）


## Topic 模块

### getAllTopics
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/topics`  
- **权限**：无权限要求  
- **说明**：无  
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "topics": [
        {
            "TOPICID": 1,
            "TNAME": "Horror",
            "ISDELETED": 0
        }
    ]
}
```

### getById
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/topics/id?id=1`  
- **权限**：无权限要求  
- **说明**：无  
- **请求参数**：
  - `id`: （示例：1）
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "topics": [
        {
            "TOPICID": 1,
            "TNAME": "Horror",
            "ISDELETED": 0
        }
    ]
}
```

### getByName
- **方法**：GET  
- **URL**：`https://cs6083-project.onrender.com/api/topics/search?name=ho`  
- **权限**：无权限要求  
- **说明**：无  
- **请求参数**：
  - `name`: （示例：ho）
- **返回值**：
```json
{
    "success": true,
    "message": "ok",
    "topics": [
        {
            "TOPICID": 1,
            "TNAME": "Horror",
            "ISDELETED": 0
        }
    ]
}
```

### addTopic（管理员）
- **方法**：POST  
- **URL**：`https://cs6083-project.onrender.com/api/topics/add`  
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
- **URL**：`https://cs6083-project.onrender.com/api/topics/del?id=11`  
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