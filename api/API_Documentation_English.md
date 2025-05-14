
# API Documentation

## All requests that require login must include the following headers:
- `Authorization`: "Bearer " + token returned after login  
- `Content-Type`: "application/json"

## Auth Module

### register
- **Method**: POST  
- **URL**: `https://cs6083-project.onrender.com/api/auth/register`  
- **Permission**: None  
- **Description**: Register a new user  
- **Request Body**:
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
````

### login

* **Method**: GET
* **URL**: `https://cs6083-project.onrender.com/api/auth/login`
* **Permission**: None
* **Description**: Login
* **Request Body**:

```json
{
    "username": "Admin",
    "passwd": "123456"
}
```

* **Response**:

```json
{
  "success": true,
  "isAdmin": false,
  "token": token
}
```

### setAdmin (Admin Only)

* **Method**: PUT
* **URL**: `https://cs6083-project.onrender.com/api/auth/setAdmin`
* **Permission**: Admin
* **Description**: Set user as admin or not
* **Request Body**:

```json
{
    "id":2,
    "isAdmin":0
}
```

### requestResetPassword

* **Method**: PUT
* **URL**: `https://cs6083-project.onrender.com/api/auth/reset/request`
* **Permission**: None
* **Description**: Request to reset password; first checks if email is registered, then sends a verification code
* **Request Body**:

```json
{
    "email":"example@email.com"
}
```

### verifyToken

* **Method**: GET
* **URL**: `https://cs6083-project.onrender.com/api/auth/reset/verify`
* **Permission**: None
* **Description**: Verify the entered token
* **Request Body**:

```json
{
    "token":"D73G8F",
    "email":"example@email.com"
}
```

* **Response**:

```json
{
  "success": true,
  "message": "Token is valid",
  "token": token
}
```

### resetPassword

* **Method**: PUT
* **URL**: `https://cs6083-project.onrender.com/api/auth/reset`
* **Permission**: Token validated
* **Description**: Reset password
* **Request Body**:

```json
{
    "newPasswd":"newPasswd"
}
```

## Customer Module

### getAllCustomers (Admin Only)

* **Method**: GET
* **URL**: `https://cs6083-project.onrender.com/api/customers`
* **Permission**: Admin
* **Description**: Retrieve all customer info
* **Response**: *(see original content)*

### getById

* **Method**: GET
* **URL**: `https://cs6083-project.onrender.com/api/customers/id?id=1`
* **Permission**: None
* **Description**: Get basic customer info
* **Query Param**: `id`
* **Response**: *(see original content)*

### getInfoById (Admin Only)

* **Method**: GET
* **URL**: `https://cs6083-project.onrender.com/api/customers/info?id=1`
* **Permission**: Admin
* **Description**: Get all info of a customer
* **Query Param**: `id`
* **Response**: *(see original content)*

### updateProfile (Login Required)

* **Method**: PUT
* **URL**: `https://cs6083-project.onrender.com/api/customers/update?id=1`
* **Permission**: Login
* **Description**: Update customer profile
* **Query Param**: `id`
* **Request Body**: *(see original content)*

### resetPassword (Login Required)

* **Method**: PUT
* **URL**: `https://cs6083-project.onrender.com/api/customers/reset`
* **Permission**: Login
* **Description**: User resets their password (old + new password needed)
* **Request Body**: *(see original content)*

### getMyProfile (Login Required)

* **Method**: GET
* **URL**: `https://cs6083-project.onrender.com/api/customers/me`
* **Permission**: Login
* **Description**: Get current logged-in user’s info
* **Response**: *(see original content)*

## Event Module

> Note: `status`: 0 = upcoming, 1 = cancelled, 2 = past

### getAllEvents
- **Method**: GET  
- **URL**: `https://cs6083-project.onrender.com/api/events?type=HXY_SEMINAR&sdate=&edate=`  
- **Permission**: None  
- **Description**: Retrieve all events.  
- **Query Parameters**:  
  - `type`: (optional) Filter by event type (e.g. HXY_SEMINAR)  
  - `sdate`: (optional) Start date; can be used alone to query events on a specific day  
  - `edate`: (optional) End date; used with sdate to define a date range  
- **Response**:
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
````

### getBasicInfoById

* **Method**: GET
* **URL**: `https://cs6083-project.onrender.com/api/events/id?id=11`
* **Permission**: None
* **Description**: Retrieve basic info of an event by event ID
* **Query Parameter**:

  * `id`: (e.g. 11)
* **Response**:

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

### getAllInfoById (Admin Only)

