test schema:

user creation
http://localhost:PORTNUMBER/api/v1/users
"username":"cow",
"email":"cow@123gmail.com",
"password":"12345678"

user login
http://localhost:PORTNUMBER/api/v1/users/login
"email":"cow@123gmail.com",
"password":"12345678"

org creation
http://localhost:PORTNUMBER/api/v1/organizations
"name":"shudh doo doo",
"description":"farm milk to your mouth"

org adding members
http://localhost:PORTNUMBER/api/v1/organizations/:orgid/members


org removing members (use delete)
http://localhost:PORTNUMBER/api/v1/organizations/:orgid/members
