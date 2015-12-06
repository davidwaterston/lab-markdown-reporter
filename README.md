# lab-markdown-reporter

A Markdown reporter for Hapi's [Lab](https://github.com/hapijs/lab) test runner.  
This was written because I need output from Lab that can be included with a commit or pull request to confirm that tests, etc have been run successfully. It looks best in GitHub but is also suitable for inclusion in BitBucket repos.


[![Semantic Versioning](https://img.shields.io/github/release/davidwaterston/lab-markdown-reporter.svg)](http://semver.org/)
[![MIT Licence](http://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/davidwaterston/lab-markdown-reporter/blob/master/LICENSE)
[![Releases signed with Gnu Privacy Guard](https://img.shields.io/badge/gpg-signed-green.svg)](#verifying-releases)
[![Stories in Progress](https://badge.waffle.io/davidwaterston/lab-markdown-reporter.svg?label=in%20progress&title=in progress)](http://waffle.io/davidwaterston/lab-markdown-reporter)
[![Join the Chat](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/davidwaterston/lab-markdown-reporter)

  
![Sample Output](https://cloud.githubusercontent.com/assets/876545/11616472/e7837cda-9c73-11e5-874c-429dc09d2031.png)
  
  
## Installation

Install lab-markdown-reporter as you would any other NPM package, by adding it to the package.json of your project.

#### If Lab is installed globally:

    lab -r ./node_modules/lab-markdown-reporter [-o outputfilename.ext]

The above relative path to `node_modules` is so a globally-installed `lab` knows to look in your local install.

#### If Lab is installed locally:

    ./node_modules/.bin/lab -r lab-markdown-reporter [-o outputfilename.ext]


## Compatibility
This reporter has been tested and confirmed to work with Lab versions 7.3.0 and later, though it is likely it will also work with earlier versions.


## Release History
See the [change log](https://github.com/davidwaterston/lab-markdown-reporter/blob/master/CHANGELOG.md) file for more details.


## Verifying Releases
I use <a href="http://semver.org" target="_blank" alt="Semantic Versioning">Semantic Versioning</a> to number releases. Each release is tagged with the appropriate version number and signed using <a href="https://www.gnupg.org" target="_blank" alt="Gnu Privacy Guard (GPG)">Gnu Privacy Guard (GPG)</a>. The public key used to sign releases is
```
Name: David Waterston
Email: david@davidwaterston.com
Key ID: A7AD9C85
Signature: 71A9 DC13 447A 1E4F C6EB  5D64 DE08 A991 A7AD 9C85
```
This public key is included in the repository with a SHA1 of 16d013451476fa4a1a67d6ad4b90583e205b53b1.
After cloning the repo, and assuming you have GPG installed correctly, you can import this key into your keychain
```
git cat-file blob pubkey | gpg --import
```
When this public key is successfully imported, you can use it to verify the integrity of any of the tagged releases of this repo
```
git tag -v v1.0.0
```
which should produce output similar to:
```
object 04f37a55784c1f3abc2cf927a935a488aa954035
type commit
tag v1.0.0
tagger David Waterston <david@davidwaterston.com> 1427387056 +0000

Initial commit

This is just an example so don't get fixated on the details, what matters is the signature!
gpg: Signature made Thu 26 Mar 16:24:16 2015 GMT using RSA key ID A7AD9C85
gpg: Good signature from "David Waterston <david@davidwaterston.com>" [ultimate]
```
The important thing to notice here is that the RSA key ID matches mine (A7AD9C85) and the line that says that this is a good signature.

The public key can further be verified by checking the details held on <a href="http://pgp.mit.edu/pks/lookup?search=david%40davidwaterston.com&op=index&fingerprint=on&exact=on" target="_blank" alt="pgp.mit.edu">pgp.mit.edu</a>.


##Missing a feature?
[Add your idea](http://feathub.com/davidwaterston/lab-markdown-reporter/features/new) or [vote on your favorite feature](http://feathub.com/davidwaterston/lab-markdown-reporter) to be implemented.
  

## Future Plans
Current and planned work for this repo is public and detailed in [Waffle](https://waffle.io/davidwaterston/lab-markdown-reporter).

## License
Copyright (c) 2015 David Waterston. All rights reserved.
Distributed under an MIT license. See the [LICENSE](https://github.com/davidwaterston/lab-markdown-reporter/blob/master/LICENSE) file for more details.
