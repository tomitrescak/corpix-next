export const FormatValidators: { [index: string]: (str: string) => boolean} = {
  date: function(date: string) {
    if (typeof date !== 'string') {
      return true;
    }
    // full-date from http://tools.ietf.org/html/rfc3339#section-5.6
    let matches = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(date);
    if (matches === null) {
      return false;
    }
    // let year = matches[1];
    // let month = matches[2];
    // let day = matches[3];
    if (matches[2] < '01' || matches[2] > '12' || matches[3] < '01' || matches[3] > '31') {
      return false;
    }
    return true;
  },
  'date-time': function(dateTime: string) {
    if (typeof dateTime !== 'string') {
      return true;
    }
    // date-time from http://tools.ietf.org/html/rfc3339#section-5.6
    let s = dateTime.toLowerCase().split('t');
    if (!FormatValidators.date(s[0])) {
      return false;
    }
    let matches = /^([0-9]{2}):([0-9]{2}):([0-9]{2})(.[0-9]+)?(z|([+-][0-9]{2}:[0-9]{2}))$/.exec(
      s[1]
    );
    if (matches === null) {
      return false;
    }
    // let hour = matches[1];
    // let minute = matches[2];
    // let second = matches[3];
    // let fraction = matches[4];
    // let timezone = matches[5];
    if (matches[1] > '23' || matches[2] > '59' || matches[3] > '59') {
      return false;
    }
    return true;
  },
  email: function(email: string) {
    if (typeof email !== 'string') {
      return true;
    }
    // eslint-disable-next-line no-useless-escape
    let matches = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.exec(email);
    if (matches === null) {
      return false;
    }
    return true;
  },
  hostname: function(hostname: string) {
    if (typeof hostname !== 'string') {
      return true;
    }
    let valid = /^[a-zA-Z](([-0-9a-zA-Z]+)?[0-9a-zA-Z])?(\.[a-zA-Z](([-0-9a-zA-Z]+)?[0-9a-zA-Z])?)*$/.test(
      hostname
    );
    if (valid) {
      // the sum of all label octets and label lengths is limited to 255.
      if (hostname.length > 255) {
        return false;
      }
      // Each node has a label, which is zero to 63 octets in length
      let labels = hostname.split('.');
      for (let i = 0; i < labels.length; i++) {
        if (labels[i].length > 63) {
          return false;
        }
      }
    }
    return valid;
  },
  'host-name': function(hostname: string) {
    return FormatValidators.hostname.call(this, hostname);
  },
  ipv4: function(ipv4) {
    if (typeof ipv4 !== 'string') {
      return true;
    }
    let matches = /^(?:(?:^|\.)(?:2(?:5[0-5]|[0-4]\d)|1?\d?\d)){4}$/.exec(ipv4);
    if (matches === null) {
      return false;
    }
    return true;
  },
  ipv6: function(ipv6: string) {
    if (typeof ipv6 !== 'string') {
      return true;
    }
    let matches = /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/.exec(ipv6);
    if (matches === null) {
      return false;
    }
    return true;
  },
  regex: function(str: string) {
    try {
      RegExp(str);
      return true;
    } catch (e) {
      return false;
    }
  },
  uri: function(uri: string) {
    // if (this.options.strictUris) {
    //   return FormatValidators['strict-uri'].apply(this, arguments);
    // }
    // https://github.com/zaggino/z-schema/issues/18
    // RegExp from http://tools.ietf.org/html/rfc3986#appendix-B
    return (
      typeof uri !== 'string' ||
      RegExp('^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?').test(uri)
    );
  }
};

export default FormatValidators;
