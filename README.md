## evias/PicPoll
PicPoll is a Parse CloudCode App providing with CloudCode Functions
and a nodeJS (+ express) web application. This package can be integrated
easily to any other Parse CloudCode App. The main purpose of this application
is to provide with a easy-to-install Picture Voting Module. A Back-end for
uploading new pictures and managing all other sorts of data is also under
development.

A Demo of this App deployed to a Parse Hosting can be found at following
URL : https://picpoll.parseapp.com

Deployment is very easy as the App can be deployed on the free Parse.com
tiers. You'll find more informations about this here: https://www.parse.com/docs/cloudcode

### Installation
Please make sure to have the Parse Command-Line Tools installed and configured
as described here: https://www.parse.com/docs/cloudcode/guide#command-line

For this installation example I will assume that you have already created
a Parse App with the name "myPicPollApp".

First thing to do to be able to install the PicPoll App is to clone
the git repository with the source code.

    $ git clone https://github.com/evias/PicPoll.git
    $ cd PicPoll

Now that you have the source code, you will see a public/ directory and a
cloud/ directory. These two directories are important for the CloudCode API
provided by Parse.com. See following link for more details about CloudCode
Apps on Parse: https://www.parse.com/docs/cloudcode/guide

The last step of the installation is to deploy the application to the Parse
App "myPicPollApp" you created earlier. The command-line tools from Parse
make this process very easy:

    $ parse new -a myPicPollApp
    $ parse deploy myPicPollApp

Your Feedback Management app is now online !

### Dependencies
    * jQuery 1.11
    * Parse CloudCode

### Hints / Advices
Using git, when you will modify your .parse.local file of the clone in order
to configure your parse command line tools to use your own Parse App, git will
see the .parse.local file as modified. To avoid having to communicate my Parse
App details, I use following command to mark the .parse.local file unchanged:

    $ git update-index [--assume-unchanged|--no-assume-unchanged]

### Git Branching
2 git branches will usually be updated in this repository, being the branch
*master* for releases (see git tags) and the branch *develop* for development
of features. Hotfixes might branch from *master* but will usually be tackled
from a *develop* branch or sub-branch.

### Support / Contact
You can contact me anytime at my e-mail address and I will be glad to answer
any type of questions related to this project.

Contributions are welcome if you see anything missing or have detected a
bug, want to develop a new API class, or whatever, I will be glad to respond
to pull requests!

Cheers,
Greg
