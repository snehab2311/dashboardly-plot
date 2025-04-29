"Implement role-based access control (RBAC) for the 'Dashboardly' web application 

The system should support the following roles and access levels:

Someone who is just visiting the page should see only info and no access to EDA or creating dashboards, if they click on EDA/KPI builder it should ask the user to Sign in/sign up, so need to make this page for someone who has not signed in

Admin:
Full access to all features, data, and settings.
Ability to manage users, subscriptions, and system configurations.
Upon login, redirect to the admin dashboard with full application access.
Admin credentials :
Mail : snehabansode2311@gmail.com

Upon login, redirect to the landing page with all above access.

User (No Subscription):

New user who signs in as free user ( has not paid for any subscription)
Access to the landing page and free-tier features only which is access to EDA generator and features like Summary statistics in EDA and nothing else in EDA
Limited access to dashboards like should only be able to create 5 dashboard views

Upon login, redirect to the landing page with above access.

Please take care -
Login Redirection: Specified where each role should be directed upon successful login.
Implementation Details: Database schema, authentication logic, middleware, and view separation.
Security: Emphasize the importance of secure handling of authentication and authorization.
Scalability: Considers future expansion to multiple tiers of subscription