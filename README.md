Description:

- Based on Yeoman Angular Seed application (add github reference) from 14 January 2013. Implements the functionality of the 
AngularFire-seed app as of 14 January 2013.



Updates:

- Change watch config for js and jsTest tasks to recursively match subfolders (as we have a deeper directory structure than the angular seed app)
- Change watch config to run karma task on change to javascript files (i.e. full test suite run on save in test suite or js files)
- Change jshint config to apply to subfolders