/*jshint camelcase: false */

var _ = require('underscore'),
    $ = require('jquery'),
    GeoIpService = require('./geoip'),
    policyServiceUrl = "http://localhost.com/media-serices/";

function PolicyService() {
    this.cachedPolicies = {};
}

PolicyService.prototype = {
    /**
     * Returns the set of policy rules for a video.
     *
     * @param video Video to get the policy for.
     *
     * @returns A promise that resolves to a policy object of the form {geoBlocked: bool, embeddable: bool}
     * note that biz rules were that an internal failure should play 
     *  continue to provide good user experience > policy
     */
    getPolicy: function(video) {
        var dfd = $.Deferred(),
            self = this,
            cachedResponse,
            geoBlocked,
            embeddable,
            policy = {},
            defaultPolicy = {
                geoBlocked: false,
                embeddable: true,
            };

        // Check to see if we've already checked the policy service for this video.
        cachedResponse = this.cachedPolicies[video.id];

        if (cachedResponse) {
            dfd.resolve(cachedResponse);
        } else {

            // Default policies, in case the accessing the policy service fails.
            $.when(GeoIpService.getGeoLocation()).then(function(geoLocation) {
                // Successfully got geo location
                if (geoLocation.error){
                    dfd.resolve(defaultPolicy);
                    return;
                }

                // Check this video against the policy service.
                $.getJSON(policyServiceUrl, {
                    contentId: video.id,
                    iframe: window.parent === window, 
                    parent: window.location.hostname,
                    locale: geoLocation.country + ':' + geoLocation.region
                })
                // compose the policy response object
                .done(function(response) { 
                    // If geoblocked, |response.geo_filter| will be true, or set to 'CA' for Canada.
                    policy.geoBlocked = !_.isUndefined(response.geo_filter) 
                        && (response.geo_filter === true || response.geo_filter === 'CA');

                    // If embeddable (snaggable), |response.snag| must not be 'off' or 'no', and |response.blacklisted| must be undefined or false.
                    policy.embeddable = !_.contains(['off', 'no'], response.snag) && !response.blacklisted;

                    // Cache the response.
                    that.cachedPolicies[video.contentId] = policy;
                    dfd.resolve(policy);
                })
                .fail(function() {
                    dfd.resolve(defaultPolicy);
                });
            }, function() {
                // Failed to get geo location, so just resolve.
                dfd.resolve(defaultPolicy);
            });
        }

        return dfd.promise();
    }
};

module.exports = new PolicyService();
