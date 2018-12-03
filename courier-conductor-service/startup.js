/*

 ----------------------------------------------------------------------------
 | courier-conductor-service: QEWD-Courier Conductor MicroService           |
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

  05 October 2018

*/

var transform = require('qewd-transform-json').transform;
var config = require('./startup_config.json');
var ms_hosts_template = require('./ms_hosts.json');
var ms_routes = require('./ms_routes.json');
var local_routes = require('./local_routes.json');
var ms_config = require('./ms_config');
var helpers = require('./utils/helpers');

var global_config = require('/opt/qewd/mapped/settings/configuration.json');

var ms_hosts = transform(ms_hosts_template, global_config, helpers);
console.log('ms_hosts = ' + JSON.stringify(ms_hosts, null, 2));

config.jwt = global_config.jwt;

config.u_services = ms_config(ms_routes, ms_hosts);
var routes = local_routes;

config.moduleMap = {
  'ripple-admin': 'ripple-admin',
  'ripple-audit-log': 'ripple-audit-log',
  'speedTest': 'speedTest'
};

config.addMiddleware = function(bp, app, _this) {
  //var util = require('util');

  app.use(function(req, res, next) {
    // audit log application must be ready for use
    if (_this.audit_log) {

        //console.log(util.inspect(req));

        var messageObj = {
          url: req.originalUrl,
          method: req.method,
          cookie: req.headers.cookie,
          ip: req.headers['x-forwarded-for'],
          user_agent: req.headers['user-agent'],
          query: req.query,
          body: req.body
        };
        _this.audit_log(messageObj, function(responseObj) {
        });
    }
    next();
  });
};


module.exports = {
  config: config,
  routes: routes};
