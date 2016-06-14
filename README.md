LexEVS System Test
===================

Docker based strategy for building, deploying, and testing lexevs, lexevs-remote, and lexevs-service (CTS2). 

## prerequisites
[Docker](https://docs.docker.com/) must be installed to run the LexEVS System Tests. 

## Usage
* Clone this repository.  
* CD to lexevs-system-test
* In a Docker enabled command line, run the test shell script.

Run the system tests, using all default git branches and repositories.

```
.\test.sh
```
Git branches and repositories can be passed in when running the test script.  
Note: Either specify all git branches and repositories or none (leave blank).

The following is the specific order of the parameters that need to passed in:
* ```LEXEVS_BRANCH``` - LexEVS git branch.  Default: dev
* ```LEXEVS_REPO``` - LexEVS git repository. Default: https://github.com/lexevs/lexevs.git
* ```LEXEVS_REMOTE_BRANCH``` - LexEVS Remote API branch. Default: dev
* ```LEXEVS_REMOTE_REPO``` - LexEVS Remote API repository. Default: https://github.com/lexevs/lexevs-remote.git
* ```URI_RESOLVER_TAG``` - URI Resolver tag. Default: tags/v1.0.0.FINAL
* ```URI_RESOLVER_REPO``` URI Resolver repository. Default: https://github.com/cts2/URI_Resolver.git
* ```LEXEVS_SERVICE_BRANCH``` - LexEVS Service (CTS2) branch. Default: dev
* ```LEXEVS_SERVICE_REPO``` - LexEVS Service (CTS2) repository. Default: https://github.com/cts2/lexevs-service.git

Example call: Run the system tests, specifying the git branches and repositories:

```
.\test.sh dev https://github.com/lexevs/lexevs.git dev https://github.com/lexevs/lexevs-remote.git tags/v1.0.0.FINAL https://github.com/cts2/URI_Resolver.git dev https://github.com/cts2/lexevs-service.git
```