var $ = require('jquery'),
    countryCodes = require('./country-codes'),

function GeoIpService() {
  this.geoIpServiceUrl = '';
  this.cachedResult = null;
}

GeoIpService.prototype = {
    /**
     * Returns geo location data for the current user.
     * This is dependent on separate async GeoIpService lookup so we
     * wrap that promise with a new one adding the policy lookup and return that
     * to the caller for a consistent interface.
     *
     * @return {jQuery.Promise}
     *
     */
    getGeoLocation: function() {
        var dfd = $.Deferred(),
            self = this;

        if (this.cachedResult) {
            dfd.resolve(this.cachedResult);
        } else {
            // Get the geo location data.
            $.when($.get(this.geoIpServiceUrl)).then(function(response) {

                if (response.error) {
                    dfd.resolve({error: response.error });
                }

                // cache for subsequent calls, other videos, etc
                self.cachedResult = response;

                // either way return it from the cache
                dfd.resolve(response);
            }, function(err) {
                // Request failed, but resolve the promise anyway.
                dfd.resolve({error: err});
            });
        }

        return dfd.promise();
    },

    countryCodeToName: function(countryCode) {
        return countryCodes[countryCode] || 'unknown';
    }
};

// Export a singleton, since the user's IP should not change while viewing a page.
// lol of course it does though, like on mobile ... but maybe it should be the same region [europe whut?]
module.exports = exports = new GeoIpService();
