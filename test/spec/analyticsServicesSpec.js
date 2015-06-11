/**
 * Created by Sabe on 6/11/2015.
 */
'use strict';

describe('analyticsServices', function () {

  before(function() {
    sinon.stub(ga); // Google Analytics doesn't provide methods on the object

    // User identification
    sinon.stub(amplitude, 'setUserId');
    sinon.stub(mixpanel, 'alias');
    sinon.stub(mixpanel, 'identify');

    // Events
    sinon.stub(amplitude, 'logEvent');
    sinon.stub(mixpanel, 'track');

    // User-level properties
    sinon.stub(amplitude, 'setUserProperties');
    sinon.stub(mixpanel, 'register');

  });

  beforeEach(function() {
    inject(function(Analytics) {
      analytics = Analytics;
    });
  });

  afterEach(function() {
    amplitude.setUserId.reset();
    amplitude.logEvent.reset();
    amplitude.setUserProperties.reset();
    ga.reset();
    mixpanel.alias.reset();
    mixpanel.identify.reset();
    mixpanel.track.reset();
    mixpanel.register.reset();
  });

  it('sets up tracking when user registers', function() {
    analytics.register();
    expect(amplitude.setUserId).to.have.been.calledOnce;
    expect(ga).to.have.been.calledOnce;
    expect(ga).to.have.been.calledWith('create');
    expect(mixpanel.alias).to.have.been.calledOnce;
  });

  it('sets up tracking when user logs in', function() {
    analytics.login();
    expect(amplitude.setUserId).to.have.been.calledOnce;
    expect(ga).to.have.been.calledOnce;
    expect(ga).to.have.been.calledWith('create');
    expect(mixpanel.identify).to.have.been.calledOnce;
  });

  it('tracks a simple user action', function() {
    analytics.track('action');
    expect(amplitude.logEvent).to.have.been.calledOnce;
    expect(amplitude.logEvent).to.have.been.calledWith('action');
    expect(ga).to.have.been.calledOnce;
    expect(ga).to.have.been.calledWith('send','event','behavior','action');
    expect(mixpanel.track).to.have.been.calledOnce;
    expect(mixpanel.track).to.have.been.calledWith('action');
  });

  it('tracks a user action with properties', function() {
    analytics.track('action',{'booleanProperty': true, 'numericProperty': 17, 'stringProperty': 'bagel'});
    expect(amplitude.logEvent).to.have.been.calledOnce;
    expect(amplitude.logEvent).to.have.been.calledWith('action',{'booleanProperty': true, 'numericProperty': 17, 'stringProperty': 'bagel'});
    expect(ga).to.have.been.calledOnce;
    expect(ga).to.have.been.calledWith('send','event','behavior','action');
    expect(mixpanel.track).to.have.been.calledOnce;
    expect(mixpanel.track).to.have.been.calledWith('action',{'booleanProperty': true, 'numericProperty': 17, 'stringProperty': 'bagel'});
  });

  it('updates user-level properties', function() {
    analytics.updateUser({'userBoolean': false, 'userNumber': -8, 'userString': 'Enlightened'});
    expet(amplitude.setUserProperties).to.have.been.calledOnce;
    expet(amplitude.setUserProperties).to.have.been.calledWith({'userBoolean': false, 'userNumber': -8, 'userString': 'Enlightened'});
    expect(ga).to.have.been.calledOnce;
    expect(ga).to.have.been.calledWith('set',{'userBoolean': false, 'userNumber': -8, 'userString': 'Enlightened'});
    expect(mixpanel.register).to.have.been.calledOnce;
    expect(mixpanel.register).to.have.been.calledWith({'userBoolean': false, 'userNumber': -8, 'userString': 'Enlightened'});
  });

});
