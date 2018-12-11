/*

 ----------------------------------------------------------------------------
 | qewd-courier: Hello World Sample                                         |
 |                                                                          |
 | Copyright (c) 2017-18 Ripple Foundation Community Interest Company       |
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

  2 August 2017

*/

// Get the config settings
let config = require('./settings/startup_config.json');

// Get the jwt object from the global config settings and add to the local config
const global_config = require('/opt/qewd/mapped/global_settings/configuration.json');
config.jwt = global_config.jwt;

// Get the local routes
const local_routes = require('./settings/local_routes.json');

// Export the combined config and the local routes
module.exports = {
  config: config,
  routes: local_routes
};