* **Method**: GET
* **URL**: `https://cs6083-project.onrender.com/api/events/info?id=1`
* **Permission**: Admin
* **Description**: Retrieve all event info including sponsors and budget
* **Query Parameter**:

  * `id`: (e.g. 1)
* **Response**:

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

* **Method**: GET
* **URL**: `https://cs6083-project.onrender.com/api/events/search?name=ai`
* **Permission**: None
* **Description**: Search events by name
* **Query Parameter**:

  * `name`: (e.g. ai)
* **Response**:

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

### addSeminar (Admin Only)

* **Method**: POST
* **URL**: `https://cs6083-project.onrender.com/api/events/seminar/add`
* **Permission**: Admin
* **Description**: Add a new seminar
* **Request Body**:

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

### getAllRegistered (Admin Only)

* **Method**: GET
* **URL**: `https://cs6083-project.onrender.com/api/events/exhibition/regs?id=11`
* **Permission**: Admin
* **Description**: Retrieve all customers registered for an exhibition
* **Query Parameter**:

  * `id`: (e.g. 11)
* **Response**:

```json
{
    "success": true,
    "message": "ok",
    "reg": [
        {
            "CustomerNo": 5,
            "FirstName": "Emily",
            "LastName": "E",
            "CustomerEmail": "emilye@email.com",
            "CustomerPhone": "555-555-5555"
        }
    ]
}
```

### addExhibition (Admin Only)

* **Method**: POST
* **URL**: `https://cs6083-project.onrender.com/api/events/exhibition/add`
* **Permission**: Admin
* **Description**: Add a new exhibition
* **Request Body**:

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

### cancelEvent (Admin Only)

* **Method**: DELETE
* **URL**: `https://cs6083-project.onrender.com/api/events/cancel?id=30`
* **Permission**: Admin
* **Description**: Cancel an event
* **Query Parameter**:

  * `id`: (e.g. 30)

### registerExhibition (Login Required)

* **Method**: POST
* **URL**: `https://cs6083-project.onrender.com/api/events/exhibition/register`
* **Permission**: Login
* **Description**: Register for an exhibition
* **Request Body**:

```json
{
    "regID": "test",
    "eventID": 11
}
```

### cancelExhibitionRegistration (Login Required)

* **Method**: DELETE
* **URL**: `https://cs6083-project.onrender.com/api/events/exhibition/cancel`
* **Permission**: Login
* **Description**: Cancel exhibition registration
* **Request Body**:

```json
{
    "regID":"test"
}
```

### getByTopic

* **Method**: GET
* **URL**: `https://cs6083-project.onrender.com/api/events/topic?topicID=3`
* **Permission**: None
* **Description**: Get events by topic ID
* **Query Parameter**:

  * `topicID`: (e.g. 3)
* **Response**:

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

* **Method**: GET
* **URL**: `https://cs6083-project.onrender.com/api/events/seminar/author?author=1`
* **Permission**: None
* **Description**: Get seminars by author ID
* **Query Parameter**:

  * `author`: (e.g. 1)
* **Response**:

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

---

## Topic Module

### getAllTopics

* **Method**: GET
* **URL**: `https://cs6083-project.onrender.com/api/topics`
* **Permission**: None
* **Description**: Get all topics
* **Response**:

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

* **Method**: GET
* **URL**: `https://cs6083-project.onrender.com/api/topics/id?id=1`
* **Permission**: None
* **Description**: Get topic by ID
* **Query Parameter**:

  * `id`: (e.g. 1)
* **Response**:

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

* **Method**: GET
* **URL**: `https://cs6083-project.onrender.com/api/topics/search?name=ho`
* **Permission**: None
* **Description**: Search topic by name
* **Query Parameter**:

  * `name`: (e.g. ho)
* **Response**:

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

### addTopic (Admin Only)

* **Method**: POST
* **URL**: `https://cs6083-project.onrender.com/api/topics/add`
* **Permission**: Admin
* **Description**: Add new topic
* **Request Body**:

```json
{
    "tname":"hahaha"
}
```

### deleteTopic (Admin Only)

* **Method**: DELETE
* **URL**: `https://cs6083-project.onrender.com/api/topics/del?id=11`
* **Permission**: Admin
* **Description**: Delete topic by ID
* **Query Parameter**:

  * `id`: (e.g. 11)

```

```

## Error Codes

* `100`: Missing parameters
* `101`: Duplicate username/author name
* `102`: Object not found
* `103`: Book/Room/Event unavailable
* `104`: Wrong password
* `105`: Insufficient room capacity
* `106`: Invalid time range
* `666`: Too many books borrowed
* `667`: Unpaid invoice exists

## HTTP Status Codes

* `200`: OK
* `500`: Server error
* `401`: Unauthorized


