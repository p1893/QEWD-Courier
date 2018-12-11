/*

 ----------------------------------------------------------------------------
 | courier-conductor: QEWD-Courier Conductor MicroService                   |
 |                                                                          |
 | Copyright (c) 2018 Ripple Foundation Community Interest Company          |
 | All rights reserved.                                                     |
 |                                                                          |
 | http://rippleosi.org                                                     |
 | Email: code.custodian@rippleosi.org                                      |
 |                                                                          |
 | Author: Rob Tweed, M/Gateway Developments Ltd                            |
 |                                                                          |
 | Licensed under the Apache License, Version 2.0 (the "License");          |
 | you may not use this file except in compliance with the License.         |
 | You may obtain a copy of the License at                                  |
 |                                                                          |
 |     http://www.apache.org/licenses/LICENSE-2.0                           |
 |                                                                          |
 | Unless required by applicable law or agreed to in writing, software      |
 | distributed under the License is distributed on an "AS IS" BASIS,        |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. |
 | See the License for the specific language governing permissions and      |
 |  limitations under the License.                                          |
 ----------------------------------------------------------------------------

  11 January 2018

*/

/* 
This is a smoke test.
Usage:
To check correct operation of QEWD-Courier microservice listening on port 8000:
  curl http://localhost:8000/api/smokeTest
  {"status": "ok"}
To check correct operation of web-server listening on port 80: 
  curl http://localhost/api/smokeTest
  {"status": "ok"}
*/

function smokeTest(args, finished) {
  finished({
    status: 'ok'
  });
};

module.exports = smokeTest;