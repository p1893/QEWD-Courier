
/* 
This is an example of a handler function for the hello-world service.
Inputs:
  args.session  TODO - documentation
  finshed - function to call when this function has completed
  and is ready to return something

*/

function helloworld(args, finished) {

  // Your code goes here
  const response = {hello: 'world'}

  // Return the response using the finished function
  finished(response)
}

module.exports = helloworld;
