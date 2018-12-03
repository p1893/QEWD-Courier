function helloworld(args, finished) {
  args.session.ranInfoAt = Date.now();
  args.session.ranInfoOn = 'helloworld_microservice';

  var username = args.session.username;

  finished({
    helloworld: {
      args: args,
      loggedInAs: username,
      arch: process.arch,
      platform: process.platform,
      versions: process.versions,
      memory: process.memoryUsage()
    }
  });
}

module.exports = helloworld;
