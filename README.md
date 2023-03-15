# Bugs

1- Correction of getOneProject function:
When opening a project, the API was returning an array of projects. To fix this issue, I replaced the find() method with findOne() in the getOneProject controller.

2- Correction of project name in activity description:
The project name was displayed as "undefined" in the activity description. To fix this issue, I replaced "e.project" with "e.projectName".

3- Correction of username field:
When creating a new user, the form was sending "username" instead of "name". I corrected this error by modifying the corresponding field.

4- Correction of "update" button action:
When updating a user, the action of the "update" button was "onChange" instead of "onClick". I fixed this error by modifying the corresponding code.

5- Update of project list:
When creating a new project, the list was not updating. I added a function to update the API data.

6- Protection of "password" field:
The password of the users was returned by the API when calling the list of users. For security reasons, I blocked the return of this field in the API.

7- Correction of activity display:
When filling in the activities, the user received the list of activities of all users. I modified the "user.name" field to "user._id" to send the user ID, and I corrected the "user" field to "userId" in the request to match the model.

8- Update of activity list:
When deleting a project in the activities, the list was not updating. I added a function that updates the data upon deletion.

# Feature

It is possible to add multiple features to improve the project. However, due to the time constraint (between 30 minutes to 1 hour), I have implemented a simple feature of integrating roles for users (Administrator and User).

The Administrator (ADMIN) has access to all the site's features, while the User (USER) only has access to basic features.

Here are the tasks I have completed to integrate this feature:

- Added the "role" attribute in the "user" model in the API.
- Added the "role" attribute in the "postUser" controller in the API.
- Added the "role"="ADMIN" attribute in the registration form.
- Added the "role"="USER" attribute in the user addition form.
- Limited access to the "user" section for users (USER).
- Limited access to the "modify project" section for users (USER).
- Limited access to the monetary information of projects for users (USER).
- Hide the project modification feature for users (USER).
- Hide the project deletion feature in activities for users (USER).
