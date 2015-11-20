## evias/PicPoll
PicPoll is a Parse CloudCode App providing with CloudCode Functions
and a nodeJS (+ express) web application. This package provides Pic
of the Month features such as Voting and Votes Statistics.

Deployment is very easy as the App can be deployed on the free Parse.com
tiers. You'll find more informations about this here: https://www.parse.com/docs/cloudcode

### Installation
Please make sure to have the Parse Command-Line Tools installed and configured
as described here: https://www.parse.com/docs/cloudcode/guide#command-line

For this installation example I will assume that you have already created
a Parse App with the name "myPicOfTheMonth".

First thing to do to be able to install the TwilioTreeBot App is to clone
the git repository with the source code.

    $ git clone https://github.com/evias/TwilioTreeBot.git
    $ cd TwilioTreeBot

Now that you have the source code, you will see a public/ directory and a
cloud/ directory. These two directories are important for the CloudCode API
provided by Parse.com. See following link for more details about CloudCode
Apps on Parse: https://www.parse.com/docs/cloudcode/guide

The last step of the installation is to deploy the application to the Parse
App "myPicOfTheMonth" you created earlier. The command-line tools from Parse
make this process very easy:

    $ parse new -a myPicOfTheMonth
    $ parse deploy myPicOfTheMonth

Your Feedback Management app is now online !

### Dependencies
    * jQuery 1.11
    * Parse CloudCode

### Support / Contact
You can contact me anytime at my e-mail address and I will be glad to answer
any type of questions related to this project.

Contributions are welcome if you see anything missing or have detected a
bug, want to develop a new API class, or whatever, I will be glad to respond
to pull requests!

Cheers,
Greg
