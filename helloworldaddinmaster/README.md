# Hello World Mail Add-in for Outlook #

This is a simple [mail add-in for Outlook](https://msdn.microsoft.com/EN-US/library/office/fp161135.aspx) that activates in both read forms and compose forms for mail and appointments. It's based on the starter project that Visual Studio 2013 creates when you select the **App for Office** project template.

## What you'll need ##

- A web server with an SSL certificate
- An Office 365 account

## Running the sample ##

1. Clone or fork the project from GitHub.
2. Copy the `app` directory from the project to your web server.
3. Open `manifest.xml` in a text editor and update all instances of `https://<your web server>` to the base URL of the directory on your web server where you deployed the `app` directory.
4. Logon to [Outlook Web Access](https://outlook.office365.com). Click on the gear cog in the upper right corner of the page and click on `Manage apps`.
5. On the `Manage apps` page, click on the '+' icon, select `Add from file`. Browse to the `manifest.xml` file included in the project.
6. Return to the Mail view in Outlook Web Access.
7. To try the read mode functionality of the add-in, open any message and launch the `HelloWorld` app from the app bar.
8. To try the compose mode functionality of the add-in, create a new message. Click the `Apps` button and choose `HelloWorld`.

## Copyright ##

Copyright (c) Microsoft. All rights reserved.

----------
Connect with me on Twitter [@JasonJohMSFT](https://twitter.com/JasonJohMSFT)

Follow the [Exchange Dev Blog](http://blogs.msdn.com/b/exchangedev/)